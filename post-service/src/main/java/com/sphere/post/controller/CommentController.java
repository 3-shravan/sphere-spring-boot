package com.sphere.post.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.sphere.post.dto.request.CreateCommentRequest;
import com.sphere.post.dto.response.CommentResponse;
import com.sphere.post.service.CommentService;
import com.sphere.post.util.ResponseUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/posts/{postId}/comments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Comments", description = "Threaded comments on posts")
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    @Operation(security = {}, description = "Public — no authUser middleware in the source either.")
    public ResponseEntity<Map<String, Object>> getComments(@PathVariable Long postId) {
        List<CommentResponse> comments = commentService.getCommentTree(postId);
        return ResponseEntity.ok(ResponseUtil.success("Comments fetched successfully", Map.of("comments", comments)));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addComment(
            @AuthenticationPrincipal Long currentUserId,
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse comment = commentService.addComment(currentUserId, postId, request);
        return ResponseEntity.ok(ResponseUtil.success("Comment added successfully", Map.of("comment", comment)));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(
            @AuthenticationPrincipal Long currentUserId,
            @PathVariable Long postId,
            @PathVariable Long commentId) {
        commentService.deleteComment(currentUserId, postId, commentId);
        return ResponseEntity.ok(ResponseUtil.success("Comment deleted successfully."));
    }
}
