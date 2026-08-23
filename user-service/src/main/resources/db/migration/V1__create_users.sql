CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    full_name VARCHAR(50),
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    dob DATE,
    profile_picture_url VARCHAR(500),
    profile_picture_public_id VARCHAR(255),
    bio VARCHAR(220) NOT NULL DEFAULT '',
    gender VARCHAR(10),
    account_verified BOOLEAN NOT NULL DEFAULT FALSE,
    attempts INT NOT NULL DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    verification_code VARCHAR(10),
    verification_code_expires_at TIMESTAMPTZ,
    reset_password_token_hash VARCHAR(255),
    reset_password_token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verified-only uniqueness, mirroring the source's verified-scoped checks
-- (checkExistingUsers / login / getProfiles all scope by accountVerified=true).
CREATE UNIQUE INDEX uq_users_username_verified ON users (username)
WHERE
    account_verified = TRUE;

CREATE UNIQUE INDEX uq_users_email_verified ON users (email)
WHERE
    account_verified = TRUE
    AND email IS NOT NULL;

CREATE INDEX idx_users_created_at ON users (created_at DESC);

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_dob ON users (dob);