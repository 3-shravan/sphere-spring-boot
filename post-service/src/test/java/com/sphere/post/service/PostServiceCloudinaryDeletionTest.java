package com.sphere.post.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sphere.post.client.AiServiceClient;
import com.sphere.post.client.UserServiceClient;
import com.sphere.post.entity.Post;
import com.sphere.post.entity.PostType;
import com.sphere.post.exception.NotFoundException;
import com.sphere.post.repository.CommentRepository;
import com.sphere.post.repository.PostLikeRepository;
import com.sphere.post.repository.PostRepository;
import com.sphere.post.repository.SavedPostRepository;

@ExtendWith(MockitoExtension.class)
class PostServiceCloudinaryDeletionTest {

  @Mock
  private PostRepository postRepository;
  @Mock
  private PostLikeRepository postLikeRepository;
  @Mock
  private SavedPostRepository savedPostRepository;
  @Mock
  private CommentRepository commentRepository;
  @Mock
  private UserServiceClient userServiceClient;
  @Mock
  private AiServiceClient aiServiceClient;
  @Mock
  private CloudinaryService cloudinaryService;
  @Mock
  private NotificationPublisher notificationPublisher;

  @InjectMocks
  private PostService postService;

  @Test
  void deletePost_withMediaPublicId_deletesFromCloudinaryAndDatabase() {
    Long currentUserId = 7L;
    Long postId = 99L;
    Post post = Post.builder()
        .id(postId)
        .authorId(currentUserId)
        .postType(PostType.media)
        .mediaPublicId("posts/abc123")
        .build();

    when(postRepository.findById(postId)).thenReturn(Optional.of(post));

    postService.deletePost(currentUserId, postId);

    verify(cloudinaryService).delete("posts/abc123");
    verify(postRepository).delete(post);
  }

  @Test
  void deletePost_withoutMediaPublicId_skipsCloudinaryDelete() {
    Long currentUserId = 7L;
    Long postId = 100L;
    Post post = Post.builder()
        .id(postId)
        .authorId(currentUserId)
        .postType(PostType.media)
        .mediaPublicId(null)
        .build();

    when(postRepository.findById(postId)).thenReturn(Optional.of(post));

    postService.deletePost(currentUserId, postId);

    verify(cloudinaryService, never()).delete(org.mockito.ArgumentMatchers.anyString());
    verify(postRepository).delete(post);
  }

  @Test
  void deletePost_byNonAuthor_throwsNotFound_andDoesNotDeleteCloudinary() {
    Long postId = 101L;
    Post post = Post.builder()
        .id(postId)
        .authorId(55L)
        .postType(PostType.media)
        .mediaPublicId("posts/will-not-delete")
        .build();

    when(postRepository.findById(postId)).thenReturn(Optional.of(post));

    assertThatThrownBy(() -> postService.deletePost(7L, postId))
        .isInstanceOf(NotFoundException.class)
        .hasMessageContaining("Post not found");

    verify(cloudinaryService, never()).delete(org.mockito.ArgumentMatchers.anyString());
    verify(postRepository, never()).delete(post);
  }
}
