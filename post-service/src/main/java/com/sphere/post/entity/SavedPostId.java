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
public class SavedPostId implements Serializable {
    private Long userId;
    private Long postId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SavedPostId that)) return false;
        return Objects.equals(userId, that.userId) && Objects.equals(postId, that.postId);
    }

    @Override
    public int hashCode() { return Objects.hash(userId, postId); }
}
