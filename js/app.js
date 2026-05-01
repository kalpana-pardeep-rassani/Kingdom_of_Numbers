/**
 * =========================================
 * KINGDOM OF NUMBERS - APP CONTROLLER
 * Main application logic and routing
 * ========================================= */

const app = {
    hasInitialized: false,
    // Application state
    appState: {
        currentUser: null,
        currentPage: 'login',
        currentWorld: null,
        currentQuestion: null,
        diagnosticAnswers: {},
        gameAnswers: {},
        isDiagnosticTest: false,
        lastDiagnosticResults: null,
        theme: 'light'
    },

    getInitialPage: function() {
        const params = new URLSearchParams(window.location.search);
        const requestedView = params.get('view');
        if (requestedView === 'admin') {
            return 'admin-login';
        }

        return 'login';
    },

    getHomePageForUser: function(user) {
        return user && user.role === 'admin' ? 'admin-dashboard' : 'dashboard';
    },
    
    /**
     * Initialize the application
     */
    init: function() {
        if (this.hasInitialized) {
            return;
        }
        this.hasInitialized = true;

        this.appState.theme = storage.getTheme();
        this.applyTheme(this.appState.theme);

        console.log('🎮 Kingdom of Numbers initialized!');

        const initialPage = this.getInitialPage();

        if (typeof audioManager !== 'undefined') {
            audioManager.init();
        }
        
        // Check if user is logged in
        if (auth.isAuthenticated()) {
            auth.restoreSession((result) => {
                if (result.success) {
                    this.appState.currentUser = result.user;
                    this.showPage(this.getHomePageForUser(result.user));
                } else {
                    this.showPage(initialPage);
                }
            });
        } else {
            this.showPage(initialPage);
        }
        
        // Setup global event listeners
        this.setupEventListeners();
    },

    applyTheme: function(theme) {
        const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
        this.appState.theme = resolvedTheme;
        document.body.setAttribute('data-theme', resolvedTheme);
        storage.setTheme(resolvedTheme);
    },

    toggleTheme: function() {
        const nextTheme = this.appState.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
        this.showPage(this.appState.currentPage || 'login');
    },
    
    /**
     * Setup global event listeners
     */
    setupEventListeners: function() {
        // Window resize for responsive design
        window.addEventListener('resize', () => {
            // Could add responsive logic here
        });
        
        // Handle back button
        window.addEventListener('popstate', () => {
            const lastPage = sessionStorage.getItem('lastPage') || 'dashboard';
            this.showPage(lastPage);
        });
    },
    
    /**
     * Navigate to a page
     */
    showPage: function(pageName) {
        // Save current page
        sessionStorage.setItem('lastPage', this.appState.currentPage);
        this.appState.currentPage = pageName;
        
        // Render page based on name
        switch(pageName) {
            case 'login':
                ui.renderLoginPage();
                break;
            case 'signup':
                ui.renderSignupPage();
                break;
            case 'admin-login':
                adminDashboard.renderLogin();
                break;
            case 'admin-dashboard':
                if (!auth.isAuthenticated()) {
                    this.showPage('admin-login');
                    return;
                }
                if (auth.getCurrentUser().role !== 'admin') {
                    utils.showNotification('Admin access required.', 'error');
                    this.showPage('dashboard');
                    return;
                }
                adminDashboard.loadDashboard().catch((error) => {
                    utils.showNotification(error.message || 'Unable to load admin dashboard.', 'error');
                    this.showPage('admin-login');
                });
                break;
            case 'dashboard':
                if (!auth.isAuthenticated()) {
                    this.showPage('login');
                    return;
                }
                if (auth.getCurrentUser().role === 'admin') {
                    this.showPage('admin-dashboard');
                    return;
                }
                ui.renderDashboard();
                break;
            case 'diagnostic-or-worlds':
                if (!auth.isAuthenticated()) {
                    this.showPage('login');
                    return;
                }
                const hasCompletedDiagnostic = storage.hasDiagnosticTest(auth.getCurrentUser().userId);
                if (!hasCompletedDiagnostic) {
                    this.showPage('diagnostic');
                } else {
                    this.showPage('worlds');
                }
                break;
            case 'diagnostic':
                if (!auth.isAuthenticated()) {
                    this.showPage('login');
                    return;
                }
                ui.renderDiagnosticTest();
                break;
            case 'diagnostic-results':
                if (!auth.isAuthenticated()) {
                    this.showPage('login');
                    return;
                }
                ui.renderDiagnosticResults();
                break;
            case 'worlds':
                if (!auth.isAuthenticated()) {
                    this.showPage('login');
                    return;
                }
                ui.renderWorlds();
                break;
            case 'progress':
                if (!auth.isAuthenticated()) {
                    this.showPage('login');
                    return;
                }
                ui.renderProgress();
                break;
            case 'profile':
                if (!auth.isAuthenticated()) {
                    this.showPage('login');
                    return;
                }
                ui.renderProfile();
                break;
            default:
                this.showPage('login');
        }

        if (typeof audioManager !== 'undefined') {
            audioManager.setScene(pageName, this.appState.currentWorld);
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    },
    
    /**
     * Handle login form submission
     */
    clearFormErrors: function() {
        document.querySelectorAll('.form-error').forEach((element) => {
            element.textContent = '';
            element.classList.remove('show');
        });
    },

    setFormError: function(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (!errorElement) {
            return;
        }

        errorElement.textContent = message || '';
        errorElement.classList.toggle('show', Boolean(message));
    },

    handleLogin: function() {
        // Ensure modules are loaded
        if (typeof auth === 'undefined' || typeof storage === 'undefined' || typeof utils === 'undefined') {
            alert('Application not ready. Please refresh the page.');
            return;
        }
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        // --- NEW CODE START ---
        const rememberMeElement = document.getElementById('loginRememberMe');
        const rememberMe = rememberMeElement ? rememberMeElement.checked : true;
        // --- NEW CODE END ---
        
        // Clear previous errors
        this.clearFormErrors();
        ui.setAuthLoading(true, 'Summoning your hero profile...');
        
        auth.login(email, password, (result) => {
            ui.setAuthLoading(false);
            if (result.success) {
                this.appState.currentUser = result.user;
                utils.showNotification('✅ Login successful!', 'success');
                this.showPage(this.getHomePageForUser(result.user));
            } else {
                this.setFormError('loginError', result.error);
                utils.showNotification(result.error, 'error');
            }
        }, { rememberMe });
    },

    // --- NEW CODE START ---
    handleForgotPassword: function() {
        if (typeof auth === 'undefined' || typeof utils === 'undefined') {
            alert('Application not ready. Please refresh the page.');
            return;
        }

        const email = window.prompt('Enter your account email to reset your password:');
        if (email === null || email.trim() === '') {
            return;
        }

        if (!utils.validateEmail(email.trim())) {
            utils.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        const newPassword = window.prompt('Enter your new password:');
        if (newPassword === null || newPassword === '') {
            return;
        }

        if (!utils.validatePassword(newPassword)) {
            utils.showNotification('Password must be at least 6 characters.', 'error');
            return;
        }

        const confirmPassword = window.prompt('Confirm your new password:');
        if (confirmPassword === null) {
            return;
        }

        if (newPassword !== confirmPassword) {
            utils.showNotification('Passwords do not match.', 'error');
            return;
        }

        auth.forgotPassword(email.trim(), newPassword, (result) => {
            if (result.success) {
                utils.showNotification('Password reset successful. You can now log in.', 'success');
            } else {
                utils.showNotification(result.error || 'Password reset failed.', 'error');
            }
        });
    },
    // --- NEW CODE END ---
    
    /**
     * Handle signup form submission
     */
    handleSignup: function() {
        // Ensure modules are loaded
        if (typeof auth === 'undefined' || typeof storage === 'undefined' || typeof utils === 'undefined') {
            alert('Application not ready. Please refresh the page.');
            return;
        }
        
        const formData = {
            name: document.getElementById('signupName').value,
            class: document.getElementById('signupClass').value,
            email: document.getElementById('signupEmail').value,
            password: document.getElementById('signupPassword').value,
            confirmPassword: document.getElementById('signupConfirmPassword').value,
            preferredWorld: document.getElementById('signupPreferredWorld') ? document.getElementById('signupPreferredWorld').value : 'integers'
        };
        
        // Clear previous errors
        this.clearFormErrors();
        ui.setAuthLoading(true, 'Packing your satchel for adventure...');
        
        auth.signup(formData, (result) => {
            ui.setAuthLoading(false);
            if (result.success) {
                const authenticatedUser = auth.getCurrentUser() || result.user;
                this.appState.currentUser = authenticatedUser;
                utils.showNotification('✅ Account created successfully!', 'success');
                this.showPage(this.getHomePageForUser(authenticatedUser));
            } else {
                if (result.errors) {
                    Object.entries(result.errors).forEach(([field, message]) => {
                        const errorDiv = document.getElementById(`signup${utils.capitalize(field)}Error`);
                        if (errorDiv) {
                            this.setFormError(errorDiv.id, message);
                        }
                    });
                } else {
                    this.setFormError('signupError', result.error);
                }
                utils.showNotification(result.error || 'Signup failed', 'error');
            }
        });
    },
    
    /**
     * Handle game world selection
     */
    selectWorld: function(worldId) {
        this.appState.currentWorld = worldId;
        this.appState.gameAnswers = {};
        this.showGamePage(worldId);
    },
    
    /**
     * Show game page
     */
    showGamePage: function(worldId) {
        this.appState.currentWorld = worldId;
        ui.renderGameQuestion(worldId);

        if (typeof audioManager !== 'undefined') {
            audioManager.setScene('game', worldId);
        }
    },
    
    /**
     * Handle game answer submission
     */
    handleGameAnswer: function(worldId, questionId, answer, buttonElement) {
        // Disable all answer buttons
        document.querySelectorAll('.answer-button').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        });
        
        // Highlight selected button
        buttonElement.style.opacity = '1';

        const result = game.submitWorldAnswer(worldId, questionId, answer);
        if (!result.success) {
            utils.showNotification(result.error, 'error');
            return;
        }

        if (typeof audioManager !== 'undefined') {
            audioManager.playSfx(result.correct ? 'correct' : 'wrong');
            if (result.treasureUnlocked) {
                audioManager.playSfx('badge');
            }
            if (result.worldCompleted) {
                audioManager.playSfx('complete');
            }
        }

        ui.renderQuestionResult(worldId, result);
    },
    
    /**
     * Submit diagnostic test
     */
    submitDiagnosticTest: function() {
        const diagnosticQuestions = game.getDiagnosticQuestions();
        const answers = {};
        
        // Collect answers
        diagnosticQuestions.forEach(q => {
            const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
            if (selected) {
                answers[q.id] = selected.value;
            }
        });
        
        // Check if all questions answered
        if (Object.keys(answers).length !== diagnosticQuestions.length) {
            utils.showNotification('Please answer all questions', 'warning');
            return;
        }
        
        // Run diagnostic test
        game.runDiagnosticTest(answers, (result) => {
            if (result.success) {
                this.appState.lastDiagnosticResults = result.results;
                utils.showNotification('✅ Diagnostic test completed!', 'success');
                this.showPage('diagnostic-results');
            } else {
                utils.showNotification(result.error, 'error');
            }
        });
    },

    continueWorld: function(worldId) {
        const progress = game.getWorldProgress(worldId);
        if (progress && progress.completedLevels >= progress.totalLevels) {
            ui.renderWorldComplete(worldId);
            return;
        }
        this.showGamePage(worldId);
    },

    saveProfile: function() {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            this.showPage('login');
            return;
        }

        const updates = {
            name: document.getElementById('profileName').value.trim(),
            class: document.getElementById('profileClass').value,
            preferredWorld: document.getElementById('profilePreferredWorld').value
        };

        if (!updates.name) {
            utils.showNotification('Name is required.', 'warning');
            return;
        }

        auth.updateProfile(currentUser.userId, updates, (result) => {
            if (result.success) {
                this.appState.currentUser = result.user;
                utils.showNotification('Profile updated successfully.', 'success');
                this.showPage('profile');
            } else {
                utils.showNotification(result.error, 'error');
            }
        });
    },

    resetMyProgress: function() {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            return;
        }

        if (!confirm('Reset your progress, achievements, and diagnostic test?')) {
            return;
        }

        if (storage.hasApiSession()) {
            apiClient.resetMyProgress()
                .then((result) => {
                    storage.hydrateFromServerSnapshot(result.snapshot);
                    utils.showNotification('Your learning journey has been restarted.', 'info');
                    this.showPage('dashboard');
                })
                .catch((error) => utils.showNotification(error.message, 'error'));
            return;
        }

        storage.resetUserData(currentUser.userId);
        storage.initializeProgress(currentUser.userId);
        storage.initializeStats(currentUser.userId);
        storage.updateUser(currentUser.userId, {
            totalPoints: 0,
            title: 'Rookie Hero'
        });
        utils.showNotification('Your learning journey has been restarted.', 'info');
        this.showPage('dashboard');
    },

    deleteMyAccount: function() {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            return;
        }

        if (!confirm('Delete this local account and all saved game data?')) {
            return;
        }

        if (storage.hasApiSession()) {
            apiClient.deleteMyAccount()
                .then(() => {
                    storage.deleteUser(currentUser.userId);
                    this.appState.currentUser = null;
                    this.appState.lastDiagnosticResults = null;
                    utils.showNotification('Account deleted successfully.', 'info');
                    this.showPage('signup');
                })
                .catch((error) => utils.showNotification(error.message, 'error'));
            return;
        }

        storage.deleteUser(currentUser.userId);
        this.appState.currentUser = null;
        this.appState.lastDiagnosticResults = null;
        utils.showNotification('Account deleted from this browser.', 'info');
        this.showPage('signup');
    },

    restartDiagnostic: function() {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            return;
        }

        const allDiagnostics = storage.getAllDiagnostics();
        delete allDiagnostics[currentUser.userId];
        localStorage.setItem(storage.DIAGNOSTIC_KEY, JSON.stringify(allDiagnostics));
        this.appState.lastDiagnosticResults = null;
        this.showPage('diagnostic');
    },
    
    /**
     * Handle user logout
     */
    logout: function() {
        if (confirm('Are you sure you want to logout?')) {
            auth.logout();
            this.appState.currentUser = null;
            this.appState.gameAnswers = {};
            this.appState.diagnosticAnswers = {};
            this.appState.lastDiagnosticResults = null;
            utils.showNotification('👋 You have been logged out', 'info');
            this.showPage('login');
        }
    },
    
    /**
     * Reset all user data (for testing/development)
     */
    resetAllData: function() {
        if (confirm('⚠️ This will delete ALL your data and logout. Are you sure?')) {
            storage.resetAllData();
            auth.logout();
            this.appState.currentUser = null;
            utils.showNotification('All data has been reset', 'info');
            this.showPage('login');
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

console.log('✅ App controller loaded!');
