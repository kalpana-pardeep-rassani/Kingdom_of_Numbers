/**
 * =========================================
 * KINGDOM OF NUMBERS - UI RENDERING
 * Screen rendering and DOM updates
 * ========================================= */

const ui = {
    escapeHtml: function(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    topicLabel: function(topic) {
        const labels = {
            integers: 'Integers',
            fractions: 'Fractions, Decimals, Percentages',
            algebra: 'Algebra and Equations',
            geometry: 'Geometry and Measurement'
        };
        return labels[topic] || utils.capitalize(topic);
    },

    getWorldByTopic: function(topic) {
        return gameData.worlds.find(world => world.id === topic) || null;
    },

    renderAudioControls: function() {
        const settings = typeof audioManager !== 'undefined' ? audioManager.getSettings() : {
            musicEnabled: false,
            sfxEnabled: false,
            masterVolume: 0.35
        };
        const volumePercent = Math.round(settings.masterVolume * 100);

        return `
            <div class="audio-control-cluster">
                <button id="audioMusicToggle" class="audio-chip ${settings.musicEnabled ? 'active' : ''}" onclick="audioManager.toggleMusic()">
                    ${settings.musicEnabled ? '🎵 Music On' : '🎵 Music Off'}
                </button>
                <button id="audioSfxToggle" class="audio-chip ${settings.sfxEnabled ? 'active' : ''}" onclick="audioManager.toggleSfx()">
                    ${settings.sfxEnabled ? '🔔 SFX On' : '🔔 SFX Off'}
                </button>
                <button id="audioVolumeCycle" class="audio-chip" onclick="audioManager.cycleVolume()">
                    🔊 ${volumePercent}%
                </button>
            </div>
        `;
    },

    renderThemeToggle: function() {
        const currentTheme = app && app.appState && app.appState.theme === 'dark' ? 'dark' : 'light';
        const nextLabel = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        const icon = currentTheme === 'dark' ? '☀️' : '🌙';

        return `
            <button class="theme-toggle" onclick="app.toggleTheme()" aria-label="Switch theme">
                <span class="theme-toggle-icon">${icon}</span>
                <span>${nextLabel}</span>
            </button>
        `;
    },

    renderStarsInline: function(count) {
        const safeCount = Math.max(0, count || 0);
        if (!safeCount) {
            return '<span class="star-strip muted">☆☆☆</span>';
        }

        return `<span class="star-strip">${'★'.repeat(safeCount)}${'☆'.repeat(3 - safeCount)}</span>`;
    },

    renderWorldJourneyPath: function(world, worldProgress) {
        const levels = gameData.getWorldQuestions(world.id);
        const completedIds = new Set((worldProgress.levels || []).map(level => level.levelId));
        const currentLevelId = levels.find(level => !completedIds.has(level.id))?.id || null;

        return `
            <div class="journey-path">
                ${levels.map((level, index) => {
                    const levelRecord = (worldProgress.levels || []).find(item => item.levelId === level.id);
                    const isComplete = Boolean(levelRecord);
                    const isCurrent = !isComplete && currentLevelId === level.id;
                    const isTreasureNode = (index + 1) % 3 === 0 && index !== levels.length - 1;
                    const isBossNode = index === levels.length - 1;
                    const levelLabel = isBossNode ? 'Boss' : index + 1;

                    return `
                        <div class="journey-node ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''} ${isTreasureNode ? 'treasure' : ''} ${isBossNode ? 'boss' : ''}">
                            <div class="journey-node-core">${isTreasureNode ? '🎁' : isBossNode ? '👑' : levelLabel}</div>
                            <div class="journey-node-meta">
                                <small>${isBossNode ? 'Boss Gate' : `Level ${index + 1}`}</small>
                                ${levelRecord ? this.renderStarsInline(levelRecord.stars || 0) : '<span class="star-strip muted">☆☆☆</span>'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    renderStars: function() {
        return `
            <div class="scene-decor scene-decor-a"></div>
            <div class="scene-decor scene-decor-b"></div>
            <div class="scene-decor scene-decor-c"></div>
            <div class="scene-spark scene-spark-a">✨</div>
            <div class="scene-spark scene-spark-b">⭐</div>
            <div class="scene-spark scene-spark-c">🌟</div>
        `;
    },

    renderAuthShell: function(title, subtitle, formMarkup, footerMarkup, asideMarkup) {
        const appDiv = document.getElementById('app');
        appDiv.innerHTML = `
            <div class="auth-scene">
                ${this.renderStars()}
                <div class="auth-theme-bar">${this.renderThemeToggle()}</div>
                <div class="auth-layout">
                    <section class="auth-story-card slide-right">
                        <div class="auth-story-badge">Kingdom of Numbers</div>
                        <h1 class="auth-story-title">Kingdom of Numbers</h1>
                        <p class="auth-story-text">A cartoon-style math adventure for Grade 6 to 8 students. Every lesson becomes a quest, every answer earns rewards, and every world teaches a Federal Board topic through playful storytelling.</p>
                        <div class="auth-character-row">
                            <div class="auth-character-card">
                                <div class="auth-character-emoji">🧙‍♂️</div>
                                <div>
                                    <strong>Math Wizard</strong>
                                    <p>Guides the hero through every world.</p>
                                </div>
                            </div>
                            <div class="auth-character-card">
                                <div class="auth-character-emoji">🦸</div>
                                <div>
                                    <strong>Student Hero</strong>
                                    <p>Solves quests, unlocks badges, and saves the kingdom.</p>
                                </div>
                            </div>
                        </div>
                        <div class="auth-story-points">
                            <span>🏝️ 4 worlds</span>
                            <span>🧩 40 levels</span>
                            <span>🏆 badges + XP</span>
                        </div>
                        ${asideMarkup || ''}
                    </section>
                    <section class="auth-card slide-up">
                        <div class="auth-card-header">
                            <div class="auth-card-icon">🎮</div>
                            <h2>${title}</h2>
                            <p>${subtitle}</p>
                        </div>
                        ${formMarkup}
                        <div class="auth-card-footer">${footerMarkup}</div>
                    </section>
                </div>
            </div>
        `;
    },

    renderShell: function(activePage, contentMarkup, options = {}) {
        const user = storage.getCurrentUser();
        const safeName = this.escapeHtml(user ? user.name : 'Hero');
        const safeTitle = this.escapeHtml(user ? user.title || 'Rookie Hero' : 'Rookie Hero');
        const appDiv = document.getElementById('app');
        const showNav = options.showNav !== false;
        const showAudio = options.showAudio !== false;
        const compact = options.compact === true;
        const shellClass = compact ? 'scene-shell scene-shell-compact' : 'scene-shell';

        appDiv.innerHTML = `
            <div class="${shellClass}">
                ${this.renderStars()}
                <header class="kingdom-nav ${compact ? 'kingdom-nav-compact' : ''}">
                    <button class="kingdom-logo" onclick="app.showPage('dashboard')">
                        <span class="kingdom-logo-icon">🏰</span>
                        <span>
                            <strong>Kingdom of Numbers</strong>
                            <small>Math Adventure</small>
                        </span>
                    </button>
                    ${showNav ? `
                        <nav class="kingdom-nav-links">
                            <button class="kingdom-nav-link ${activePage === 'dashboard' ? 'active' : ''}" onclick="app.showPage('dashboard')">Dashboard</button>
                            <button class="kingdom-nav-link ${activePage === 'worlds' ? 'active' : ''}" onclick="app.showPage('worlds')">Worlds</button>
                            <button class="kingdom-nav-link ${activePage === 'progress' ? 'active' : ''}" onclick="app.showPage('progress')">Progress</button>
                            <button class="kingdom-nav-link ${activePage === 'profile' ? 'active' : ''}" onclick="app.showPage('profile')">Profile</button>
                        </nav>
                    ` : '<div class="kingdom-nav-focus-label">Focus Quest</div>'}
                    <div class="kingdom-nav-user">
                        <div class="kingdom-nav-avatar">🦸</div>
                        <div>
                            <strong>${safeName}</strong>
                            <small>${safeTitle}</small>
                        </div>
                        ${this.renderThemeToggle()}
                        ${showAudio ? this.renderAudioControls() : ''}
                        <button class="btn btn-secondary btn-small" onclick="app.logout()">Logout</button>
                    </div>
                </header>
                <main class="scene-main">${contentMarkup}</main>
            </div>
        `;
    },

    renderTopicBadges: function(topics, variant, emptyText = 'No data yet') {
        if (!topics || !topics.length) {
            return `<span class="badge badge-info">${emptyText}</span>`;
        }

        return topics.map(topic => `<span class="badge ${variant}">${this.topicLabel(topic)}</span>`).join('');
    },

    renderAchievementsPreview: function(unlockedAchievements) {
        if (!unlockedAchievements.length) {
            return `
                <div class="empty-state-card">
                    <div class="empty-state-icon">🏅</div>
                    <h3>Your badge shelf is waiting</h3>
                    <p>Answer quests correctly to unlock your first achievement.</p>
                </div>
            `;
        }

        return `
            <div class="achievement-grid">
                ${unlockedAchievements.map(item => {
                    const achievement = gameData.achievements.find(achievementItem => achievementItem.id === item.id);
                    return achievement ? `
                        <article class="achievement-card">
                            <div class="achievement-icon">${achievement.icon}</div>
                            <h4>${achievement.name}</h4>
                            <p>${achievement.description}</p>
                        </article>
                    ` : '';
                }).join('')}
            </div>
        `;
    },

    renderLoginPage: function() {
        this.renderAuthShell(
            'Hero Login',
            'Continue your learning quest and rescue the four math worlds.',
            `
                <form class="login-form" id="loginForm">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" class="form-control" placeholder="hero@email.com" required>
                        <div class="form-error" id="loginEmailError"></div>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" class="form-control" placeholder="Enter your secret key" required>
                        <div class="form-error" id="loginPasswordError"></div>
                    </div>
                    <!-- --- NEW CODE START --- -->
                    <div class="form-group">
                        <label for="loginRememberMe">
                            <input type="checkbox" id="loginRememberMe" checked>
                            Remember Me
                        </label>
                    </div>
                    <div class="form-group">
                        <a id="forgotPasswordLink">Forgot Password?</a>
                    </div>
                    <!-- --- NEW CODE END --- -->
                    <button type="submit" class="btn btn-primary btn-large">Enter the Kingdom</button>
                    <div id="loginError" class="form-error"></div>
                </form>
            `,
            `No account yet? <a id="signupLink">Create one</a> · <a id="adminAccessLink">Admin Access</a>`,
            `
                <div class="auth-side-panel">
                    <h3>Why students enjoy it</h3>
                    <ul class="auth-check-list">
                        <li>Story-based math challenges</li>
                        <li>XP, badges, and world progress</li>
                        <li>Personalized practice after diagnostic test</li>
                    </ul>
                </div>
            `
        );

        document.getElementById('loginForm').addEventListener('submit', (event) => {
            event.preventDefault();
            app.handleLogin();
        });

        document.getElementById('signupLink').addEventListener('click', () => {
            app.showPage('signup');
        });

        // --- NEW CODE START ---
        document.getElementById('forgotPasswordLink').addEventListener('click', () => {
            app.handleForgotPassword();
        });
        // --- NEW CODE END ---

        document.getElementById('adminAccessLink').addEventListener('click', () => {
            app.showPage('admin-login');
        });
    },

    renderSignupPage: function() {
        this.renderAuthShell(
            'Create Hero Account',
            'Join the kingdom, choose your grade, and begin your personalized math adventure.',
            `
                <form class="login-form" id="signupForm">
                    <div class="form-group">
                        <label for="signupName">Full Name</label>
                        <input type="text" id="signupName" class="form-control" placeholder="Your hero name" required>
                        <div class="form-error" id="signupNameError"></div>
                    </div>
                    <div class="form-group">
                        <label for="signupClass">Class / Grade</label>
                        <select id="signupClass" class="form-control" required>
                            <option value="">Select Your Grade</option>
                            <option value="6">Grade 6</option>
                            <option value="7">Grade 7</option>
                            <option value="8">Grade 8</option>
                        </select>
                        <div class="form-error" id="signupClassError"></div>
                    </div>
                    <div class="form-group">
                        <label for="signupPreferredWorld">Favorite World</label>
                        <select id="signupPreferredWorld" class="form-control">
                            <option value="integers">Integers Island</option>
                            <option value="fractions">Fractions Forest</option>
                            <option value="algebra">Algebra Academy</option>
                            <option value="geometry">Geometry Garden</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="signupEmail">Email</label>
                        <input type="email" id="signupEmail" class="form-control" placeholder="hero@email.com" required>
                        <div class="form-error" id="signupEmailError"></div>
                    </div>
                    <div class="form-group">
                        <label for="signupPassword">Password</label>
                        <input type="password" id="signupPassword" class="form-control" placeholder="At least 6 characters" required>
                        <div class="form-error" id="signupPasswordError"></div>
                    </div>
                    <div class="form-group">
                        <label for="signupConfirmPassword">Confirm Password</label>
                        <input type="password" id="signupConfirmPassword" class="form-control" placeholder="Repeat your password" required>
                        <div class="form-error" id="signupConfirmPasswordError"></div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-large">Start My Adventure</button>
                    <div id="signupError" class="form-error"></div>
                </form>
            `,
            `Already a hero? <a id="loginLink">Login here</a> · <a id="signupAdminAccessLink">Admin Access</a>`,
            `
                <div class="auth-side-panel">
                    <h3>Your learning loop</h3>
                    <ul class="auth-check-list">
                        <li>Take a 10-question diagnostic test</li>
                        <li>Discover weak and strong topics</li>
                        <li>Follow your recommended world order</li>
                        <li>Track progress and unlock achievements</li>
                    </ul>
                </div>
            `
        );

        document.getElementById('signupForm').addEventListener('submit', (event) => {
            event.preventDefault();
            app.handleSignup();
        });

        document.getElementById('loginLink').addEventListener('click', () => {
            app.showPage('login');
        });

        document.getElementById('signupAdminAccessLink').addEventListener('click', () => {
            app.showPage('admin-login');
        });
    },

    renderDashboard: function() {
        const user = storage.getCurrentUser();
        const safeName = this.escapeHtml(user.name);
        const stats = storage.getStats(user.userId);
        const progress = game.getAllProgress();
        const achievements = game.getAchievements();
        const diagnosticResults = storage.getDiagnosticResults(user.userId);
        const recommendedWorlds = game.getRecommendedWorldCards();
        const nextWorld = recommendedWorlds[0];
        const accuracy = Math.round((stats.correctAnswers / Math.max(stats.totalQuestionsAnswered, 1)) * 100) || 0;

        this.renderShell('dashboard', `
            <section class="hero-banner hero-banner-dashboard slide-up">
                <div>
                    <span class="hero-chip">${utils.getTimeGreeting()}, ${safeName}</span>
                    <h1>Welcome back, Math Hero!</h1>
                    <p>${getCharacterDialog('mathWizard', 'welcome')}</p>
                    <div class="hero-cta-row">
                        <button class="btn btn-primary" onclick="app.showPage('${diagnosticResults ? 'worlds' : 'diagnostic'}')">${diagnosticResults ? 'Continue Adventure' : 'Start Diagnostic Test'}</button>
                        <button class="btn btn-secondary" onclick="app.showPage('progress')">View Progress</button>
                    </div>
                </div>
                <div class="hero-banner-art">
                    <div class="hero-avatar-orb">🦸</div>
                    <div class="hero-sidekick">🧙‍♂️</div>
                    <div class="hero-villain peek">👹</div>
                </div>
            </section>

            <section class="stats-grid">
                <article class="stat-adventure-card">
                    <span>⭐ Total XP</span>
                    <strong>${user.totalPoints || 0}</strong>
                    <small>Earned from correct answers and speed bonuses</small>
                </article>
                <article class="stat-adventure-card">
                    <span>🔥 Current Streak</span>
                    <strong>${stats.streak || 0}</strong>
                    <small>Correct answers in a row</small>
                </article>
                <article class="stat-adventure-card">
                    <span>🎯 Accuracy</span>
                    <strong>${accuracy}%</strong>
                    <small>${stats.correctAnswers || 0} correct out of ${stats.totalQuestionsAnswered || 0}</small>
                </article>
                <article class="stat-adventure-card">
                    <span>🏆 Achievements</span>
                    <strong>${achievements.unlocked.length}</strong>
                    <small>Badges collected on your journey</small>
                </article>
            </section>

            <section class="quest-board-grid">
                <article class="quest-panel quest-panel-primary">
                    <h2>Royal Quest Board</h2>
                    <p>The kingdom learns best when every step follows the learning loop: test, practice, improve, and celebrate.</p>
                    <div class="quest-actions">
                        <button class="btn btn-primary" onclick="app.showPage('${diagnosticResults ? 'diagnostic-results' : 'diagnostic'}')">${diagnosticResults ? 'View Diagnostic Analysis' : 'Take Diagnostic Test'}</button>
                        <button class="btn btn-secondary" onclick="app.showPage('worlds')">Explore Worlds</button>
                    </div>
                </article>
                <article class="quest-panel quest-panel-light">
                    <h2>Learning Loop</h2>
                    <div class="loop-list">
                        <span>1. Diagnostic Test</span>
                        <span>2. Weak Area Detection</span>
                        <span>3. Personalized Path</span>
                        <span>4. Game Practice</span>
                        <span>5. Progress Tracking</span>
                        <span>6. Adaptive Improvement</span>
                    </div>
                </article>
            </section>

            ${diagnosticResults ? `
                <section class="content-grid-two">
                    <article class="story-card">
                        <div class="section-tag">Personalized Path</div>
                        <h2>Recommended order for your next quests</h2>
                        <p>The Math Wizard reviewed your diagnostic test and arranged the worlds from most important to most comfortable.</p>
                        <div class="recommendation-list">
                            ${recommendedWorlds.map((world, index) => `
                                <button class="recommendation-card world-theme-${world.id}" onclick="app.selectWorld('${world.id}')">
                                    <div>
                                        <span class="recommendation-rank">${index + 1}</span>
                                        <strong>${world.emoji} ${world.name}</strong>
                                    </div>
                                    <small>${world.description}</small>
                                </button>
                            `).join('')}
                        </div>
                        ${nextWorld ? `<button class="btn btn-primary mt-md" onclick="app.selectWorld('${nextWorld.id}')">Start First Recommended World</button>` : ''}
                    </article>
                    <article class="story-card">
                        <div class="section-tag">Diagnostic Insights</div>
                        <h2>Your strengths and weak areas</h2>
                        <div class="insight-block">
                            <h3>Weak Topics</h3>
                            <div class="badge-row">${this.renderTopicBadges(diagnosticResults.weakTopics, 'badge-danger', 'No weak topics right now')}</div>
                        </div>
                        <div class="insight-block">
                            <h3>Strong Topics</h3>
                            <div class="badge-row">${this.renderTopicBadges(diagnosticResults.strongTopics, 'badge-success', 'No strong topics yet')}</div>
                        </div>
                        <div class="insight-block">
                            <h3>Topic Scores</h3>
                            <div class="topic-meter-list">
                                ${Object.entries(diagnosticResults.topicScores).map(([topic, score]) => `
                                    <div class="topic-meter">
                                        <div class="topic-meter-head">
                                            <span>${this.topicLabel(topic)}</span>
                                            <strong>${score}%</strong>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar primary" style="width:${score}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </article>
                </section>
            ` : `
                <section class="story-card callout-card">
                    <div class="section-tag">Next Step</div>
                    <h2>Unlock your personalized path</h2>
                    <p>Take the 10-question diagnostic test so the app can detect weak areas and recommend which world to study first.</p>
                    <button class="btn btn-primary" onclick="app.showPage('diagnostic')">Begin Diagnostic Quest</button>
                </section>
            `}

            <section class="content-grid-two">
                <article class="story-card">
                    <div class="section-tag">World Progress</div>
                    <h2>Kingdom map status</h2>
                    <div class="world-progress-list">
                        ${progress.worlds.map(worldProgress => {
                            const world = gameData.worlds.find(item => item.id === worldProgress.worldId);
                            const percentage = Math.round((worldProgress.completedLevels / worldProgress.totalLevels) * 100) || 0;
                            return `
                                <button class="world-progress-card" onclick="app.selectWorld('${world.id}')">
                                    <div class="world-progress-card-top">
                                        <strong>${world.emoji} ${world.name}</strong>
                                        <span>${percentage}%</span>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar primary" style="width:${percentage}%"></div>
                                    </div>
                                    <small>${worldProgress.completedLevels}/${worldProgress.totalLevels} levels cleared</small>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </article>
                <article class="story-card">
                    <div class="section-tag">Achievements</div>
                    <h2>Badge Collection</h2>
                    ${this.renderAchievementsPreview(achievements.unlocked.slice(0, 4))}
                    <button class="btn btn-secondary mt-md" onclick="app.showPage('progress')">See Full Progress</button>
                </article>
            </section>
        `);
    },

    renderWorlds: function() {
        const recommendations = game.getRecommendations();
        const progress = game.getAllProgress();

        this.renderShell('worlds', `
            <section class="hero-banner hero-banner-worlds slide-up">
                <div>
                    <span class="hero-chip">World Map</span>
                    <h1>Choose your next math adventure</h1>
                    <p>Every world focuses on one major topic from the Grade 6-8 syllabus. Clear each level to rescue that land from its villain.</p>
                </div>
                <div class="hero-banner-art">
                    <div class="hero-avatar-orb">🗺️</div>
                    <div class="hero-sidekick">🧙‍♂️</div>
                </div>
            </section>

            <section class="story-card map-board-card">
                <div class="section-tag">Adventure Map</div>
                <h2>Track the path, open treasure, and face each world boss</h2>
                    <p>Every third level unlocks a treasure chest, and the final level is the boss gate. Earn stars for speed and accuracy.</p>
            </section>

            <section class="world-adventure-grid">
                ${gameData.worlds.map((world) => {
                    const worldProgress = progress.worlds.find(item => item.worldId === world.id);
                    const completion = worldProgress ? Math.round((worldProgress.completedLevels / worldProgress.totalLevels) * 100) : 0;
                    const recommended = recommendations[0] === world.id;
                    const character = getCharacterForWorld(world.id);
                    const totalStars = worldProgress && worldProgress.levels
                        ? worldProgress.levels.reduce((sum, level) => sum + (level.stars || 0), 0)
                        : 0;
                    const unlockedTreasures = worldProgress ? Math.floor(worldProgress.completedLevels / 3) : 0;
                    return `
                        <article class="world-adventure-card world-theme-${world.id} scale-in">
                            <div class="world-adventure-top">
                                <span class="world-emoji-large">${world.emoji}</span>
                                ${recommended ? '<span class="badge badge-gold">Recommended</span>' : '<span class="badge badge-info">Adventure World</span>'}
                            </div>
                            <h2>${world.name}</h2>
                            <p>${world.story}</p>
                            <div class="badge-row">
                                ${world.grades.map((grade) => `<span class="badge badge-info">${grade}</span>`).join('')}
                                ${world.chapterFocus.map((chapter) => `<span class="badge badge-primary">${chapter}</span>`).join('')}
                            </div>
                            <p><strong>Syllabus focus:</strong> ${world.description}</p>
                            <p><strong>Learning path:</strong> ${world.learningArc}</p>
                            <div class="character-mini-card">
                                <div class="character-mini-emoji">${character.emoji}</div>
                                <div>
                                    <strong>${character.name}</strong>
                                    <p>${getCharacterDialog(Object.keys(characters).find(key => characters[key] === character), 'challenge')}</p>
                                </div>
                            </div>
                            <div class="world-meter">
                                <div class="world-meter-head">
                                    <span>Completion</span>
                                    <strong>${completion}%</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar primary" style="width:${completion}%"></div>
                                </div>
                                <small>${worldProgress ? worldProgress.completedLevels : 0}/${worldProgress ? worldProgress.totalLevels : 0} levels solved</small>
                            </div>
                            <div class="world-reward-strip">
                                <span>⭐ ${totalStars} stars</span>
                                <span>🎁 ${unlockedTreasures} treasures</span>
                                <span>👹 boss at final level</span>
                            </div>
                            ${this.renderWorldJourneyPath(world, worldProgress || { levels: [] })}
                            <button class="btn btn-primary btn-block" onclick="app.selectWorld('${world.id}')">Enter ${world.name}</button>
                        </article>
                    `;
                }).join('')}
            </section>
        `);
    },

    renderDiagnosticTest: function() {
        const questions = game.getDiagnosticQuestions();

        this.renderShell('worlds', `
            <section class="hero-banner hero-banner-diagnostic slide-up">
                <div>
                    <span class="hero-chip">Diagnostic Quest</span>
                    <h1>The Math Wizard needs your honest answers</h1>
                    <p>This 10-question test samples real Federal Board chapter skills from integers, fractions and decimals, algebra, and geometry. It helps the app recommend the best learning path for you.</p>
                </div>
                <div class="hero-banner-art">
                    <div class="hero-avatar-orb">🧙‍♂️</div>
                    <div class="hero-sidekick">📜</div>
                </div>
            </section>

            <section class="story-card">
                <div class="character-mini-card">
                    <div class="character-mini-emoji">🧙‍♂️</div>
                    <div>
                        <strong>Math Wizard</strong>
                            <p>Answer every question yourself. The kingdom studies your chapter strengths and weak areas to build a personalized training map.</p>
                    </div>
                </div>
            </section>

            <section class="diagnostic-grid">
                ${questions.map((question, index) => `
                    <article class="diagnostic-card">
                        <div class="diagnostic-card-head">
                            <span class="badge badge-info">Q${index + 1}</span>
                            <span class="badge badge-primary">${this.topicLabel(question.topic)}</span>
                            <span class="badge badge-warning">${question.difficulty}</span>
                        </div>
                        <h3>${question.question}</h3>
                        <div class="diagnostic-options">
                            ${question.options.map((option) => `
                                <label class="option-tile">
                                    <input type="radio" name="q${question.id}" value="${this.escapeHtml(option.text)}">
                                    <span>${option.text}</span>
                                </label>
                            `).join('')}
                        </div>
                    </article>
                `).join('')}
            </section>

            <section class="action-bar-center">
                <button id="submitDiagnostic" class="btn btn-primary">Submit Diagnostic Test</button>
                <button class="btn btn-secondary" onclick="app.showPage('dashboard')">Back to Dashboard</button>
            </section>
        `);

        document.getElementById('submitDiagnostic').addEventListener('click', () => {
            app.submitDiagnosticTest();
        });
    },

    renderDiagnosticResults: function() {
        const currentUser = storage.getCurrentUser();
        const diagnosticResults = app.appState.lastDiagnosticResults || storage.getDiagnosticResults(currentUser.userId);
        const recommendedWorlds = game.getRecommendedWorldCards();

        if (!diagnosticResults) {
            app.showPage('diagnostic');
            return;
        }

        this.renderShell('worlds', `
            <section class="hero-banner hero-banner-results slide-up">
                <div>
                    <span class="hero-chip">Diagnostic Analysis</span>
                    <h1>Your royal learning report is ready</h1>
                    <p>You scored <strong>${diagnosticResults.score}/${diagnosticResults.totalQuestions}</strong> with <strong>${diagnosticResults.percentage}%</strong> accuracy. Now the kingdom knows where to train you first.</p>
                </div>
                <div class="hero-banner-art">
                    <div class="hero-avatar-orb">📊</div>
                    <div class="hero-sidekick">🏆</div>
                </div>
            </section>

            <section class="stats-grid">
                <article class="stat-adventure-card">
                    <span>Result</span>
                    <strong>${diagnosticResults.percentage}%</strong>
                    <small>Overall diagnostic performance</small>
                </article>
                <article class="stat-adventure-card">
                    <span>Weak Topics</span>
                    <strong>${diagnosticResults.weakTopics.length}</strong>
                    <small>Need more guided practice</small>
                </article>
                <article class="stat-adventure-card">
                    <span>Strong Topics</span>
                    <strong>${diagnosticResults.strongTopics.length}</strong>
                    <small>Concepts you already handle well</small>
                </article>
                <article class="stat-adventure-card">
                    <span>Recommended Worlds</span>
                    <strong>${recommendedWorlds.length}</strong>
                    <small>Ordered by improvement priority</small>
                </article>
            </section>

            <section class="content-grid-two">
                <article class="story-card">
                    <div class="section-tag">Weak Areas</div>
                    <h2>Topics to strengthen first</h2>
                    <div class="badge-row">${this.renderTopicBadges(diagnosticResults.weakTopics, 'badge-danger', 'No weak topics right now')}</div>
                    <div class="topic-meter-list mt-md">
                        ${Object.entries(diagnosticResults.topicScores).map(([topic, score]) => `
                            <div class="topic-meter">
                                <div class="topic-meter-head">
                                    <span>${this.topicLabel(topic)}</span>
                                    <strong>${score}%</strong>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar ${score >= 80 ? 'primary' : score >= 60 ? 'warning' : 'danger'}" style="width:${score}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </article>
                <article class="story-card">
                    <div class="section-tag">Strong Areas</div>
                    <h2>Skills you can build on</h2>
                    <div class="badge-row">${this.renderTopicBadges(diagnosticResults.strongTopics, 'badge-success', 'No strong topics yet')}</div>
                    <div class="character-mini-card mt-md">
                        <div class="character-mini-emoji">🧙‍♂️</div>
                        <div>
                            <strong>Math Wizard Advice</strong>
                            <p>Start with your weakest topic first, then move toward the worlds where you already feel more confident. This helps reduce math anxiety and creates visible improvement.</p>
                        </div>
                    </div>
                </article>
            </section>

            <section class="story-card">
                <div class="section-tag">Personalized Learning Path</div>
                <h2>Recommended world order</h2>
                <div class="recommendation-list">
                    ${recommendedWorlds.map((world, index) => `
                        <button class="recommendation-card world-theme-${world.id}" onclick="app.selectWorld('${world.id}')">
                            <div>
                                <span class="recommendation-rank">${index + 1}</span>
                                <strong>${world.emoji} ${world.name}</strong>
                            </div>
                            <small>${world.description}</small>
                        </button>
                    `).join('')}
                </div>
                <div class="action-bar-center mt-md">
                    <button class="btn btn-primary" onclick="app.selectWorld('${recommendedWorlds[0] ? recommendedWorlds[0].id : 'integers'}')">Start Recommended Practice</button>
                    <button class="btn btn-secondary" onclick="app.restartDiagnostic()">Retake Diagnostic</button>
                </div>
            </section>
        `);
    },

    renderGameQuestion: function(worldId) {
        const world = gameData.worlds.find(item => item.id === worldId);
        const progress = game.getWorldProgress(worldId);
        const question = game.getNextQuestion(worldId);
        const character = getCharacterForWorld(worldId);
        const completedLevels = progress ? progress.completedLevels : 0;
        const totalLevels = progress ? progress.totalLevels : game.getWorldQuestions(worldId).length;
        const percentage = totalLevels ? Math.round((completedLevels / totalLevels) * 100) : 0;
        const totalStars = progress && progress.levels ? progress.levels.reduce((sum, level) => sum + (level.stars || 0), 0) : 0;

        if (!question) {
            this.renderWorldComplete(worldId);
            return;
        }

        game.startQuestion(worldId, question.id);

        this.renderShell('worlds', `
            <section class="game-stage game-stage-focus world-theme-${worldId} slide-up">
                <div class="focus-play-header">
                    <div>
                        <span class="hero-chip">${world.emoji} ${world.name}</span>
                        <h1>Level ${completedLevels + 1} of ${totalLevels}</h1>
                    </div>
                    <div class="focus-play-stats">
                        <span>Progress ${percentage}%</span>
                        <span>${utils.capitalize(question.difficulty)}</span>
                        <span>⭐ ${totalStars}</span>
                    </div>
                </div>

                <article class="focus-story-card">
                    <div class="focus-story-head">
                        <div class="character-mini-emoji">🧙‍♂️</div>
                        <div>
                            <strong>Mission Brief</strong>
                            <p>${question.story || 'Solve this level to continue the quest.'}</p>
                        </div>
                    </div>
                    <div class="focus-story-tags">
                        <span>🎯 ${question.chapter}</span>
                        <span>📘 ${question.learningGoal}</span>
                        <span>⚡ Fast answer = 3 stars</span>
                    </div>
                </article>

                <article class="question-focus-card">
                    <h2>${question.question}</h2>
                    <div class="question-sidekick-line">
                        <span>${character.emoji}</span>
                        <p>${getCharacterDialog(Object.keys(characters).find(key => characters[key] === character), 'challenge')}</p>
                    </div>
                    <div class="answer-grid answer-grid-focus" id="answersContainer">
                        ${question.options.map((option, index) => `
                            <button class="answer-button answer-button-focus" data-option-index="${index}">
                                <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                                <span>${option.text}</span>
                            </button>
                        `).join('')}
                    </div>
                </article>

                <div class="action-bar-center focus-actions">
                    <button class="btn btn-secondary" onclick="app.showPage('worlds')">Back to Map</button>
                </div>
            </section>
        `, { compact: true, showNav: false, showAudio: false });

        document.querySelectorAll('.answer-button').forEach(button => {
            button.addEventListener('click', () => {
                const optionIndex = Number(button.dataset.optionIndex);
                app.handleGameAnswer(worldId, question.id, question.options[optionIndex].text, button);
            });
        });
    },

    renderQuestionResult: function(worldId, result) {
        const world = gameData.worlds.find(item => item.id === worldId);
        const character = getCharacterForWorld(worldId);
        const characterKey = Object.keys(characters).find(key => characters[key] === character);
        const nextButtonLabel = result.correct
            ? (result.worldCompleted ? 'Celebrate World Victory' : 'Next Level')
            : 'Try This Level Again';

        this.renderShell('worlds', `
            <section class="result-stage result-stage-focus ${result.correct ? 'success' : 'danger'} slide-up">
                <div class="result-stage-hero">
                    <div class="result-icon">${result.correct ? '🎉' : '🛡️'}</div>
                    <div>
                        <span class="hero-chip">${world.emoji} ${world.name}</span>
                        <h1>${result.correct ? 'You won this level!' : 'Keep training, hero!'}</h1>
                        <p>${result.correct ? getCharacterDialog(characterKey, 'correct') : getCharacterDialog('mathWizard', 'incorrect')}</p>
                    </div>
                </div>

                <article class="story-scroll-card">
                    <div class="section-tag">Battle Feedback</div>
                    <h2>${result.correct ? 'Explanation and Rewards' : 'Explanation and Retry Hint'}</h2>
                    <p><strong>Chapter focus:</strong> ${result.question.chapter}</p>
                    <p>${result.explanation}</p>
                    ${result.correct ? `
                        <div class="result-metrics-row">
                            <div class="result-metric-tile">
                                <span>XP Earned</span>
                                <strong>+${result.points}</strong>
                            </div>
                            <div class="result-metric-tile">
                                <span>Time Taken</span>
                                <strong>${utils.formatTime(result.timeSpent)}</strong>
                            </div>
                            <div class="result-metric-tile">
                                <span>Status</span>
                                <strong>Level Cleared</strong>
                            </div>
                            <div class="result-metric-tile">
                                <span>Stars Earned</span>
                                <strong>${result.starsEarned || 0}</strong>
                            </div>
                        </div>
                    ` : `
                        <div class="result-metrics-row">
                            <div class="result-metric-tile">
                                <span>Correct Answer</span>
                                <strong>${result.correctAnswer}</strong>
                            </div>
                            <div class="result-metric-tile">
                                <span>XP</span>
                                <strong>0</strong>
                            </div>
                            <div class="result-metric-tile">
                                <span>Next Move</span>
                                <strong>Try Again</strong>
                            </div>
                        </div>
                    `}
                    ${result.correct ? `
                        <div class="reward-celebration-strip">
                            <div class="reward-pill">${this.renderStarsInline(result.starsEarned || 0)}</div>
                            <div class="reward-pill">${result.treasureUnlocked ? '🎁 Treasure unlocked!' : '🧭 Keep going to find the next treasure'}</div>
                        </div>
                    ` : ''}
                    ${result.achievements && result.achievements.length ? `
                        <div class="achievement-unlock-strip">
                            ${result.achievements.map(achievement => `
                                <div class="achievement-unlock-pill">
                                    <span>${achievement.icon}</span>
                                    <strong>${achievement.name}</strong>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </article>

                <div class="action-bar-center">
                    <button class="btn btn-primary" onclick="app.continueWorld('${worldId}')">${nextButtonLabel}</button>
                    <button class="btn btn-secondary" onclick="app.showPage('worlds')">Return to World Map</button>
                </div>
            </section>
        `, { compact: true, showNav: false, showAudio: false });
    },

    renderProgress: function() {
        const user = storage.getCurrentUser();
        const stats = storage.getStats(user.userId);
        const progress = game.getAllProgress();
        const achievements = game.getAchievements();
        const diagnosticResults = storage.getDiagnosticResults(user.userId);
        const topicData = diagnosticResults ? diagnosticResults.topicScores : stats.topicsProgress;
        const totalStars = progress.worlds.reduce((sum, world) => sum + ((world.levels || []).reduce((starSum, level) => starSum + (level.stars || 0), 0)), 0);
        const totalTreasures = progress.worlds.reduce((sum, world) => sum + Math.floor((world.completedLevels || 0) / 3), 0);

        this.renderShell('progress', `
            <section class="hero-banner hero-banner-progress slide-up">
                <div>
                    <span class="hero-chip">Progress Dashboard</span>
                    <h1>Track your growth across the kingdom</h1>
                    <p>See your XP, mastery by topic, completed levels, and achievements. This is the visual proof that learning is happening.</p>
                </div>
                <div class="hero-banner-art">
                    <div class="hero-avatar-orb">📈</div>
                    <div class="hero-sidekick">🏆</div>
                </div>
            </section>

            <section class="stats-grid">
                <article class="stat-adventure-card">
                    <span>Total Questions</span>
                    <strong>${stats.totalQuestionsAnswered || 0}</strong>
                    <small>All attempts across worlds</small>
                </article>
                <article class="stat-adventure-card">
                    <span>Correct Answers</span>
                    <strong>${stats.correctAnswers || 0}</strong>
                    <small>Levels solved correctly</small>
                </article>
                <article class="stat-adventure-card">
                    <span>Best Streak</span>
                    <strong>${stats.longestStreak || 0}</strong>
                    <small>Your strongest run</small>
                </article>
                <article class="stat-adventure-card">
                    <span>Fast Answers</span>
                    <strong>${stats.speedCount || 0}</strong>
                    <small>Answered correctly with speed bonus</small>
                </article>
                <article class="stat-adventure-card">
                    <span>Total Stars</span>
                    <strong>${totalStars}</strong>
                    <small>Collected from level performance</small>
                </article>
                <article class="stat-adventure-card">
                    <span>Treasures</span>
                    <strong>${totalTreasures}</strong>
                    <small>Opened from checkpoint milestones</small>
                </article>
            </section>

            <section class="content-grid-two">
                <article class="story-card">
                    <div class="section-tag">Topic Mastery</div>
                    <h2>How each topic is going</h2>
                    <div class="topic-meter-list">
                        ${Object.keys(topicData || {}).length ? Object.entries(topicData).map(([topic, value]) => {
                            const score = typeof value === 'number' ? value : value.accuracy || 0;
                            return `
                                <div class="topic-meter">
                                    <div class="topic-meter-head">
                                        <span>${this.topicLabel(topic)}</span>
                                        <strong>${score}%</strong>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar ${score >= 80 ? 'primary' : score >= 60 ? 'warning' : 'danger'}" style="width:${score}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('') : '<p>No topic mastery data yet. Complete the diagnostic test and play a few worlds.</p>'}
                    </div>
                </article>
                <article class="story-card">
                    <div class="section-tag">Achievement Shelf</div>
                    <h2>Unlocked badges</h2>
                    ${this.renderAchievementsPreview(achievements.unlocked)}
                </article>
            </section>

            <section class="story-card">
                <div class="section-tag">World Completion</div>
                <h2>Progress by world</h2>
                <div class="world-progress-list">
                    ${progress.worlds.map(worldProgress => {
                        const world = gameData.worlds.find(item => item.id === worldProgress.worldId);
                        const completion = Math.round((worldProgress.completedLevels / worldProgress.totalLevels) * 100) || 0;
                        const worldStars = (worldProgress.levels || []).reduce((sum, level) => sum + (level.stars || 0), 0);
                        return `
                            <button class="world-progress-card" onclick="app.selectWorld('${world.id}')">
                                <div class="world-progress-card-top">
                                    <strong>${world.emoji} ${world.name}</strong>
                                    <span>${completion}%</span>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar primary" style="width:${completion}%"></div>
                                </div>
                                <small>${worldProgress.completedLevels}/${worldProgress.totalLevels} levels, ${worldProgress.points || 0} XP, ${worldStars} stars</small>
                            </button>
                        `;
                    }).join('')}
                </div>
            </section>
        `);
    },

    renderProfile: function() {
        const user = storage.getCurrentUser();
        const stats = storage.getStats(user.userId);

        this.renderShell('profile', `
            <section class="hero-banner hero-banner-profile slide-up">
                <div>
                    <span class="hero-chip">Hero Profile</span>
                    <h1>Manage your learner profile</h1>
                    <p>Update your details, favorite world, and saved journey data.</p>
                </div>
                <div class="hero-banner-art">
                    <div class="hero-avatar-orb">👤</div>
                    <div class="hero-sidekick">💾</div>
                </div>
            </section>

            <section class="content-grid-two">
                <article class="story-card">
                    <div class="section-tag">Edit Details</div>
                    <h2>Profile Form</h2>
                    <form id="profileForm">
                        <div class="form-group">
                            <label for="profileName">Full Name</label>
                            <input type="text" id="profileName" class="form-control" value="${this.escapeHtml(user.name)}" required>
                        </div>
                        <div class="form-group">
                            <label for="profileClass">Class / Grade</label>
                            <select id="profileClass" class="form-control">
                                <option value="6" ${user.class === '6' ? 'selected' : ''}>Grade 6</option>
                                <option value="7" ${user.class === '7' ? 'selected' : ''}>Grade 7</option>
                                <option value="8" ${user.class === '8' ? 'selected' : ''}>Grade 8</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="profilePreferredWorld">Favorite World</label>
                            <select id="profilePreferredWorld" class="form-control">
                                ${gameData.worlds.map(world => `
                                    <option value="${world.id}" ${user.preferredWorld === world.id ? 'selected' : ''}>${world.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Profile</button>
                    </form>
                </article>

                <article class="story-card">
                    <div class="section-tag">Saved Data</div>
                    <h2>Current profile summary</h2>
                    <div class="profile-summary-list">
                        <div class="profile-summary-item"><span>Name</span><strong>${this.escapeHtml(user.name)}</strong></div>
                        <div class="profile-summary-item"><span>Email</span><strong>${this.escapeHtml(user.email)}</strong></div>
                        <div class="profile-summary-item"><span>Grade</span><strong>${this.escapeHtml(user.class)}</strong></div>
                        <div class="profile-summary-item"><span>Hero Title</span><strong>${this.escapeHtml(user.title || 'Rookie Hero')}</strong></div>
                        <div class="profile-summary-item"><span>Total XP</span><strong>${user.totalPoints || 0}</strong></div>
                        <div class="profile-summary-item"><span>Questions Answered</span><strong>${stats.totalQuestionsAnswered || 0}</strong></div>
                    </div>
                </article>
            </section>

            <section class="danger-zone-card">
                <div>
                    <div class="section-tag">Data Controls</div>
                    <h2>Reset or remove saved data</h2>
                    <p>Use these buttons carefully. They affect your saved account data and learning progress.</p>
                </div>
                <div class="quest-actions">
                    <button class="btn btn-secondary" onclick="app.resetMyProgress()">Reset My Progress</button>
                    <button class="btn btn-danger" onclick="app.deleteMyAccount()">Delete Local Account</button>
                </div>
            </section>
        `);

        document.getElementById('profileForm').addEventListener('submit', (event) => {
            event.preventDefault();
            app.saveProfile();
        });
    },

    renderWorldComplete: function(worldId) {
        const world = gameData.worlds.find(item => item.id === worldId);
        const progress = game.getWorldProgress(worldId);
        const character = getCharacterForWorld(worldId);
        const totalStars = progress && progress.levels ? progress.levels.reduce((sum, level) => sum + (level.stars || 0), 0) : 0;
        const unlockedTreasures = progress ? Math.floor(progress.completedLevels / 3) : 0;

        this.renderShell('worlds', `
            <section class="result-stage success slide-up">
                <div class="result-stage-hero">
                    <div class="result-icon">🏆</div>
                    <div>
                        <span class="hero-chip">World Complete</span>
                        <h1>You completed ${world.name}!</h1>
                        <p>${getCharacterDialog('mathWizard', 'complete')}</p>
                    </div>
                </div>

                <div class="dialogue-grid">
                    <article class="dialogue-card mentor">
                        <div class="dialogue-emoji">🧙‍♂️</div>
                        <div>
                            <strong>Math Wizard</strong>
                            <p>Great job, hero! You defeated the villain and restored balance to this world.</p>
                        </div>
                    </article>
                    <article class="dialogue-card villain">
                        <div class="dialogue-emoji">${character.emoji}</div>
                        <div>
                            <strong>${character.name}</strong>
                            <p>You have mastered this realm. I will challenge you again in another world.</p>
                        </div>
                    </article>
                </div>

                <article class="story-scroll-card">
                    <div class="section-tag">Victory Summary</div>
                    <h2>World progress saved</h2>
                    <div class="result-metrics-row">
                        <div class="result-metric-tile">
                            <span>Levels Cleared</span>
                            <strong>${progress ? progress.completedLevels : 0}</strong>
                        </div>
                        <div class="result-metric-tile">
                            <span>Total Levels</span>
                            <strong>${progress ? progress.totalLevels : 0}</strong>
                        </div>
                        <div class="result-metric-tile">
                            <span>XP in World</span>
                            <strong>${progress ? progress.points : 0}</strong>
                        </div>
                        <div class="result-metric-tile">
                            <span>Stars Collected</span>
                            <strong>${totalStars}</strong>
                        </div>
                        <div class="result-metric-tile">
                            <span>Treasures Opened</span>
                            <strong>${unlockedTreasures}</strong>
                        </div>
                    </div>
                </article>

                <div class="action-bar-center">
                    <button class="btn btn-primary" onclick="app.showPage('worlds')">Choose Another World</button>
                    <button class="btn btn-secondary" onclick="app.showPage('dashboard')">Back to Dashboard</button>
                </div>
            </section>
        `);
    }
};

console.log('✅ UI rendering module loaded!');
