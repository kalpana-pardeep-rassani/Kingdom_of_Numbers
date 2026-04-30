/**
 * =========================================
 * KINGDOM OF NUMBERS - STORAGE LAYER
 * Local Storage CRUD operations
 * ========================================= */

const storage = {
    // Keys
    USERS_KEY: 'kon_users',
    CURRENT_USER_KEY: 'kon_currentUser',
    API_TOKEN_KEY: 'kon_api_token',
    THEME_KEY: 'kon_theme',
    PROGRESS_KEY: 'kon_progress',
    ACHIEVEMENTS_KEY: 'kon_achievements',
    STATS_KEY: 'kon_stats',
    DIAGNOSTIC_KEY: 'kon_diagnostic',
    // --- NEW CODE START ---
    getPersistenceStore: function(persist) {
        return persist === false ? sessionStorage : localStorage;
    },

    getPersistedValue: function(key) {
        return sessionStorage.getItem(key) || localStorage.getItem(key);
    },

    getPersistedValueMode: function(key) {
        return sessionStorage.getItem(key) !== null ? false : true;
    },

    clearPersistedValue: function(key) {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
    },
    // --- NEW CODE END ---
    
    // ============= USER OPERATIONS =============
    createUser: function(userData) {
        let users = this.getAllUsers();
        const newUser = {
            userId: this.generateId(),
            name: userData.name,
            email: userData.email,
            password: this.hashPassword(userData.password),
            class: userData.class,
            avatar: userData.avatar || 'hero',
            preferredWorld: userData.preferredWorld || 'integers',
            title: 'Rookie Hero',
            role: userData.role || 'student',
            status: userData.status || 'active',
            joinedDate: new Date().toISOString(),
            totalPoints: 0
        };
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return newUser;
    },
    
    getAllUsers: function() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    },
    
    getUserByEmail: function(email) {
        const users = this.getAllUsers();
        return users.find(u => u.email === email) || null;
    },
    
    getUserById: function(userId) {
        const users = this.getAllUsers();
        return users.find(u => u.userId === userId) || null;
    },
    
    updateUser: function(userId, updates) {
        let users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.userId === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.userId === userId) {
                this.setCurrentUser(users[userIndex]);
            }
            return users[userIndex];
        }
        return null;
    },

    deleteUser: function(userId) {
        const users = this.getAllUsers().filter(user => user.userId !== userId);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        this.resetUserData(userId);

        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.userId === userId) {
            this.logout();
        }
    },
    
    // ============= SESSION MANAGEMENT =============
    setCurrentUser: function(user, persist) {
        const safeUser = {
            userId: user.userId,
            name: user.name,
            email: user.email,
            class: user.class,
            avatar: user.avatar || 'hero',
            preferredWorld: user.preferredWorld || 'integers',
            title: user.title || 'Rookie Hero',
            totalPoints: user.totalPoints,
            role: user.role || 'student',
            status: user.status || 'active',
            joinedDate: user.joinedDate || null,
            lastLoginDate: user.lastLoginDate || null,
            lastActivityDate: user.lastActivityDate || null
        };
        if (typeof persist === 'undefined') {
            persist = this.getPersistedValueMode(this.CURRENT_USER_KEY);
        }
        this.clearPersistedValue(this.CURRENT_USER_KEY);
        this.getPersistenceStore(persist).setItem(this.CURRENT_USER_KEY, JSON.stringify(safeUser));
    },
    
    getCurrentUser: function() {
        const user = this.getPersistedValue(this.CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    hasApiSession: function() {
        return typeof apiClient !== 'undefined' && Boolean(apiClient.getToken());
    },

    upsertCachedUser: function(userData) {
        if (!userData || !userData.userId) {
            return;
        }

        const users = this.getAllUsers();
        const userIndex = users.findIndex((user) => user.userId === userData.userId);
        const existingUser = userIndex === -1 ? null : users[userIndex];
        const cachedUser = {
            ...(existingUser || {}),
            ...userData,
            password: existingUser ? existingUser.password : ''
        };

        if (userIndex === -1) {
            users.push(cachedUser);
        } else {
            users[userIndex] = cachedUser;
        }

        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },

    hydrateFromServerSnapshot: function(snapshot, persist) {
        if (!snapshot || !snapshot.user) {
            return;
        }

        this.upsertCachedUser(snapshot.user);
        this.setCurrentUser(snapshot.user, persist);

        if (snapshot.progress) {
            const allProgress = this.getAllProgress();
            allProgress[snapshot.user.userId] = snapshot.progress;
            localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(allProgress));
        }

        if (snapshot.stats) {
            const allStats = this.getAllStats();
            allStats[snapshot.user.userId] = snapshot.stats;
            localStorage.setItem(this.STATS_KEY, JSON.stringify(allStats));
        }

        if (snapshot.achievements) {
            const allAchievements = this.getAllAchievements();
            allAchievements[snapshot.user.userId] = snapshot.achievements;
            localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(allAchievements));
        }

        if (snapshot.diagnosticResults) {
            const allDiagnostics = this.getAllDiagnostics();
            allDiagnostics[snapshot.user.userId] = snapshot.diagnosticResults;
            localStorage.setItem(this.DIAGNOSTIC_KEY, JSON.stringify(allDiagnostics));
        }
    },
    
    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    },
    
    logout: function() {
        this.clearPersistedValue(this.CURRENT_USER_KEY);
        if (typeof apiClient !== 'undefined') {
            apiClient.clearToken();
        }
    },

    getTheme: function() {
        const storedTheme = localStorage.getItem(this.THEME_KEY);
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    },

    setTheme: function(theme) {
        const nextTheme = theme === 'dark' ? 'dark' : 'light';
        localStorage.setItem(this.THEME_KEY, nextTheme);
        return nextTheme;
    },
    
    // ============= PROGRESS OPERATIONS =============
    initializeProgress: function(userId) {
        const progress = {
            userId: userId,
            totalPoints: 0,
            worlds: [
                { worldId: 'integers', completedLevels: 0, totalLevels: this.getWorldTotalLevels('integers'), points: 0, levels: [], completedAt: null },
                { worldId: 'fractions', completedLevels: 0, totalLevels: this.getWorldTotalLevels('fractions'), points: 0, levels: [], completedAt: null },
                { worldId: 'algebra', completedLevels: 0, totalLevels: this.getWorldTotalLevels('algebra'), points: 0, levels: [], completedAt: null },
                { worldId: 'geometry', completedLevels: 0, totalLevels: this.getWorldTotalLevels('geometry'), points: 0, levels: [], completedAt: null }
            ]
        };
        this.saveProgress(userId, progress);
        return progress;
    },
    
    getProgress: function(userId) {
        const allProgress = this.getAllProgress();
        const progress = allProgress[userId] || this.initializeProgress(userId);
        return this.normalizeProgress(userId, progress);
    },
    
    getAllProgress: function() {
        const progress = localStorage.getItem(this.PROGRESS_KEY);
        return progress ? JSON.parse(progress) : {};
    },
    
    saveProgress: function(userId, progressData) {
        const allProgress = this.getAllProgress();
        allProgress[userId] = progressData;
        localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(allProgress));
    },

    getWorldTotalLevels: function(worldId) {
        if (typeof gameData === 'undefined') {
            return 10;
        }
        return gameData.getWorldQuestions(worldId).length;
    },

    normalizeProgress: function(userId, progress) {
        let changed = false;

        progress.worlds = progress.worlds.map((worldData) => {
            const totalLevels = this.getWorldTotalLevels(worldData.worldId);
            const completedLevels = (worldData.levels || []).filter(level => level.completed).length;
            const normalizedWorld = {
                ...worldData,
                totalLevels,
                completedLevels
            };

            if (normalizedWorld.totalLevels !== worldData.totalLevels || normalizedWorld.completedLevels !== worldData.completedLevels) {
                changed = true;
            }

            if (completedLevels < totalLevels && normalizedWorld.completedAt) {
                normalizedWorld.completedAt = null;
                changed = true;
            }

            return normalizedWorld;
        });

        if (changed) {
            this.saveProgress(userId, progress);
        }

        return progress;
    },
    
    updateWorldProgress: function(userId, worldId, levelId, points, meta = {}) {
        const progress = this.getProgress(userId);
        const worldData = progress.worlds.find(w => w.worldId === worldId);
        
        if (worldData) {
            const levelExists = worldData.levels.find(l => l.levelId === levelId);
            
            if (!levelExists && meta.isCorrect) {
                worldData.levels.push({
                    levelId: levelId,
                    completed: true,
                    points: points,
                    stars: meta.stars || 1,
                    timeSpent: meta.timeSpent || 0,
                    completedDate: new Date().toISOString()
                });
                worldData.completedLevels = worldData.levels.filter(l => l.completed).length;
                worldData.points += points;
                progress.totalPoints = (progress.totalPoints || 0) + points;
            }

            worldData.lastPlayedAt = new Date().toISOString();

            if (worldData.completedLevels >= worldData.totalLevels && !worldData.completedAt) {
                worldData.completedAt = new Date().toISOString();
            }
        }
        
        this.saveProgress(userId, progress);
        return progress;
    },

    syncProgressEvent: function(payload) {
        if (!this.hasApiSession()) {
            return Promise.resolve(null);
        }

        return apiClient.postProgressEvent(payload)
            .then((result) => {
                if (result.snapshot) {
                    this.hydrateFromServerSnapshot(result.snapshot);
                }
                return result;
            })
            .catch((error) => {
                console.warn('Progress sync failed:', error.message);
                return null;
            });
    },
    
    // ============= STATISTICS =============
    initializeStats: function(userId) {
        const stats = {
            userId: userId,
            totalQuestionsAnswered: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            streak: 0,
            longestStreak: 0,
            totalPoints: 0,
            lastActivityDate: new Date().toISOString(),
            topicsProgress: {},
            worldsCompleted: [],
            speedCount: 0,
            dayStreak: 1
        };
        this.saveStats(userId, stats);
        return stats;
    },
    
    getStats: function(userId) {
        const allStats = this.getAllStats();
        return allStats[userId] || this.initializeStats(userId);
    },
    
    getAllStats: function() {
        const stats = localStorage.getItem(this.STATS_KEY);
        return stats ? JSON.parse(stats) : {};
    },
    
    saveStats: function(userId, statsData) {
        const allStats = this.getAllStats();
        allStats[userId] = statsData;
        localStorage.setItem(this.STATS_KEY, JSON.stringify(allStats));
    },
    
    updateStats: function(userId, payload) {
        let stats = this.getStats(userId);
        const {
            isCorrect,
            topic,
            worldId,
            points = 0,
            timeSpent = 0
        } = payload;
        const today = new Date();
        const lastActivity = stats.lastActivityDate ? new Date(stats.lastActivityDate) : null;
        const msPerDay = 1000 * 60 * 60 * 24;
        const dayDiff = lastActivity ? Math.floor((today.setHours(0, 0, 0, 0) - new Date(lastActivity).setHours(0, 0, 0, 0)) / msPerDay) : 0;
        
        stats.totalQuestionsAnswered++;
        if (isCorrect) {
            stats.correctAnswers++;
            stats.streak++;
            if (stats.streak > stats.longestStreak) {
                stats.longestStreak = stats.streak;
            }
        } else {
            stats.incorrectAnswers++;
            stats.streak = 0;
        }

        if (points > 0) {
            stats.totalPoints = (stats.totalPoints || 0) + points;
        }

        if (isCorrect && timeSpent > 0 && timeSpent <= 20) {
            stats.speedCount = (stats.speedCount || 0) + 1;
        }

        if (topic) {
            const topicStats = stats.topicsProgress[topic] || { total: 0, correct: 0, accuracy: 0 };
            topicStats.total++;
            if (isCorrect) {
                topicStats.correct++;
            }
            topicStats.accuracy = Math.round((topicStats.correct / topicStats.total) * 100);
            stats.topicsProgress[topic] = topicStats;
        }

        if (dayDiff === 1) {
            stats.dayStreak = (stats.dayStreak || 1) + 1;
        } else if (dayDiff > 1) {
            stats.dayStreak = 1;
        } else if (!stats.dayStreak) {
            stats.dayStreak = 1;
        }

        if (worldId) {
            stats.lastWorldPlayed = worldId;
        }

        stats.lastActivityDate = new Date().toISOString();
        
        this.saveStats(userId, stats);
        return stats;
    },

    markWorldCompleted: function(userId, worldId) {
        const stats = this.getStats(userId);
        if (!stats.worldsCompleted.includes(worldId)) {
            stats.worldsCompleted.push(worldId);
            this.saveStats(userId, stats);
        }
        return stats;
    },
    
    // ============= ACHIEVEMENTS =============
    getAchievements: function(userId) {
        const allAchievements = this.getAllAchievements();
        return allAchievements[userId] || { userId: userId, unlocked: [] };
    },
    
    getAllAchievements: function() {
        const achievements = localStorage.getItem(this.ACHIEVEMENTS_KEY);
        return achievements ? JSON.parse(achievements) : {};
    },
    
    unlockAchievement: function(userId, achievementId) {
        let achievements = this.getAchievements(userId);
        
        if (!achievements.unlocked.find(a => a.id === achievementId)) {
            achievements.unlocked.push({
                id: achievementId,
                unlockedDate: new Date().toISOString()
            });
        }
        
        const allAchievements = this.getAllAchievements();
        allAchievements[userId] = achievements;
        localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(allAchievements));

        if (this.hasApiSession()) {
            apiClient.unlockAchievement(achievementId)
                .then((result) => {
                    if (result && result.achievements) {
                        const updatedAchievements = this.getAllAchievements();
                        updatedAchievements[userId] = result.achievements;
                        localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(updatedAchievements));
                    }
                })
                .catch((error) => console.warn('Achievement sync failed:', error.message));
        }
        
        return achievements;
    },
    
    // ============= DIAGNOSTIC TEST =============
    saveDiagnosticResults: function(userId, results) {
        const allDiagnostics = this.getAllDiagnostics();
        allDiagnostics[userId] = {
            userId: userId,
            completedDate: new Date().toISOString(),
            score: results.score,
            totalQuestions: results.totalQuestions,
            percentage: results.percentage,
            topicScores: results.topicScores,
            weakTopics: results.weakTopics,
            strongTopics: results.strongTopics,
            recommendations: results.recommendations || []
        };
        localStorage.setItem(this.DIAGNOSTIC_KEY, JSON.stringify(allDiagnostics));

        if (this.hasApiSession()) {
            apiClient.submitDiagnostic(results)
                .then((result) => {
                    if (result && result.diagnosticResults) {
                        const latestDiagnostics = this.getAllDiagnostics();
                        latestDiagnostics[userId] = result.diagnosticResults;
                        localStorage.setItem(this.DIAGNOSTIC_KEY, JSON.stringify(latestDiagnostics));
                    }
                })
                .catch((error) => console.warn('Diagnostic sync failed:', error.message));
        }
    },
    
    getDiagnosticResults: function(userId) {
        const allDiagnostics = this.getAllDiagnostics();
        return allDiagnostics[userId] || null;
    },
    
    getAllDiagnostics: function() {
        const diagnostics = localStorage.getItem(this.DIAGNOSTIC_KEY);
        return diagnostics ? JSON.parse(diagnostics) : {};
    },
    
    hasDiagnosticTest: function(userId) {
        return this.getDiagnosticResults(userId) !== null;
    },
    
    // ============= UTILITY FUNCTIONS =============
    generateId: function() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    hashPassword: function(password) {
        // Simple hash (NOT cryptographically secure, but OK for MVP)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    },
    
    verifyPassword: function(plainPassword, hashedPassword) {
        return this.hashPassword(plainPassword) === hashedPassword;
    },
    
    // ============= RESET DATA =============
    resetAllData: function() {
        if (confirm('Are you sure? This will delete ALL app data!')) {
            localStorage.clear();
            console.log('All data reset!');
            location.reload();
        }
    },
    
    resetUserData: function(userId) {
        const allProgress = this.getAllProgress();
        delete allProgress[userId];
        localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(allProgress));
        
        const allStats = this.getAllStats();
        delete allStats[userId];
        localStorage.setItem(this.STATS_KEY, JSON.stringify(allStats));
        
        const allAchievements = this.getAllAchievements();
        delete allAchievements[userId];
        localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(allAchievements));

        const allDiagnostics = this.getAllDiagnostics();
        delete allDiagnostics[userId];
        localStorage.setItem(this.DIAGNOSTIC_KEY, JSON.stringify(allDiagnostics));
    }
};

console.log('✅ Storage layer initialized!');
