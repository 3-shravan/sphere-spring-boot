package com.sphere.post.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.sphere.post.client.AiServiceClient;
import com.sphere.post.client.AuthorSummary;
import com.sphere.post.client.UserServiceClient;
import com.sphere.post.dto.request.CreatePostRequest;
import com.sphere.post.dto.request.CreateThoughtRequest;
import com.sphere.post.dto.request.UpdatePostRequest;
import com.sphere.post.dto.response.AuthorResponse;
import com.sphere.post.dto.response.FeedPageResponse;
import com.sphere.post.dto.response.PostCountProjection;
import com.sphere.post.dto.response.PostResponse;
import com.sphere.post.entity.Post;
import com.sphere.post.entity.PostLike;
import com.sphere.post.entity.PostType;
import com.sphere.post.entity.SavedPost;
import com.sphere.post.exception.BadRequestException;
import com.sphere.post.exception.NotFoundException;
import com.sphere.post.repository.CommentRepository;
import com.sphere.post.repository.PostLikeRepository;
import com.sphere.post.repository.PostRepository;
import com.sphere.post.repository.SavedPostRepository;

import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/controllers/feed/post.controller.js.
 * Implements high-performance relationship architecture:
 * - Zero embedded collections in entities or primary DTOs
 * - Batch aggregation & EXISTS queries (eliminating N+1 queries in feeds)
 * - Dedicated paginated APIs for relationships (likes, saved posts)
 */
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final SavedPostRepository savedPostRepository;
    private final CommentRepository commentRepository;
    private final UserServiceClient userServiceClient;
    private final AiServiceClient aiServiceClient;
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
        Page<Post> result = postRepository.findByAuthorIdOrderByCreatedAtDesc(currentUserId,
                PageRequest.of(page - 1, limit));
        return toFeedPage(result, currentUserId);
    }

    @Transactional(readOnly = true)
    public FeedPageResponse getUserPosts(Long currentUserId, Long targetUserId, int page, int limit) {
        Page<Post> result = postRepository.findByAuthorIdOrderByCreatedAtDesc(targetUserId,
                PageRequest.of(page - 1, limit));
        return toFeedPage(result, currentUserId);
    }

    @Transactional(readOnly = true)
    public FeedPageResponse getSavedPosts(Long currentUserId, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit);
        Page<SavedPost> savedPage = savedPostRepository.findByUserIdOrderByCreatedAtDesc(currentUserId, pageRequest);
        
        List<Long> postIds = savedPage.getContent().stream().map(SavedPost::getPostId).toList();
        if (postIds.isEmpty()) {
            return new FeedPageResponse(page, savedPage.getTotalPages(), savedPage.hasNext(), List.of());
        }

        List<Post> posts = new ArrayList<>(postRepository.findAllById(postIds));
        posts.sort(Comparator.comparingInt(p -> postIds.indexOf(p.getId())));

        List<PostResponse> hydrated = toHydratedPostResponses(posts, currentUserId);
        return new FeedPageResponse(page, savedPage.getTotalPages(), savedPage.hasNext(), hydrated);
    }

    @Transactional(readOnly = true)
    public PostResponse getSinglePost(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post not found"));
        Long currentUserId = currentUserIdOrNull();
        return toSinglePostResponse(post, currentUserId);
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
        warmAiCaptionCache(uploaded.url());
        warmAiTagsCache(uploaded.url());
        return toSinglePostResponse(post, currentUserId);
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
        return toSinglePostResponse(post, currentUserId);
    }

    public record UpdatePostResult(PostResponse post, boolean changed) {
    }

    @Transactional
    public UpdatePostResult updatePost(Long currentUserId, Long postId, UpdatePostRequest request,
            MultipartFile image) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post not found"));
        if (!post.getAuthorId().equals(currentUserId)) {
            throw new NotFoundException("Post not found");
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
            return new UpdatePostResult(toSinglePostResponse(post, currentUserId), false);
        }

        if (hasNewImage) {
            if (post.getMediaPublicId() != null) {
                cloudinaryService.delete(post.getMediaPublicId());
            }
            CloudinaryService.UploadResult uploaded = cloudinaryService.upload(image, "posts");
            post.setMediaUrl(uploaded.url());
            post.setMediaPublicId(uploaded.publicId());
        }

        if (request.caption() != null)
            post.setCaption(request.caption());
        if (request.location() != null)
            post.setLocation(request.location());
        if (request.tags() != null)
            post.setTags(newTags);

        postRepository.save(post);
        return new UpdatePostResult(toSinglePostResponse(post, currentUserId), true);
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
        postRepository.delete(post);
    }

    // ---------------------------------------------------------------
    // Like / Save (Dedicated Relational Tables)
    // ---------------------------------------------------------------

    @Transactional
    public String toggleLike(Long currentUserId, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post not found"));

        boolean alreadyLiked = postLikeRepository.existsByPostIdAndUserId(postId, currentUserId);
        if (alreadyLiked) {
            postLikeRepository.deleteByPostIdAndUserId(postId, currentUserId);
            return "Post unliked";
        }

        PostLike like = new PostLike();
        like.setPostId(postId);
        like.setUserId(currentUserId);
        postLikeRepository.save(like);

        if (!post.getAuthorId().equals(currentUserId)) {
            AuthorSummary liker = resolveAuthor(currentUserId);
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
        SavedPost saved = new SavedPost();
        saved.setUserId(currentUserId);
        saved.setPostId(postId);
        savedPostRepository.save(saved);
        return "Post saved successfully";
    }

    // ---------------------------------------------------------------
    // Dedicated Paginated Likes Listing API
    // ---------------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<AuthorSummary> getPostLikes(Long postId, int page, int limit) {
        if (!postRepository.existsById(postId)) {
            throw new NotFoundException("Post not found");
        }
        PageRequest pageRequest = PageRequest.of(page - 1, limit);
        Page<PostLike> likesPage = postLikeRepository.findByPostIdOrderByCreatedAtDesc(postId, pageRequest);
        
        List<AuthorSummary> authors = likesPage.getContent().stream()
                .map(l -> resolveAuthor(l.getUserId()))
                .filter(java.util.Objects::nonNull)
                .toList();

        return new PageImpl<>(authors, pageRequest, likesPage.getTotalElements());
    }

    // ---------------------------------------------------------------
    // Helpers & Batch Hydration (Eliminates N+1 Queries)
    // ---------------------------------------------------------------

    AuthorSummary resolveAuthor(Long userId) {
        return userServiceClient.getAuthorSummary(userId);
    }

    private List<Long> safeFollowingIds(Long userId) {
        return userServiceClient.getFollowingIds(userId);
    }

    private List<Long> safeBlockedIds(Long userId) {
        return userServiceClient.getBlockedIds(userId);
    }

    private FeedPageResponse toFeedPage(Page<Post> page, Long currentUserId) {
        List<PostResponse> hydratedPosts = toHydratedPostResponses(page.getContent(), currentUserId);
        return new FeedPageResponse(page.getNumber() + 1, page.getTotalPages(), page.hasNext(), hydratedPosts);
    }

    private List<PostResponse> toHydratedPostResponses(List<Post> posts, Long currentUserId) {
        if (posts == null || posts.isEmpty()) {
            return List.of();
        }

        List<Long> postIds = posts.stream().map(Post::getId).toList();

        Map<Long, Long> likesMap = postLikeRepository.countLikesByPostIds(postIds).stream()
                .collect(Collectors.toMap(PostCountProjection::getPostId, PostCountProjection::getCount));

        Map<Long, Long> commentsMap = commentRepository.countCommentsByPostIds(postIds).stream()
                .collect(Collectors.toMap(PostCountProjection::getPostId, PostCountProjection::getCount));

        Set<Long> likedPostIds = currentUserId != null
                ? postLikeRepository.findLikedPostIdsByUserId(currentUserId, postIds)
                : Set.of();

        Set<Long> savedPostIds = currentUserId != null
                ? savedPostRepository.findSavedPostIdsByUserId(currentUserId, postIds)
                : Set.of();

        return posts.stream().map(p -> new PostResponse(
                p.getId(),
                new AuthorResponse(p.getAuthorId(), p.getAuthorName(), p.getAuthorProfilePicture()),
                p.getPostType(),
                p.getThoughts(),
                p.getCaption(),
                p.getMediaUrl(),
                p.getLocation(),
                p.getTags(),
                likesMap.getOrDefault(p.getId(), 0L),
                likedPostIds.contains(p.getId()),
                commentsMap.getOrDefault(p.getId(), 0L),
                currentUserId != null ? savedPostIds.contains(p.getId()) : null,
                p.getCreatedAt(),
                p.getUpdatedAt()
        )).toList();
    }

    private PostResponse toSinglePostResponse(Post post, Long currentUserId) {
        long likes = postLikeRepository.countByPostId(post.getId());
        long comments = commentRepository.countByPostId(post.getId());
        boolean liked = currentUserId != null
                && postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);
        Boolean saved = currentUserId != null
                ? savedPostRepository.existsByUserIdAndPostId(currentUserId, post.getId())
                : null;

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
                post.getCreatedAt(),
                post.getUpdatedAt());
    }

    private List<String> parseTags(String tagsJson) {
        if (tagsJson == null || tagsJson.isBlank())
            return List.of();
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

    private void warmAiCaptionCache(String imageUrl) {
        try {
            aiServiceClient.getCaptionForImage(imageUrl);
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(PostService.class)
                    .warn("AI caption cache warm-up skipped for imageUrl={} reason={}", imageUrl, e.getMessage());
        }
    }

    private void warmAiTagsCache(String imageUrl) {
        try {
            aiServiceClient.getTagsForImage(imageUrl);
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(PostService.class)
                    .warn("AI tags cache warm-up skipped for imageUrl={} reason={}", imageUrl, e.getMessage());
        }
    }
}
