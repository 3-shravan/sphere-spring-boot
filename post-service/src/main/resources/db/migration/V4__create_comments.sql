-- Replaces server/src/models/feed/comment.model.js. parent_comment_id is a
-- real self-referencing FK with ON DELETE CASCADE, which naturally fixes
-- the source's orphan-replies bug (Decision #6) — deleting any comment,
-- top-level or reply, correctly removes its whole subtree via the DB.
CREATE TABLE comments (
    id                      BIGSERIAL PRIMARY KEY,
    post_id                 BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id               BIGINT NOT NULL,
    author_name             VARCHAR(20) NOT NULL,
    author_profile_picture  VARCHAR(500),
    comment                 VARCHAR(500) NOT NULL,
    parent_comment_id       BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post_id ON comments (post_id);
CREATE INDEX idx_comments_parent_comment_id ON comments (parent_comment_id);
CREATE INDEX idx_comments_author_id ON comments (author_id);
