package com.sphere.post.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sphere.post.dto.request.CreatePostRequest;
import com.sphere.post.dto.request.CreateThoughtRequest;
import com.sphere.post.dto.request.UpdatePostRequest;
import com.sphere.post.dto.response.PostResponse;
import com.sphere.post.service.PostService;
import com.sphere.post.util.ResponseUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/routes/post.routes.js (posts/feed portion — comments are
 * in CommentController).
 */
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Posts", description = "Feed, post CRUD, likes, saves")
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getGlobalFeed(
            @AuthenticationPrincipal Long currentUserId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        var feed = postService.getGlobalFeed(currentUserId, page, limit);
        return ResponseEntity.ok(ResponseUtil.success("Posts fetched successfully", Map.of(
                "currentPage", feed.currentPage(), "totalPages", feed.totalPages(),
                "hasMore", feed.hasMore(), "posts", feed.posts())));
    }

    @GetMapping("/following")
    public ResponseEntity<Map<String, Object>> getFollowingFeed(
            @AuthenticationPrincipal Long currentUserId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        var feed = postService.getFollowingFeed(currentUserId, page, limit);
        return ResponseEntity.ok(ResponseUtil.success("Posts fetched successfully", Map.of(
                "currentPage", feed.currentPage(), "totalPages", feed.totalPages(),
                "hasMore", feed.hasMore(), "posts", feed.posts())));
    }

    @GetMapping("/saved")
    public ResponseEntity<Map<String, Object>> getSavedPosts(
            @AuthenticationPrincipal Long currentUserId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        var feed = postService.getSavedPosts(currentUserId, page, limit);
        return ResponseEntity.ok(ResponseUtil.success("Saved posts fetched successfully", Map.of(
                "currentPage", feed.currentPage(),
                "totalPages", feed.totalPages(),
                "hasMore", feed.hasMore(),
                "posts", feed.posts(),
                "savedPosts", feed.posts())));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyPosts(
            @AuthenticationPrincipal Long currentUserId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        var feed = postService.getMyPosts(currentUserId, page, limit);
        return ResponseEntity.ok(ResponseUtil.success("Your posts fetched successfully", Map.of("data", Map.of(
                "currentPage", feed.currentPage(), "totalPages", feed.totalPages(),
                "hasMore", feed.hasMore(), "posts", feed.posts()))));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserPosts(
            @AuthenticationPrincipal Long currentUserId,
            @PathVariable("userId") Long userId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {
        var feed = postService.getUserPosts(currentUserId, userId, page, limit);
        return ResponseEntity.ok(ResponseUtil.success("User posts fetched successfully", Map.of(
                "currentPage", feed.currentPage(), "totalPages", feed.totalPages(),
                "hasMore", feed.hasMore(), "posts", feed.posts())));
    }

    @GetMapping("/search/semantic")
    @Operation(description = "Meaning-based post search powered by AI query expansion + ranking.")
    public ResponseEntity<Map<String, Object>> semanticSearchPosts(
            @AuthenticationPrincipal Long currentUserId,
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        var result = postService.semanticSearchPosts(currentUserId, query, page, limit);
        return ResponseEntity.ok(ResponseUtil.success("Semantic posts fetched successfully", Map.of(
                "currentPage", result.currentPage(),
                "totalPages", result.totalPages(),
                "hasMore", result.hasMore(),
                "posts", result.posts(),
                "semanticTerms", result.semanticTerms())));
    }

    @GetMapping("/{postId}")
    @Operation(security = {}, description = "Public — no auth required. If a token IS supplied, the response includes isSaved for that viewer.")
    public ResponseEntity<Map<String, Object>> getSinglePost(@PathVariable Long postId) {
        PostResponse post = postService.getSinglePost(postId);
        return ResponseEntity.ok(ResponseUtil.success("Post fetched successfully", Map.of("post", post)));
    }

    @GetMapping("/{postId}/likes")
    @Operation(description = "Dedicated paginated endpoint to retrieve users who liked this post.")
    public ResponseEntity<Map<String, Object>> getPostLikes(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        var likesPage = postService.getPostLikes(postId, page, limit);
        return ResponseEntity.ok(ResponseUtil.success("Post likers fetched successfully", Map.of(
                "currentPage", likesPage.getNumber() + 1,
                "totalPages", likesPage.getTotalPages(),
                "totalElements", likesPage.getTotalElements(),
                "hasMore", likesPage.hasNext(),
                "likers", likesPage.getContent())));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> createPost(
            @AuthenticationPrincipal Long currentUserId,
            @Valid @ModelAttribute CreatePostRequest request,
            @RequestPart MultipartFile image) {
        PostResponse post = postService.createMediaPost(currentUserId, request, image);
        return ResponseEntity.status(201).body(ResponseUtil.success("Post created successfully", Map.of("post", post)));
    }

    @PostMapping("/thought")
    public ResponseEntity<Map<String, Object>> createThought(
            @AuthenticationPrincipal Long currentUserId, @Valid @RequestBody CreateThoughtRequest request) {
        PostResponse post = postService.createThoughtPost(currentUserId, request);
        return ResponseEntity.status(201).body(ResponseUtil.success("Your thought is shared", Map.of("post", post)));
    }

    @PutMapping(value = "/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> updatePost(
            @AuthenticationPrincipal Long currentUserId,
            @PathVariable Long postId,
            @Valid @ModelAttribute UpdatePostRequest request,
            @RequestPart(required = false) MultipartFile image) {
        var result = postService.updatePost(currentUserId, postId, request, image);
        String message = result.changed() ? "Post updated successfully" : "You made no changes.";
        return ResponseEntity.ok(ResponseUtil.success(message, Map.of("post", result.post())));
    }

    @PutMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @AuthenticationPrincipal Long currentUserId, @PathVariable Long postId) {
        String message = postService.toggleLike(currentUserId, postId);
        return ResponseEntity.ok(ResponseUtil.success(message));
    }

    @PutMapping("/{postId}/save")
    public ResponseEntity<Map<String, Object>> toggleSave(
            @AuthenticationPrincipal Long currentUserId, @PathVariable Long postId) {
        String message = postService.toggleSave(currentUserId, postId);
        return ResponseEntity.ok(ResponseUtil.success(message));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> deletePost(
            @AuthenticationPrincipal Long currentUserId, @PathVariable Long postId) {
        postService.deletePost(currentUserId, postId);
        return ResponseEntity.ok(ResponseUtil.success("Post deleted successfully"));
    }
}
