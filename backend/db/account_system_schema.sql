CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    grade VARCHAR(10),
    avatar VARCHAR(50) DEFAULT 'hero',
    preferred_world VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    CHECK (role IN ('student', 'admin')),
    CHECK (status IN ('active', 'suspended', 'deleted'))
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT
);

CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(120),
    bio TEXT,
    school_name VARCHAR(160),
    city VARCHAR(120),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE diagnostic_attempts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_questions INT NOT NULL,
    total_correct INT NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE diagnostic_topic_scores (
    id UUID PRIMARY KEY,
    diagnostic_attempt_id UUID NOT NULL REFERENCES diagnostic_attempts(id) ON DELETE CASCADE,
    topic_key VARCHAR(50) NOT NULL,
    correct_count INT NOT NULL,
    question_count INT NOT NULL,
    percentage NUMERIC(5,2) NOT NULL
);

CREATE TABLE world_progress (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    world_key VARCHAR(50) NOT NULL,
    completed_levels INT NOT NULL DEFAULT 0,
    total_levels INT NOT NULL DEFAULT 0,
    total_score INT NOT NULL DEFAULT 0,
    stars_earned INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    last_played_at TIMESTAMPTZ,
    UNIQUE (user_id, world_key)
);

CREATE TABLE level_progress (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    world_key VARCHAR(50) NOT NULL,
    level_id INT NOT NULL,
    question_id INT,
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    score_earned INT NOT NULL DEFAULT 0,
    stars_earned INT NOT NULL DEFAULT 0,
    time_spent_seconds INT,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, world_key, level_id)
);

CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_questions_answered INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    incorrect_answers INT NOT NULL DEFAULT 0,
    total_score INT NOT NULL DEFAULT 0,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    speed_count INT NOT NULL DEFAULT 0,
    day_streak INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE topic_performance (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_key VARCHAR(50) NOT NULL,
    total_attempts INT NOT NULL DEFAULT 0,
    correct_attempts INT NOT NULL DEFAULT 0,
    accuracy_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, topic_key)
);

CREATE TABLE activity_log (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type VARCHAR(80) NOT NULL,
    entity_type VARCHAR(80),
    entity_id VARCHAR(120),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_key VARCHAR(80) NOT NULL,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, achievement_key)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_key VARCHAR(80) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_users_last_active_at ON users(last_active_at DESC);
CREATE INDEX idx_world_progress_user_id ON world_progress(user_id);
CREATE INDEX idx_level_progress_user_world ON level_progress(user_id, world_key);
CREATE INDEX idx_topic_performance_user_id ON topic_performance(user_id);
CREATE INDEX idx_activity_log_user_id_created_at ON activity_log(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_admin_created_at ON audit_logs(admin_user_id, created_at DESC);