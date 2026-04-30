const express = require('express');
const cors = require('cors');
const config = require('./config');
const { run, get, all, initializeUserRecords } = require('./db');
const { createId, hashPassword, verifyPassword, createAccessToken, hashToken } = require('./security');

const app = express();

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));

const authRateLimit = new Map();

function parseJson(value, fallback) {
    if (!value) {
        return fallback;
    }

    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function rateLimit(key, limit = 10, windowMs = 1000 * 60 * 5) {
    const now = Date.now();
    const bucket = authRateLimit.get(key) || [];
    const fresh = bucket.filter((time) => now - time < windowMs);
    fresh.push(now);
    authRateLimit.set(key, fresh);
    return fresh.length <= limit;
}

function logActivity({ userId = null, actorUserId = null, activityType, entityType = null, entityId = null, metadata = {} }) {
    run(`
        INSERT INTO activity_log (id, user_id, actor_user_id, activity_type, entity_type, entity_id, metadata_json, created_at)
        VALUES (:id, :userId, :actorUserId, :activityType, :entityType, :entityId, :metadataJson, :createdAt)
    `, {
        id: createId('act'),
        userId,
        actorUserId,
        activityType,
        entityType,
        entityId,
        metadataJson: JSON.stringify(metadata),
        createdAt: new Date().toISOString()
    });
}

function logAudit({ adminUserId, targetUserId = null, actionKey, details = {} }) {
    run(`
        INSERT INTO audit_logs (id, admin_user_id, target_user_id, action_key, details_json, created_at)
        VALUES (:id, :adminUserId, :targetUserId, :actionKey, :detailsJson, :createdAt)
    `, {
        id: createId('audit'),
        adminUserId,
        targetUserId,
        actionKey,
        detailsJson: JSON.stringify(details),
        createdAt: new Date().toISOString()
    });
}

function createSession(userId) {
    const token = createAccessToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + config.accessTokenTtlMs).toISOString();
    run(`
        INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at)
        VALUES (:id, :userId, :tokenHash, :createdAt, :expiresAt)
    `, {
        id: createId('sess'),
        userId,
        tokenHash: hashToken(token),
        createdAt: now.toISOString(),
        expiresAt
    });
    return token;
}

function revokeSession(token) {
    if (!token) {
        return;
    }
    run(`
        UPDATE sessions
        SET revoked_at = :revokedAt
        WHERE token_hash = :tokenHash AND revoked_at IS NULL
    `, {
        revokedAt: new Date().toISOString(),
        tokenHash: hashToken(token)
    });
}

function serializeUser(user) {
    if (!user) {
        return null;
    }

    return {
        userId: user.id,
        name: user.name,
        email: user.email,
        class: user.grade,
        avatar: user.avatar || 'hero',
        preferredWorld: user.preferred_world || 'integers',
        title: user.title || 'Rookie Hero',
        totalPoints: user.total_points || 0,
        role: user.role,
        status: user.status,
        joinedDate: user.joined_at,
        lastLoginDate: user.last_login_at,
        lastActivityDate: user.last_active_at
    };
}

function getAchievementsPayload(userId) {
    const rows = all(`SELECT achievement_key, unlocked_at FROM achievements WHERE user_id = :userId ORDER BY unlocked_at DESC`, { userId });
    return {
        userId,
        unlocked: rows.map((row) => ({ id: row.achievement_key, unlockedDate: row.unlocked_at }))
    };
}

function getDiagnosticPayload(userId) {
    const row = get(`
        SELECT *
        FROM diagnostic_attempts
        WHERE user_id = :userId
        ORDER BY submitted_at DESC
        LIMIT 1
    `, { userId });
    if (!row) {
        return null;
    }
    return {
        userId,
        completedDate: row.submitted_at,
        score: row.total_correct,
        totalQuestions: row.total_questions,
        percentage: Math.round(row.percentage),
        topicScores: parseJson(row.topic_scores_json, {}),
        weakTopics: parseJson(row.weak_topics_json, []),
        strongTopics: parseJson(row.strong_topics_json, []),
        recommendations: parseJson(row.recommendations_json, [])
    };
}

function getStatsPayload(userId) {
    const row = get(`SELECT * FROM user_stats WHERE user_id = :userId`, { userId });
    if (!row) {
        return null;
    }

    const topicRows = all(`SELECT topic_key, total_attempts, correct_attempts, accuracy_rate FROM topic_performance WHERE user_id = :userId`, { userId });
    const worldsCompleted = all(`SELECT world_key FROM world_progress WHERE user_id = :userId AND completed_at IS NOT NULL`, { userId }).map((item) => item.world_key);
    const topicsProgress = topicRows.reduce((accumulator, item) => {
        accumulator[item.topic_key] = {
            total: item.total_attempts,
            correct: item.correct_attempts,
            accuracy: Math.round(item.accuracy_rate || 0)
        };
        return accumulator;
    }, {});

    return {
        userId,
        totalQuestionsAnswered: row.total_questions_answered,
        correctAnswers: row.correct_answers,
        incorrectAnswers: row.incorrect_answers,
        streak: row.current_streak,
        longestStreak: row.longest_streak,
        totalPoints: row.total_points,
        lastActivityDate: row.last_activity_date,
        topicsProgress,
        worldsCompleted,
        speedCount: row.speed_count,
        dayStreak: row.day_streak,
        lastWorldPlayed: row.last_world_played
    };
}

function getProgressPayload(userId) {
    const rows = all(`SELECT * FROM world_progress WHERE user_id = :userId ORDER BY world_key`, { userId });
    const worlds = rows.map((row) => {
        const levels = all(`SELECT * FROM level_progress WHERE user_id = :userId AND world_key = :worldKey ORDER BY level_id`, {
            userId,
            worldKey: row.world_key
        }).map((level) => ({
            levelId: level.level_id,
            completed: level.status === 'completed',
            points: level.score_earned,
            stars: level.stars_earned,
            timeSpent: level.time_spent_seconds,
            completedDate: level.completed_at
        }));

        return {
            worldId: row.world_key,
            completedLevels: row.completed_levels,
            totalLevels: row.total_levels,
            points: row.total_score,
            levels,
            completedAt: row.completed_at,
            lastPlayedAt: row.last_played_at
        };
    });

    return {
        userId,
        totalPoints: worlds.reduce((sum, item) => sum + (item.points || 0), 0),
        worlds
    };
}

function getActivityPayload(userId, limit = 25) {
    return all(`
        SELECT * FROM activity_log
        WHERE user_id = :userId OR actor_user_id = :userId
        ORDER BY created_at DESC
        LIMIT :limit
    `, { userId, limit }).map((row) => ({
        id: row.id,
        type: row.activity_type,
        entityType: row.entity_type,
        entityId: row.entity_id,
        metadata: parseJson(row.metadata_json, {}),
        createdAt: row.created_at
    }));
}

function getUserSnapshot(userId) {
    const user = get(`SELECT * FROM users WHERE id = :userId AND deleted_at IS NULL`, { userId });
    if (!user) {
        return null;
    }
    return {
        user: serializeUser(user),
        progress: getProgressPayload(userId),
        stats: getStatsPayload(userId),
        achievements: getAchievementsPayload(userId),
        diagnosticResults: getDiagnosticPayload(userId),
        activityHistory: getActivityPayload(userId)
    };
}

function authenticate(request, response, next) {
    const authorization = request.headers.authorization || '';
    const [, token] = authorization.split(' ');
    if (!token) {
        response.status(401).json({ error: 'Authentication required.' });
        return;
    }

    const session = get(`
        SELECT
            sessions.id AS session_id,
            sessions.user_id AS session_user_id,
            users.id AS user_id,
            users.name,
            users.email,
            users.grade,
            users.avatar,
            users.preferred_world,
            users.title,
            users.role,
            users.status,
            users.total_points,
            users.joined_at,
            users.last_login_at,
            users.last_active_at
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = :tokenHash
          AND sessions.revoked_at IS NULL
          AND sessions.expires_at > :now
          AND users.deleted_at IS NULL
          AND users.status = 'active'
        LIMIT 1
    `, {
        tokenHash: hashToken(token),
        now: new Date().toISOString()
    });

    if (!session) {
        response.status(401).json({ error: 'Session expired or invalid.' });
        return;
    }

    request.token = token;
    request.user = {
        id: session.user_id,
        userId: session.user_id,
        name: session.name,
        email: session.email,
        grade: session.grade,
        avatar: session.avatar,
        preferred_world: session.preferred_world,
        title: session.title,
        role: session.role,
        status: session.status,
        total_points: session.total_points,
        joined_at: session.joined_at,
        last_login_at: session.last_login_at,
        last_active_at: session.last_active_at
    };
    next();
}

function requireAdmin(request, response, next) {
    if (request.user.role !== 'admin') {
        response.status(403).json({ error: 'Admin access required.' });
        return;
    }
    next();
}

function touchUserActivity(userId) {
    run(`UPDATE users SET last_active_at = :lastActiveAt WHERE id = :userId`, {
        userId,
        lastActiveAt: new Date().toISOString()
    });
}

app.get('/api/v1/health', (request, response) => {
    response.json({ ok: true });
});

app.post('/api/v1/auth/signup', (request, response) => {
    const ipKey = `signup:${request.ip}`;
    if (!rateLimit(ipKey, 20)) {
        response.status(429).json({ error: 'Too many signup attempts. Please wait and try again.' });
        return;
    }

    const { name, email, password, grade, preferredWorld = 'integers' } = request.body || {};
    if (!name || !email || !password) {
        response.status(400).json({ error: 'Name, email, and password are required.' });
        return;
    }
    if (String(password).length < 6) {
        response.status(400).json({ error: 'Password must be at least 6 characters.' });
        return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = get(`SELECT id FROM users WHERE email = :email AND deleted_at IS NULL`, { email: normalizedEmail });
    if (existing) {
        response.status(409).json({ error: 'Email already registered.' });
        return;
    }

    const userId = createId('usr');
    const now = new Date().toISOString();
    run(`
        INSERT INTO users (
            id, name, email, password_hash, grade, avatar, preferred_world, title, role, status, joined_at, last_active_at, total_points
        ) VALUES (
            :id, :name, :email, :passwordHash, :grade, 'hero', :preferredWorld, 'Rookie Hero', 'student', 'active', :joinedAt, :lastActiveAt, 0
        )
    `, {
        id: userId,
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        grade: grade || null,
        preferredWorld,
        joinedAt: now,
        lastActiveAt: now
    });
    initializeUserRecords(userId, grade || null, preferredWorld);
    logActivity({ userId, actorUserId: userId, activityType: 'signup', entityType: 'user', entityId: userId });

    const token = createSession(userId);
    const snapshot = getUserSnapshot(userId);
    response.status(201).json({ user: snapshot.user, accessToken: token, snapshot });
});

app.post('/api/v1/auth/login', (request, response) => {
    const ipKey = `login:${request.ip}`;
    if (!rateLimit(ipKey, 30)) {
        response.status(429).json({ error: 'Too many login attempts. Please wait and try again.' });
        return;
    }

    const { email, password } = request.body || {};
    if (!email || !password) {
        response.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = get(`SELECT * FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1`, { email: normalizedEmail });
    if (!user || !verifyPassword(password, user.password_hash)) {
        response.status(401).json({ error: 'Invalid email or password.' });
        return;
    }
    if (user.status !== 'active') {
        response.status(403).json({ error: 'This account is not active.' });
        return;
    }

    const now = new Date().toISOString();
    run(`UPDATE users SET last_login_at = :lastLoginAt, last_active_at = :lastActiveAt WHERE id = :userId`, {
        userId: user.id,
        lastLoginAt: now,
        lastActiveAt: now
    });
    logActivity({ userId: user.id, actorUserId: user.id, activityType: 'login', entityType: 'user', entityId: user.id });

    const token = createSession(user.id);
    const snapshot = getUserSnapshot(user.id);
    response.json({ user: snapshot.user, accessToken: token, snapshot });
});

// --- NEW CODE START ---
app.post('/api/v1/auth/forgot-password', (request, response) => {
    const { email, newPassword } = request.body || {};
    if (!email || !newPassword) {
        response.status(400).json({ error: 'Email and new password are required.' });
        return;
    }

    if (String(newPassword).length < 6) {
        response.status(400).json({ error: 'Password must be at least 6 characters.' });
        return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = get(`SELECT id, status FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1`, { email: normalizedEmail });
    if (!user) {
        response.status(404).json({ error: 'No account found for that email.' });
        return;
    }

    if (user.status !== 'active') {
        response.status(403).json({ error: 'This account is not active.' });
        return;
    }

    run(`
        UPDATE users
        SET password_hash = :passwordHash,
            last_active_at = :updatedAt
        WHERE id = :userId
    `, {
        userId: user.id,
        passwordHash: hashPassword(newPassword),
        updatedAt: new Date().toISOString()
    });

    logActivity({ userId: user.id, actorUserId: user.id, activityType: 'password_reset', entityType: 'user', entityId: user.id });
    response.json({ success: true });
});

app.post('/api/v1/verify-token', (request, response) => {
    const authorization = request.headers.authorization || '';
    const [, authorizationToken] = authorization.split(' ');
    const token = authorizationToken || (request.body && request.body.token);
    if (!token) {
        response.status(400).json({ error: 'Token is required.' });
        return;
    }

    const session = get(`
        SELECT
            users.id,
            users.name,
            users.email,
            users.grade,
            users.avatar,
            users.preferred_world,
            users.title,
            users.role,
            users.status,
            users.total_points,
            users.joined_at,
            users.last_login_at,
            users.last_active_at
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = :tokenHash
          AND sessions.revoked_at IS NULL
          AND sessions.expires_at > :now
          AND users.deleted_at IS NULL
          AND users.status = 'active'
        LIMIT 1
    `, {
        tokenHash: hashToken(token),
        now: new Date().toISOString()
    });

    if (!session) {
        response.status(401).json({ valid: false, error: 'Session expired or invalid.' });
        return;
    }

    response.json({ valid: true, user: serializeUser(session) });
});
// --- NEW CODE END ---

app.post('/api/v1/auth/logout', authenticate, (request, response) => {
    revokeSession(request.token);
    logActivity({ userId: request.user.userId, actorUserId: request.user.userId, activityType: 'logout', entityType: 'session' });
    response.json({ success: true });
});

app.get('/api/v1/auth/me', authenticate, (request, response) => {
    touchUserActivity(request.user.userId);
    response.json({ user: serializeUser(get(`SELECT * FROM users WHERE id = :userId`, { userId: request.user.userId })) });
});

app.get('/api/v1/users/me', authenticate, (request, response) => {
    const snapshot = getUserSnapshot(request.user.userId);
    response.json(snapshot);
});

app.patch('/api/v1/users/me', authenticate, (request, response) => {
    const { name, grade, preferredWorld, avatar } = request.body || {};
    run(`
        UPDATE users
        SET name = COALESCE(:name, name),
            grade = COALESCE(:grade, grade),
            preferred_world = COALESCE(:preferredWorld, preferred_world),
            avatar = COALESCE(:avatar, avatar),
            last_active_at = :updatedAt
        WHERE id = :userId
    `, {
        userId: request.user.userId,
        name: name || null,
        grade: grade || null,
        preferredWorld: preferredWorld || null,
        avatar: avatar || null,
        updatedAt: new Date().toISOString()
    });
    logActivity({
        userId: request.user.userId,
        actorUserId: request.user.userId,
        activityType: 'profile_updated',
        entityType: 'user',
        entityId: request.user.userId,
        metadata: { name, grade, preferredWorld, avatar }
    });
    response.json({ snapshot: getUserSnapshot(request.user.userId) });
});

app.get('/api/v1/progress/me', authenticate, (request, response) => {
    response.json({
        progress: getProgressPayload(request.user.userId),
        stats: getStatsPayload(request.user.userId),
        achievements: getAchievementsPayload(request.user.userId),
        diagnosticResults: getDiagnosticPayload(request.user.userId)
    });
});

app.post('/api/v1/progress/events', authenticate, (request, response) => {
    const { worldId, levelId, questionId, result, scoreEarned = 0, timeSpentSeconds = 0, starsEarned = 0, topic } = request.body || {};
    if (!worldId || levelId == null || !result) {
        response.status(400).json({ error: 'worldId, levelId, and result are required.' });
        return;
    }

    const userId = request.user.userId;
    const now = new Date().toISOString();
    const isCorrect = result === 'correct';

    const existingLevel = get(`
        SELECT * FROM level_progress WHERE user_id = :userId AND world_key = :worldKey AND level_id = :levelId
    `, { userId, worldKey: worldId, levelId });

    if (isCorrect && !existingLevel) {
        run(`
            INSERT INTO level_progress (
                id, user_id, world_key, level_id, question_id, status, score_earned, stars_earned, time_spent_seconds, completed_at
            ) VALUES (
                :id, :userId, :worldKey, :levelId, :questionId, 'completed', :scoreEarned, :starsEarned, :timeSpentSeconds, :completedAt
            )
        `, {
            id: createId('lvl'),
            userId,
            worldKey: worldId,
            levelId,
            questionId: questionId || null,
            scoreEarned,
            starsEarned,
            timeSpentSeconds,
            completedAt: now
        });
    }

    const worldLevelCount = get(`SELECT COUNT(*) AS count FROM level_progress WHERE user_id = :userId AND world_key = :worldKey`, { userId, worldKey: worldId }).count;
    const worldScore = get(`SELECT COALESCE(SUM(score_earned), 0) AS total FROM level_progress WHERE user_id = :userId AND world_key = :worldKey`, { userId, worldKey: worldId }).total;
    const worldStars = get(`SELECT COALESCE(SUM(stars_earned), 0) AS total FROM level_progress WHERE user_id = :userId AND world_key = :worldKey`, { userId, worldKey: worldId }).total;

    run(`
        UPDATE world_progress
        SET completed_levels = :completedLevels,
            total_score = :totalScore,
            stars_earned = :starsEarned,
            last_played_at = :lastPlayedAt,
            completed_at = CASE WHEN :completedLevels >= total_levels THEN COALESCE(completed_at, :lastPlayedAt) ELSE NULL END
        WHERE user_id = :userId AND world_key = :worldKey
    `, {
        userId,
        worldKey: worldId,
        completedLevels: worldLevelCount,
        totalScore: worldScore,
        starsEarned: worldStars,
        lastPlayedAt: now
    });

    const stats = getStatsPayload(userId);
    const previousDay = stats && stats.lastActivityDate ? new Date(stats.lastActivityDate) : null;
    let dayStreak = stats ? stats.dayStreak || 1 : 1;
    if (previousDay) {
        const currentDay = new Date();
        const diff = Math.floor((new Date(currentDay.setHours(0, 0, 0, 0)) - new Date(previousDay).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
            dayStreak += 1;
        } else if (diff > 1) {
            dayStreak = 1;
        }
    }

    const totalQuestionsAnswered = (stats?.totalQuestionsAnswered || 0) + 1;
    const correctAnswers = (stats?.correctAnswers || 0) + (isCorrect ? 1 : 0);
    const incorrectAnswers = (stats?.incorrectAnswers || 0) + (isCorrect ? 0 : 1);
    const currentStreak = isCorrect ? (stats?.streak || 0) + 1 : 0;
    const longestStreak = Math.max(stats?.longestStreak || 0, currentStreak);
    const totalPoints = get(`SELECT COALESCE(SUM(score_earned), 0) AS total FROM level_progress WHERE user_id = :userId`, { userId }).total;
    const speedCount = (stats?.speedCount || 0) + (isCorrect && timeSpentSeconds > 0 && timeSpentSeconds <= 20 ? 1 : 0);

    run(`
        INSERT INTO user_stats (
            user_id, total_questions_answered, correct_answers, incorrect_answers, total_points, current_streak, longest_streak, speed_count, day_streak, last_activity_date, last_world_played, updated_at
        ) VALUES (
            :userId, :totalQuestionsAnswered, :correctAnswers, :incorrectAnswers, :totalPoints, :currentStreak, :longestStreak, :speedCount, :dayStreak, :lastActivityDate, :lastWorldPlayed, :updatedAt
        )
        ON CONFLICT(user_id) DO UPDATE SET
            total_questions_answered = excluded.total_questions_answered,
            correct_answers = excluded.correct_answers,
            incorrect_answers = excluded.incorrect_answers,
            total_points = excluded.total_points,
            current_streak = excluded.current_streak,
            longest_streak = excluded.longest_streak,
            speed_count = excluded.speed_count,
            day_streak = excluded.day_streak,
            last_activity_date = excluded.last_activity_date,
            last_world_played = excluded.last_world_played,
            updated_at = excluded.updated_at
    `, {
        userId,
        totalQuestionsAnswered,
        correctAnswers,
        incorrectAnswers,
        totalPoints,
        currentStreak,
        longestStreak,
        speedCount,
        dayStreak,
        lastActivityDate: now,
        lastWorldPlayed: worldId,
        updatedAt: now
    });

    if (topic) {
        const topicRow = get(`SELECT * FROM topic_performance WHERE user_id = :userId AND topic_key = :topicKey`, { userId, topicKey: topic });
        const totalAttempts = (topicRow?.total_attempts || 0) + 1;
        const correctAttempts = (topicRow?.correct_attempts || 0) + (isCorrect ? 1 : 0);
        const accuracyRate = Math.round((correctAttempts / totalAttempts) * 100);
        run(`
            INSERT INTO topic_performance (id, user_id, topic_key, total_attempts, correct_attempts, accuracy_rate, updated_at)
            VALUES (:id, :userId, :topicKey, :totalAttempts, :correctAttempts, :accuracyRate, :updatedAt)
            ON CONFLICT(user_id, topic_key) DO UPDATE SET
                total_attempts = excluded.total_attempts,
                correct_attempts = excluded.correct_attempts,
                accuracy_rate = excluded.accuracy_rate,
                updated_at = excluded.updated_at
        `, {
            id: topicRow?.id || createId('topic'),
            userId,
            topicKey: topic,
            totalAttempts,
            correctAttempts,
            accuracyRate,
            updatedAt: now
        });
    }

    run(`UPDATE users SET total_points = :totalPoints, last_active_at = :lastActiveAt WHERE id = :userId`, {
        userId,
        totalPoints,
        lastActiveAt: now
    });

    logActivity({
        userId,
        actorUserId: userId,
        activityType: 'progress_event',
        entityType: 'level',
        entityId: String(levelId),
        metadata: { worldId, levelId, questionId, result, scoreEarned, timeSpentSeconds, starsEarned, topic }
    });

    response.json({ snapshot: getUserSnapshot(userId) });
});

app.post('/api/v1/diagnostics/submit', authenticate, (request, response) => {
    const { score = 0, totalQuestions = 0, percentage = 0, topicScores = {}, weakTopics = [], strongTopics = [], recommendations = [] } = request.body || {};
    const userId = request.user.userId;
    const now = new Date().toISOString();
    run(`
        INSERT INTO diagnostic_attempts (
            id, user_id, total_questions, total_correct, percentage, topic_scores_json, weak_topics_json, strong_topics_json, recommendations_json, submitted_at
        ) VALUES (
            :id, :userId, :totalQuestions, :totalCorrect, :percentage, :topicScoresJson, :weakTopicsJson, :strongTopicsJson, :recommendationsJson, :submittedAt
        )
    `, {
        id: createId('diag'),
        userId,
        totalQuestions,
        totalCorrect: score,
        percentage,
        topicScoresJson: JSON.stringify(topicScores),
        weakTopicsJson: JSON.stringify(weakTopics),
        strongTopicsJson: JSON.stringify(strongTopics),
        recommendationsJson: JSON.stringify(recommendations),
        submittedAt: now
    });
    run(`UPDATE users SET last_active_at = :lastActiveAt WHERE id = :userId`, { userId, lastActiveAt: now });
    logActivity({ userId, actorUserId: userId, activityType: 'diagnostic_submitted', entityType: 'diagnostic', metadata: { percentage, weakTopics, recommendations } });
    response.json({ diagnosticResults: getDiagnosticPayload(userId) });
});

app.post('/api/v1/achievements/unlock', authenticate, (request, response) => {
    const { achievementId } = request.body || {};
    if (!achievementId) {
        response.status(400).json({ error: 'achievementId is required.' });
        return;
    }
    run(`
        INSERT OR IGNORE INTO achievements (id, user_id, achievement_key, unlocked_at)
        VALUES (:id, :userId, :achievementKey, :unlockedAt)
    `, {
        id: createId('ach'),
        userId: request.user.userId,
        achievementKey: achievementId,
        unlockedAt: new Date().toISOString()
    });
    logActivity({ userId: request.user.userId, actorUserId: request.user.userId, activityType: 'achievement_unlocked', entityType: 'achievement', entityId: achievementId });
    response.json({ achievements: getAchievementsPayload(request.user.userId) });
});

app.get('/api/v1/activity/me', authenticate, (request, response) => {
    response.json({ items: getActivityPayload(request.user.userId, 50) });
});

app.post('/api/v1/users/me/reset-progress', authenticate, (request, response) => {
    const userId = request.user.userId;
    run(`DELETE FROM level_progress WHERE user_id = :userId`, { userId });
    run(`DELETE FROM diagnostic_attempts WHERE user_id = :userId`, { userId });
    run(`DELETE FROM achievements WHERE user_id = :userId`, { userId });
    run(`DELETE FROM topic_performance WHERE user_id = :userId`, { userId });
    run(`UPDATE user_stats SET total_questions_answered = 0, correct_answers = 0, incorrect_answers = 0, total_points = 0, current_streak = 0, longest_streak = 0, speed_count = 0, day_streak = 1, last_activity_date = :updatedAt, updated_at = :updatedAt WHERE user_id = :userId`, { userId, updatedAt: new Date().toISOString() });
    run(`UPDATE world_progress SET completed_levels = 0, total_score = 0, stars_earned = 0, completed_at = NULL, last_played_at = NULL WHERE user_id = :userId`, { userId });
    run(`UPDATE users SET total_points = 0, title = 'Rookie Hero', last_active_at = :lastActiveAt WHERE id = :userId`, { userId, lastActiveAt: new Date().toISOString() });
    logActivity({ userId, actorUserId: userId, activityType: 'progress_reset', entityType: 'user', entityId: userId });
    response.json({ snapshot: getUserSnapshot(userId) });
});

app.delete('/api/v1/users/me', authenticate, (request, response) => {
    const userId = request.user.userId;
    revokeSession(request.token);
    run(`UPDATE users SET status = 'deleted', deleted_at = :deletedAt WHERE id = :userId`, { userId, deletedAt: new Date().toISOString() });
    logActivity({ userId, actorUserId: userId, activityType: 'account_deleted', entityType: 'user', entityId: userId });
    response.json({ success: true });
});

app.get('/api/v1/admin/users', authenticate, requireAdmin, (request, response) => {
    const { q = '', grade = '', status = '', role = '', sortBy = 'last_active_at', sortOrder = 'DESC', page = '1', pageSize = '20' } = request.query;
    const safeSortBy = ['name', 'joined_at', 'last_active_at', 'total_points', 'grade'].includes(String(sortBy)) ? String(sortBy) : 'last_active_at';
    const safeSortOrder = String(sortOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const offset = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(pageSize));
    const limit = Math.max(1, Math.min(100, Number(pageSize)));

    const filters = ["deleted_at IS NULL"];
    const filterParams = {};
    if (q) {
        filters.push('(LOWER(name) LIKE :query OR LOWER(email) LIKE :query)');
        filterParams.query = `%${String(q).toLowerCase()}%`;
    }
    if (grade) {
        filters.push('grade = :grade');
        filterParams.grade = String(grade);
    }
    if (status) {
        filters.push('status = :status');
        filterParams.status = String(status);
    }
    if (role) {
        filters.push('role = :role');
        filterParams.role = String(role);
    }
    const whereClause = filters.join(' AND ');
    const listParams = { ...filterParams, limit, offset };

    const items = all(`
        SELECT id, name, email, grade, role, status, total_points, joined_at, last_login_at, last_active_at
        FROM users
        WHERE ${whereClause}
        ORDER BY ${safeSortBy} ${safeSortOrder}
        LIMIT :limit OFFSET :offset
    `, listParams).map((user) => {
        const worldCount = get(`SELECT COUNT(*) AS count FROM world_progress WHERE user_id = :userId AND completed_at IS NOT NULL`, { userId: user.id }).count;
        const stats = get(`SELECT correct_answers, total_questions_answered FROM user_stats WHERE user_id = :userId`, { userId: user.id });
        const averageScore = stats && stats.total_questions_answered ? Math.round((stats.correct_answers / stats.total_questions_answered) * 100) : 0;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            grade: user.grade,
            role: user.role,
            status: user.status,
            totalScore: user.total_points || 0,
            worldsCompleted: worldCount,
            averageScore,
            joinedAt: user.joined_at,
            lastLoginAt: user.last_login_at,
            lastActiveAt: user.last_active_at
        };
    });

    const totalItems = get(`SELECT COUNT(*) AS count FROM users WHERE ${whereClause}`, filterParams).count;
    response.json({
        items,
        pagination: {
            page: Math.max(1, Number(page)),
            pageSize: limit,
            totalItems
        }
    });
});

app.get('/api/v1/admin/users/:userId', authenticate, requireAdmin, (request, response) => {
    const snapshot = getUserSnapshot(request.params.userId);
    if (!snapshot) {
        response.status(404).json({ error: 'User not found.' });
        return;
    }
    response.json(snapshot);
});

app.patch('/api/v1/admin/users/:userId', authenticate, requireAdmin, (request, response) => {
    const { grade, status, role, name } = request.body || {};
    const userId = request.params.userId;
    const existing = get(`SELECT * FROM users WHERE id = :userId AND deleted_at IS NULL`, { userId });
    if (!existing) {
        response.status(404).json({ error: 'User not found.' });
        return;
    }
    run(`
        UPDATE users
        SET name = COALESCE(:name, name),
            grade = COALESCE(:grade, grade),
            status = COALESCE(:status, status),
            role = COALESCE(:role, role),
            last_active_at = :updatedAt
        WHERE id = :userId
    `, {
        userId,
        name: name || null,
        grade: grade || null,
        status: status || null,
        role: role || null,
        updatedAt: new Date().toISOString()
    });
    logAudit({ adminUserId: request.user.userId, targetUserId: userId, actionKey: 'user_updated', details: { grade, status, role, name } });
    response.json({ snapshot: getUserSnapshot(userId) });
});

app.delete('/api/v1/admin/users/:userId', authenticate, requireAdmin, (request, response) => {
    const userId = request.params.userId;
    run(`UPDATE users SET status = 'deleted', deleted_at = :deletedAt WHERE id = :userId`, { userId, deletedAt: new Date().toISOString() });
    logAudit({ adminUserId: request.user.userId, targetUserId: userId, actionKey: 'user_deleted' });
    response.json({ success: true });
});

app.post('/api/v1/admin/users/:userId/reset-progress', authenticate, requireAdmin, (request, response) => {
    const userId = request.params.userId;
    run(`DELETE FROM level_progress WHERE user_id = :userId`, { userId });
    run(`DELETE FROM diagnostic_attempts WHERE user_id = :userId`, { userId });
    run(`DELETE FROM achievements WHERE user_id = :userId`, { userId });
    run(`DELETE FROM topic_performance WHERE user_id = :userId`, { userId });
    run(`UPDATE user_stats SET total_questions_answered = 0, correct_answers = 0, incorrect_answers = 0, total_points = 0, current_streak = 0, longest_streak = 0, speed_count = 0, day_streak = 1, updated_at = :updatedAt, last_activity_date = :updatedAt WHERE user_id = :userId`, { userId, updatedAt: new Date().toISOString() });
    run(`UPDATE world_progress SET completed_levels = 0, total_score = 0, stars_earned = 0, completed_at = NULL, last_played_at = NULL WHERE user_id = :userId`, { userId });
    run(`UPDATE users SET total_points = 0, title = 'Rookie Hero' WHERE id = :userId`, { userId });
    logAudit({ adminUserId: request.user.userId, targetUserId: userId, actionKey: 'progress_reset' });
    response.json({ snapshot: getUserSnapshot(userId) });
});

app.get('/api/v1/admin/analytics/summary', authenticate, requireAdmin, (request, response) => {
    const cutoff7d = new Date(Date.now() - (1000 * 60 * 60 * 24 * 7)).toISOString();
    const cutoff30d = new Date(Date.now() - (1000 * 60 * 60 * 24 * 30)).toISOString();
    const totalUsers = get(`SELECT COUNT(*) AS count FROM users WHERE role = 'student' AND deleted_at IS NULL`).count;
    const activeUsers7d = get(`SELECT COUNT(*) AS count FROM users WHERE role = 'student' AND deleted_at IS NULL AND last_active_at IS NOT NULL AND last_active_at >= :cutoff7d`, { cutoff7d }).count;
    const activeUsers30d = get(`SELECT COUNT(*) AS count FROM users WHERE role = 'student' AND deleted_at IS NULL AND last_active_at IS NOT NULL AND last_active_at >= :cutoff30d`, { cutoff30d }).count;
    const averageScore = get(`SELECT COALESCE(AVG(total_points), 0) AS value FROM users WHERE role = 'student' AND deleted_at IS NULL`).value;
    const accuracy = get(`SELECT COALESCE(AVG(CASE WHEN total_questions_answered > 0 THEN (correct_answers * 100.0) / total_questions_answered ELSE 0 END), 0) AS value FROM user_stats`).value;
    const mostPlayed = get(`SELECT world_key, COUNT(*) AS count FROM level_progress GROUP BY world_key ORDER BY count DESC LIMIT 1`);

    response.json({
        totalUsers,
        activeUsers7d,
        activeUsers30d,
        averageScore: Math.round(averageScore || 0),
        averageAccuracy: Math.round(accuracy || 0),
        mostPlayedWorld: mostPlayed ? mostPlayed.world_key : 'integers'
    });
});

app.use((error, request, response, next) => {
    console.error(error);
    response.status(500).json({ error: 'Internal server error.' });
});

app.listen(config.port, () => {
    console.log(`Kingdom of Numbers backend running on http://127.0.0.1:${config.port}`);
});
