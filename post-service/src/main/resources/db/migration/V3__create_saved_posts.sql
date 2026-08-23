-- Replaces the source's User.saved[] array (now living in post-service,
-- since "saved" is a post-domain relationship once posts/users are split).
CREATE TABLE saved_posts (
    user_id    BIGINT NOT NULL,
    post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);

CREATE INDEX idx_saved_posts_post_id ON saved_posts (post_id);
