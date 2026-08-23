CREATE TABLE posts (
    id                      BIGSERIAL PRIMARY KEY,
    author_id               BIGINT NOT NULL,
    author_name             VARCHAR(20) NOT NULL,
    author_profile_picture  VARCHAR(500),
    post_type               VARCHAR(10) NOT NULL DEFAULT 'media',
    thoughts                VARCHAR(5000),
    caption                 VARCHAR(500),
    media_url               VARCHAR(500),
    media_public_id         VARCHAR(255),
    location                VARCHAR(100),
    tags                    TEXT[] NOT NULL DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_post_type CHECK (post_type IN ('thought', 'media'))
);

-- No FK to a users table: author_id references user-service's database,
-- which post-service does not own or share (see docs/02-target-architecture.md).
CREATE INDEX idx_posts_author_id ON posts (author_id);
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);
