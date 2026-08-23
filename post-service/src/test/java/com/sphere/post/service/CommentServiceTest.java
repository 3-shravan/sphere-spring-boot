package com.sphere.post.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sphere.post.client.UserServiceClient;
import com.sphere.post.entity.Comment;
import com.sphere.post.exception.ForbiddenException;
import com.sphere.post.exception.NotFoundException;
import com.sphere.post.repository.CommentRepository;
import com.sphere.post.repository.PostRepository;

/**
 * Covers the two deliberate status-code fixes from Decision #7
 * (docs/decisions/DECISIONS_REQUIRED.md): non-author comment delete is now
 * 403 Forbidden, not the source's 400 BadRequest.
 */
@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock private CommentRepository commentRepository;
    @Mock private PostRepository postRepository;
    @Mock private UserServiceClient userServiceClient;
    @Mock private NotificationPublisher notificationPublisher;

    @InjectMocks
    private CommentService commentService;

    @Test
    void deleteComment_byNonAuthor_throwsForbidden_notBadRequest() {
        when(postRepository.existsById(1L)).thenReturn(true);
        Comment comment = Comment.builder().id(10L).postId(1L).authorId(999L).authorName("someone").comment("hi").build();
        when(commentRepository.findById(10L)).thenReturn(Optional.of(comment));

        assertThatThrownBy(() -> commentService.deleteComment(currentUserId(), 1L, 10L))
                .isInstanceOf(ForbiddenException.class)
                .hasMessageContaining("not authorized");
    }

    @Test
    void deleteComment_postNotFound_throwsNotFound() {
        when(postRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> commentService.deleteComment(1L, 999L, 10L))
                .isInstanceOf(NotFoundException.class);
    }

    private Long currentUserId() {
        return 1L;
    }
}
