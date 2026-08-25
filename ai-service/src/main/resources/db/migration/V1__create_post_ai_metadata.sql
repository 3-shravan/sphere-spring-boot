-- ============================================================================
-- V1: Create post_ai_metadata table
-- Caches AI-generated captions keyed by image URL.
-- Future AI fields (description, hashtags, tags, moderation) are added via
-- new V2, V3, … migrations without touching this file.
-- ============================================================================

CREATE TABLE post_ai_metadata (
    id            BIGSERIAL    PRIMARY KEY,
    image_url     TEXT         NOT NULL,
    caption       VARCHAR(500),
    ai_provider   VARCHAR(50)  NOT NULL DEFAULT 'openai',
    model_version VARCHAR(100),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_post_ai_metadata_image_url UNIQUE (image_url)
);

CREATE INDEX idx_post_ai_metadata_image_url ON post_ai_metadata (image_url);

COMMENT ON TABLE  post_ai_metadata              IS 'AI-generated caption cache, keyed by image URL.';
COMMENT ON COLUMN post_ai_metadata.image_url    IS 'Publicly accessible image URL used as cache key.';
COMMENT ON COLUMN post_ai_metadata.caption      IS 'AI-generated short caption (≤150 chars).';
COMMENT ON COLUMN post_ai_metadata.ai_provider  IS 'Provider name, e.g. openai.';
COMMENT ON COLUMN post_ai_metadata.model_version IS 'Model used, e.g. gpt-4o.';

