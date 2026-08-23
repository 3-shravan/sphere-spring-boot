package com.sphere.post.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sphere.post.client.AuthorSummary;
import com.sphere.post.client.UserServiceClient;
import com.sphere.post.dto.request.CreateCommentRequest;
import com.sphere.post.dto.response.AuthorResponse;
import com.sphere.post.dto.response.CommentResponse;
import com.sphere.post.entity.Comment;
import com.sphere.post.entity.Post;
import com.sphere.post.exception.ForbiddenException;
import com.sphere.post.exception.NotFoundException;
import com.sphere.post.repository.CommentRepository;
import com.sphere.post.repository.PostRepository;

import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/controllers/feed/comment.controller.js.
 *
 * Status-code deviations from source (per your instruction to fix obvious
 * bugs, documented rather than silent — see docs/decisions/DECISIONS_REQUIRED.md #7):
 *  - Empty comment body: source threw `new ApiError(404, "Please enter a comment")`
 *    (semantically wrong — this is caller error, not "not found"). Here this
 *    is instead enforced by @NotBlank on CreateCommentRequest, which
 *    GlobalExceptionHandler maps to 422 ValidationError — closer to the
 *    Joi-driven `commnetPostSchema` behavior in the source than the
 *    hand-rolled 404 was, and consistent with every other validation error
 *    in this migration.
 *  - Non-author delete: source threw a 400 BadRequest ("You are not
 *    authorized to delete this comment"). Fixed to ForbiddenException (403)
 *    here — see exception.ForbiddenException javadoc.
 *
 * Structural deviation (documented): parent_comment_id is a real FK with
 * ON DELETE CASCADE, so deleting any comment — top-level or reply — always
 * correctly removes its whole subtree via the database, fixing the
 * source's orphan-replies bug (Decision #6) as a natural side effect of
 * the relational redesign rather than a special-cased fix.
 */
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserServiceClient userServiceClient;
    private final NotificationPublisher notificationPublisher;

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentTree(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new NotFoundException("Post not found");
        }
        List<Comment> flat = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        // O(n): group once by parentId, then recurse over the map — replaces
        // the earlier O(n^2) approach (re-filtering the full flat list at
        // every recursion level), per RECOMMENDED_IMPROVEMENTS.md's
        // "implement now" item. Behavior is identical, just faster on posts
        // with many comments.
        Map<Long, List<Comment>> byParent = new HashMap<>();
        for (Comment c : flat) {
            byParent.computeIfAbsent(c.getParentCommentId(), k -> new ArrayList<>()).add(c);
        }
        return buildTree(byParent, null);
    }

    private List<CommentResponse> buildTree(Map<Long, List<Comment>> byParent, Long parentId) {
        List<Comment> children = byParent.getOrDefault(parentId, List.of());
        List<CommentResponse> result = new ArrayList<>(children.size());
        for (Comment c : children) {
            List<CommentResponse> replies = buildTree(byParent, c.getId());
            result.add(new CommentResponse(
                    c.getId(),
                    new AuthorResponse(c.getAuthorId(), c.getAuthorName(), c.getAuthorProfilePicture()),
                    c.getComment(),
                    c.getParentCommentId(),
                    c.getCreatedAt(),
                    replies
            ));
        }
        return result;
    }

    @Transactional
    public CommentResponse addComment(Long currentUserId, Long postId, CreateCommentRequest request) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post not found"));

        Comment parent = null;
        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
                    .orElseThrow(() -> new NotFoundException("Parent comment not found"));
        }

        AuthorSummary author = resolveAuthor(currentUserId);

        Comment comment = Comment.builder()
                .postId(postId)
                .authorId(currentUserId)
                .authorName(author.name())
                .authorProfilePicture(author.profilePicture())
                .comment(request.comment())
                .parentCommentId(parent != null ? parent.getId() : null)
                .build();
        commentRepository.save(comment);

        if (parent != null) {
            if (!parent.getAuthorId().equals(currentUserId)) {
                notificationPublisher.publishReplyNotification(parent.getAuthorId(), currentUserId, author.name());
            }
        } else if (!post.getAuthorId().equals(currentUserId)) {
            notificationPublisher.publishCommentNotification(post.getAuthorId(), currentUserId, author.name());
        }

        return new CommentResponse(comment.getId(),
                new AuthorResponse(comment.getAuthorId(), comment.getAuthorName(), comment.getAuthorProfilePicture()),
                comment.getComment(), comment.getParentCommentId(), comment.getCreatedAt(), List.of());
    }

    @Transactional
    public void deleteComment(Long currentUserId, Long postId, Long commentId) {
        if (!postRepository.existsById(postId)) {
            throw new NotFoundException("Post not found");
        }
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new NotFoundException("Comment not found"));
        if (!comment.getAuthorId().equals(currentUserId)) {
            throw new ForbiddenException("You are not authorized to delete this comment");
        }
        // ON DELETE CASCADE on parent_comment_id handles the reply subtree.
        commentRepository.delete(comment);
    }

    private AuthorSummary resolveAuthor(Long userId) {
        return userServiceClient.getAuthorSummary(userId);
    }
}
