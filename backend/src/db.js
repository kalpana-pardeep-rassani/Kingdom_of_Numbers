const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const config = require('./config');
const { createId, hashPassword } = require('./security');

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });

const db = new DatabaseSync(config.dbPath);
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    grade TEXT,
    avatar TEXT DEFAULT 'hero',
    preferred_world TEXT DEFAULT 'integers',
    title TEXT DEFAULT 'Rookie Hero',
    role TEXT NOT NULL DEFAULT 'student',
    status TEXT NOT NULL DEFAULT 'active',
    joined_at TEXT NOT NULL,
    last_login_at TEXT,
    last_active_at TEXT,
    total_points INTEGER NOT NULL DEFAULT 0,
    deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY,
    bio TEXT DEFAULT '',
    school_name TEXT DEFAULT '',
    city TEXT DEFAULT '',
    updated_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS world_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    world_key TEXT NOT NULL,
    completed_levels INTEGER NOT NULL DEFAULT 0,
    total_levels INTEGER NOT NULL DEFAULT 10,
    total_score INTEGER NOT NULL DEFAULT 0,
    stars_earned INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT,
    last_played_at TEXT,
    UNIQUE(user_id, world_key),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS level_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    world_key TEXT NOT NULL,
    level_id INTEGER NOT NULL,
    question_id INTEGER,
    status TEXT NOT NULL DEFAULT 'completed',
    score_earned INTEGER NOT NULL DEFAULT 0,
    stars_earned INTEGER NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    completed_at TEXT NOT NULL,
    UNIQUE(user_id, world_key, level_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    total_questions_answered INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    total_points INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    speed_count INTEGER NOT NULL DEFAULT 0,
    day_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date TEXT,
    last_world_played TEXT,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topic_performance (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    topic_key TEXT NOT NULL,
    total_attempts INTEGER NOT NULL DEFAULT 0,
    correct_attempts INTEGER NOT NULL DEFAULT 0,
    accuracy_rate REAL NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    UNIQUE(user_id, topic_key),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    achievement_key TEXT NOT NULL,
    unlocked_at TEXT NOT NULL,
    UNIQUE(user_id, achievement_key),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS diagnostic_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    total_correct INTEGER NOT NULL,
    percentage REAL NOT NULL,
    topic_scores_json TEXT NOT NULL,
    weak_topics_json TEXT NOT NULL,
    strong_topics_json TEXT NOT NULL,
    recommendations_json TEXT NOT NULL,
    submitted_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_log (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    actor_user_id TEXT,
    activity_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    metadata_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    admin_user_id TEXT NOT NULL,
    target_user_id TEXT,
    action_key TEXT NOT NULL,
    details_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(admin_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(target_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at);
CREATE INDEX IF NOT EXISTS idx_world_progress_user ON world_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_level_progress_user ON level_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_user_created ON activity_log(user_id, created_at DESC);
`);

function run(sql, params = {}) {
    return db.prepare(sql).run(params);
}

function get(sql, params = {}) {
    return db.prepare(sql).get(params) || null;
}

function all(sql, params = {}) {
    return db.prepare(sql).all(params);
}

function initializeUserRecords(userId, grade = null, preferredWorld = 'integers') {
    const now = new Date().toISOString();
    run(`
        INSERT OR IGNORE INTO user_profiles (user_id, updated_at)
        VALUES (:userId, :updatedAt)
    `, { userId, updatedAt: now });

    run(`
        INSERT OR IGNORE INTO user_stats (user_id, updated_at, day_streak, last_activity_date)
        VALUES (:userId, :updatedAt, 1, :updatedAt)
    `, { userId, updatedAt: now });

    ['integers', 'fractions', 'algebra', 'geometry'].forEach((worldKey) => {
        run(`
            INSERT OR IGNORE INTO world_progress (
                id, user_id, world_key, completed_levels, total_levels, total_score, stars_earned, last_played_at
            ) VALUES (
                :id, :userId, :worldKey, 0, 10, 0, 0, NULL
            )
        `, {
            id: createId('wprog'),
            userId,
            worldKey
        });
    });

    run(`
        UPDATE users
        SET grade = COALESCE(grade, :grade), preferred_world = COALESCE(preferred_world, :preferredWorld)
        WHERE id = :userId
    `, { userId, grade, preferredWorld });
}

function seedAdminUser() {
    const existingAdmin = get(`
        SELECT id
        FROM users
        WHERE (role = 'admin' OR email = :email)
        LIMIT 1
    `, { email: config.adminEmail });
    const now = new Date().toISOString();

    if (existingAdmin) {
        run(`
            UPDATE users
            SET name = :name,
                email = :email,
                password_hash = :passwordHash,
                grade = 'Admin',
                avatar = 'hero',
                preferred_world = 'integers',
                title = 'Administrator',
                role = 'admin',
                status = 'active',
                last_active_at = :lastActiveAt,
                deleted_at = NULL
            WHERE id = :id
        `, {
            id: existingAdmin.id,
            name: config.adminName,
            email: config.adminEmail,
            passwordHash: hashPassword(config.adminPassword),
            lastActiveAt: now
        });
        initializeUserRecords(existingAdmin.id, 'Admin', 'integers');
        console.log(`Admin user updated: ${config.adminEmail}`);
        return;
    }

    const adminId = createId('usr');
    run(`
        INSERT INTO users (
            id, name, email, password_hash, grade, avatar, preferred_world, title, role, status, joined_at, last_active_at, total_points
        ) VALUES (
            :id, :name, :email, :passwordHash, 'Admin', 'hero', 'integers', 'Administrator', 'admin', 'active', :joinedAt, :lastActiveAt, 0
        )
    `, {
        id: adminId,
        name: config.adminName,
        email: config.adminEmail,
        passwordHash: hashPassword(config.adminPassword),
        joinedAt: now,
        lastActiveAt: now
    });
    initializeUserRecords(adminId, 'Admin', 'integers');
    console.log(`Admin user seeded: ${config.adminEmail}`);
}

seedAdminUser();

module.exports = {
    db,
    run,
    get,
    all,
    initializeUserRecords
};
