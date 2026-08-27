-- ============================================================================
-- V2: Add tags_json to post_ai_metadata
-- Stores AI-generated tags as a JSON array string, keyed by image URL.
-- ============================================================================

ALTER TABLE post_ai_metadata
    ADD COLUMN tags_json TEXT;

COMMENT ON COLUMN post_ai_metadata.tags_json IS 'AI-generated tags serialized as JSON array string.';
