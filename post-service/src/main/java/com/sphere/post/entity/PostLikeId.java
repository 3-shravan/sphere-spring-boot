package com.sphere.post.entity;

import java.io.Serializable;
import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostLikeId implements Serializable {
    private Long postId;
    private Long userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PostLikeId that)) return false;
        return Objects.equals(postId, that.postId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() { return Objects.hash(postId, userId); }
}
