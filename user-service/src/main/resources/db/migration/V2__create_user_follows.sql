-- Replaces the Mongo User.followers[]/following[] arrays (see
-- docs/02-target-architecture.md). One row = one directed follow edge.
-- The composite primary key makes follow/unfollow atomic and idempotent
-- without the source's non-atomic two-document $push/$pull pattern.
CREATE TABLE user_follows (
    follower_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_id, followee_id),
    CONSTRAINT chk_no_self_follow CHECK (follower_id <> followee_id)
);

CREATE INDEX idx_user_follows_followee ON user_follows (followee_id);
