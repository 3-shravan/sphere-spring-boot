-- Replaces Post.likes[] with a normalized join table.
CREATE TABLE post_likes (
    post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, user_id)
);

CREATE INDEX idx_post_likes_user_id ON post_likes (user_id);
