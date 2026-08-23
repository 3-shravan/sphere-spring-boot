ALTER TABLE posts ADD COLUMN recent_likers JSONB DEFAULT '[]'::jsonb;
