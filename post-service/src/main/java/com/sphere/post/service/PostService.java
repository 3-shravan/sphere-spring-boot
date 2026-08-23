package com.sphere.post.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.sphere.post.client.AuthorSummary;
import com.sphere.post.client.UserServiceClient;
import com.sphere.post.dto.request.CreatePostRequest;
import com.sphere.post.dto.request.CreateThoughtRequest;
import com.sphere.post.dto.request.UpdatePostRequest;
import com.sphere.post.dto.response.AuthorResponse;
import com.sphere.post.dto.response.FeedPageResponse;
import com.sphere.post.dto.response.PostResponse;
import com.sphere.post.entity.Post;
import com.sphere.post.entity.PostType;
import com.sphere.post.exception.BadRequestException;
import com.sphere.post.exception.NotFoundException;
import com.sphere.post.repository.CommentRepository;
import com.sphere.post.repository.PostLikeRepository;
import com.sphere.post.repository.PostRepository;
import com.sphere.post.repository.SavedPostRepository;

import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/controllers/feed/post.controller.js. See class-level
 * notes in entity.Post for the author-denormalization tradeoff, and
 * docs/02-target-architecture.md for the Feign-based following/blocked
 * scoping (replaces the source's in-process Mongo array lookups).
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final SavedPostRepository savedPostRepository;
    private final CommentRepository commentRepository;
    private final UserServiceClient userServiceClient;
    private final CloudinaryService cloudinaryService;
    private final NotificationPublisher notificationPublisher;
    private final Gson gson = new Gson();

    private static final List<Long> NONE = List.of(-1L);

    // ---------------------------------------------------------------
    // Feed
    // ---------------------------------------------------------------

    @Transactional(readOnly = true)
    public FeedPageResponse getGlobalFeed(Long currentUserId, int page, int limit) {
        List<Long> blocked = safeBlockedIds(currentUserId);
        Page<Post> result = postRepository.findGlobalFeed(blocked.isEmpty() ? NONE : blocked,
                PageRequest.of(page - 1, limit));
        return toFeedPage(result, currentUserId);
    }

    @Transactional(readOnly = true)
    public FeedPageResponse getFollowingFeed(Long currentUserId, int page, int limit) {
        List<Long> following = new ArrayList<>(safeFollowingIds(currentUserId));
        following.add(currentUserId); // scope = following ∪ {self}, matches source
        List<Long> blocked = safeBlockedIds(currentUserId);
        Page<Post> result = postRepository.findFollowingFeed(following, blocked.isEmpty() ? NONE : blocked,
                PageRequest.of(page - 1, limit));
        return toFeedPage(result, currentUserId);
    }

    @Transactional(readOnly = true)
    public FeedPageResponse getMyPosts(Long currentUserId, int page, int limit) {
        Page<Post> result = postRepository.findByAuthorIdOrderByCreatedAtDesc(currentUserId, PageRequest.of(page - 1, limit));
        return toFeedPage(result, currentUserId);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getSavedPosts(Long currentUserId) {
        List<Long> postIds = savedPostRepository.findPostIdsByUserId(currentUserId);
        if (postIds.isEmpty()) return List.of();
        List<Post> posts = postRepository.findAllById(postIds);
        // Preserve savedPosts ordering (most-recently-saved first), matching source.
        posts.sort((a, b) -> Integer.compare(postIds.indexOf(a.getId()), postIds.indexOf(b.getId())));
        return posts.stream().map(p -> toPostResponse(p, currentUserId)).toList();
    }

    @Transactional(readOnly = true)
    public PostResponse getSinglePost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post not found"));
        Long currentUserId = currentUserIdOrNull();
        return toPostResponse(post, currentUserId);
    }

    // ---------------------------------------------------------------
    // Create / Update / Delete
    // ---------------------------------------------------------------

    @Transactional
    public PostResponse createMediaPost(Long currentUserId, CreatePostRequest request, MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new BadRequestException("Please upload an image");
        }
        AuthorSummary author = resolveAuthor(currentUserId);
        CloudinaryService.UploadResult uploaded = cloudinaryService.upload(image, "posts");

        Post post = Post.builder()
                .authorId(currentUserId)
                .authorName(author.name())
                .authorProfilePicture(author.profilePicture())
                .postType(PostType.media)
                .caption(request.caption())
                .location(request.location())
                .tags(parseTags(request.tags()))
                .mediaUrl(uploaded.url())
                .mediaPublicId(uploaded.publicId())
                .build();

        postRepository.save(post);
        return toPostResponse(post, currentUserId);
    }

    @Transactional
    public PostResponse createThoughtPost(Long currentUserId, CreateThoughtRequest request) {
        AuthorSummary author = resolveAuthor(currentUserId);
        Post post = Post.builder()
                .authorId(currentUserId)
                .authorName(author.name())
                .authorProfilePicture(author.profilePicture())
                .postType(PostType.thought)
                .thoughts(request.thoughts())
                .build();
        postRepository.save(post);
        return toPostResponse(post, currentUserId);
    }

    public record UpdatePostResult(PostResponse post, boolean changed) {
    }

    @Transactional
    public UpdatePostResult updatePost(Long currentUserId, Long postId, UpdatePostRequest request, MultipartFile image) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post not found"));
        if (!post.getAuthorId().equals(currentUserId)) {
            throw new NotFoundException("Post not found"); // matches source: same 404 for not-found and not-owner
        }
        if (post.getPostType() == PostType.thought) {
            throw new BadRequestException("Thought posts cannot be updated this way.");
        }

        List<String> newTags = parseTags(request.tags());
        boolean hasNewImage = image != null && !image.isEmpty();
        boolean unchanged = eq(post.getCaption(), request.caption())
                && eq(post.getLocation(), request.location())
                && eq(post.getTags(), newTags)
                && !hasNewImage;

        if (unchanged) {
            return new UpdatePostResult(toPostResponse(post, currentUserId), false);
        }

        if (hasNewImage) {
            if (post.getMediaPublicId() != null) {
                cloudinaryService.delete(post.getMediaPublicId());
            }
            CloudinaryService.UploadResult uploaded = cloudinaryService.upload(image, "posts");
            post.setMediaUrl(uploaded.url());
            post.setMediaPublicId(uploaded.publicId());
        }

        if (request.caption() != null) post.setCaption(request.caption());
        if (request.location() != null) post.setLocation(request.location());
        if (request.tags() != null) post.setTags(newTags);

        postRepository.save(post);
        return new UpdatePostResult(toPostResponse(post, currentUserId), true);
    }

    @Transactional
    public void deletePost(Long currentUserId, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post not found"));
        if (!post.getAuthorId().equals(currentUserId)) {
            throw new NotFoundException("Post not found");
        }
        if (post.getMediaPublicId() != null) {
            cloudinaryService.delete(post.getMediaPublicId());
        }
        // Comments cascade via the DB FK (comments.post_id ON DELETE CASCADE) —
        // matches source's explicit Comment.deleteMany, done declaratively instead.
        postRepository.delete(post);
    }

    // ---------------------------------------------------------------
    // Like / Save
    // ---------------------------------------------------------------

    @Transactional
    public String toggleLike(Long currentUserId, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post not found"));

        boolean alreadyLiked = postLikeRepository.existsByPostIdAndUserId(postId, currentUserId);
        if (alreadyLiked) {
            postLikeRepository.deleteByPostIdAndUserId(postId, currentUserId);
            
            if (post.getRecentLikers() != null) {
                List<AuthorSummary> likers = new ArrayList<>(post.getRecentLikers());
                likers.removeIf(l -> l.id().equals(currentUserId));
                post.setRecentLikers(likers);
                postRepository.save(post);
            }
            return "Post unliked";
        }

        com.sphere.post.entity.PostLike like = new com.sphere.post.entity.PostLike();
        like.setPostId(postId);
        like.setUserId(currentUserId);
        postLikeRepository.save(like);

        // Add to recentLikers (denormalization)
        AuthorSummary liker = resolveAuthor(currentUserId);
        List<AuthorSummary> likers = post.getRecentLikers() == null ? new ArrayList<>() : new ArrayList<>(post.getRecentLikers());
        likers.removeIf(l -> l.id().equals(currentUserId)); // prevent duplicates if bugged
        likers.add(0, liker); // add to front (most recent)
        if (likers.size() > 3) {
            likers = likers.subList(0, 3);
        }
        post.setRecentLikers(likers);
        postRepository.save(post);

        // notification only on new-like, non-self — matches source
        if (!post.getAuthorId().equals(currentUserId)) {
            notificationPublisher.publishLikeNotification(post.getAuthorId(), currentUserId, liker.name());
        }
        return "Post liked \u2764";
    }

    @Transactional
    public String toggleSave(Long currentUserId, Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new NotFoundException("Post not found");
        }
        boolean alreadySaved = savedPostRepository.existsByUserIdAndPostId(currentUserId, postId);
        if (alreadySaved) {
            savedPostRepository.deleteByUserIdAndPostId(currentUserId, postId);
            return "Post unsaved.";
        }
        com.sphere.post.entity.SavedPost saved = new com.sphere.post.entity.SavedPost();
        saved.setUserId(currentUserId);
        saved.setPostId(postId);
        savedPostRepository.save(saved);
        return "Post saved successfully";
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    Post requirePost(Long postId) {
        return postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post not found"));
    }

    AuthorSummary resolveAuthor(Long userId) {
        // Fallback behavior (NotFoundException on failure, or empty lists
        // for scope-narrowing calls) is handled centrally by
        // UserServiceClientFallbackFactory — no try/catch needed here.
        return userServiceClient.getAuthorSummary(userId);
    }

    private List<Long> safeFollowingIds(Long userId) {
        return userServiceClient.getFollowingIds(userId);
    }

    private List<Long> safeBlockedIds(Long userId) {
        return userServiceClient.getBlockedIds(userId);
    }

    private FeedPageResponse toFeedPage(Page<Post> page, Long currentUserId) {
        List<PostResponse> posts = page.getContent().stream().map(p -> toPostResponse(p, currentUserId)).toList();
        return new FeedPageResponse(page.getNumber() + 1, page.getTotalPages(), page.hasNext(), posts);
    }

    PostResponse toPostResponse(Post post, Long currentUserId) {
        long likes = postLikeRepository.countByPostId(post.getId());
        long comments = commentRepository.countByPostId(post.getId());
        boolean liked = currentUserId != null && postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);
        Boolean saved = currentUserId != null ? savedPostRepository.existsByUserIdAndPostId(currentUserId, post.getId()) : null;

        return new PostResponse(
                post.getId(),
                new AuthorResponse(post.getAuthorId(), post.getAuthorName(), post.getAuthorProfilePicture()),
                post.getPostType(),
                post.getThoughts(),
                post.getCaption(),
                post.getMediaUrl(),
                post.getLocation(),
                post.getTags(),
                likes,
                liked,
                comments,
                saved,
                post.getRecentLikers(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private List<String> parseTags(String tagsJson) {
        if (tagsJson == null || tagsJson.isBlank()) return List.of();
        try {
            String[] tags = gson.fromJson(tagsJson, String[].class);
            return tags == null ? List.of() : List.of(tags);
        } catch (JsonSyntaxException e) {
            throw new BadRequestException("Invalid tags format");
        }
    }

    private Long currentUserIdOrNull() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Long id)) {
            return null;
        }
        return id;
    }

    private boolean eq(Object a, Object b) {
        return java.util.Objects.equals(a, b);
    }
}
