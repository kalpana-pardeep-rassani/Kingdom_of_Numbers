/**
 * =========================================
 * KINGDOM OF NUMBERS - AUTHENTICATION
 * Login, signup, session management
 * ========================================= */

const auth = {
    isNetworkError: function(error) {
        return Boolean(error && (error.isNetworkError || error.status === 0));
    },

    loginLocal: function(email, password, callback, options = {}) {
        if (typeof storage === 'undefined') {
            callback({ success: false, error: 'Storage module not ready' });
            return;
        }

        if (!email || !password) {
            callback({ success: false, error: 'Email and password are required' });
            return;
        }

        const user = storage.getUserByEmail(email);
        if (!user) {
            callback({ success: false, error: 'User not found. Please sign up first.' });
            return;
        }

        if (!storage.verifyPassword(password, user.password)) {
            callback({ success: false, error: 'Incorrect password' });
            return;
        }

        storage.setCurrentUser(user, options.rememberMe !== false);
        storage.updateUser(user.userId, {
            lastLoginDate: new Date().toISOString()
        });

        callback({ success: true, user: user, mode: 'local' });
    },

    // --- NEW CODE START ---
    forgotPasswordLocal: function(email, newPassword, callback) {
        if (typeof storage === 'undefined' || typeof utils === 'undefined') {
            callback({ success: false, error: 'Modules not ready. Please try again.' });
            return;
        }

        const normalizedEmail = String(email || '').trim().toLowerCase();
        const user = storage.getUserByEmail(normalizedEmail);
        if (!user) {
            callback({ success: false, error: 'No account found for that email.' });
            return;
        }

        if (!utils.validatePassword(newPassword)) {
            callback({ success: false, error: 'Password must be at least 6 characters' });
            return;
        }

        storage.updateUser(user.userId, {
            password: storage.hashPassword(newPassword)
        });

        callback({ success: true, mode: 'local' });
    },
    // --- NEW CODE END ---

    signupLocal: function(formData, callback) {
        if (typeof storage === 'undefined' || typeof utils === 'undefined') {
            callback({ success: false, error: 'Modules not ready. Please try again.' });
            return;
        }

        const errors = {};

        if (!formData.name || formData.name.trim() === '') {
            errors.name = 'Name is required';
        }

        if (!utils.validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!utils.validatePassword(formData.password)) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.class) {
            errors.class = 'Please select your class';
        }

        if (Object.keys(errors).length > 0) {
            callback({ success: false, errors: errors });
            return;
        }

        if (storage.getUserByEmail(formData.email)) {
            callback({ success: false, error: 'Email already registered. Please login instead.' });
            return;
        }

        try {
            const newUser = storage.createUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                class: formData.class,
                preferredWorld: formData.preferredWorld
            });

            storage.initializeProgress(newUser.userId);
            storage.initializeStats(newUser.userId);
            storage.setCurrentUser(newUser);

            callback({ success: true, user: newUser, mode: 'local' });
        } catch (error) {
            callback({ success: false, error: 'An error occurred during signup' });
        }
    },

    /**
     * Handle user login
     */
    login: function(email, password, callback, options = {}) {
        if (typeof apiClient !== 'undefined' && apiClient.isConfigured()) {
            apiClient.login({ email, password })
                .then((result) => {
                    apiClient.setToken(result.accessToken, options.rememberMe !== false);
                    storage.hydrateFromServerSnapshot(result.snapshot, options.rememberMe !== false);
                    callback({ success: true, user: result.snapshot.user });
                })
                .catch((error) => {
                    if (this.isNetworkError(error)) {
                        this.loginLocal(email, password, callback, options);
                        return;
                    }

                    callback({ success: false, error: error.message || 'Login failed' });
                });
            return;
        }

        this.loginLocal(email, password, callback, options);
    },
    
    /**
     * Handle user signup
     */
    signup: function(formData, callback) {
        if (typeof apiClient !== 'undefined' && apiClient.isConfigured()) {
            apiClient.signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                grade: formData.class,
                preferredWorld: formData.preferredWorld || 'integers'
            }).then((result) => {
                apiClient.setToken(result.accessToken);
                storage.hydrateFromServerSnapshot(result.snapshot);
                callback({ success: true, user: result.snapshot.user });
            }).catch((error) => {
                if (this.isNetworkError(error)) {
                    this.signupLocal(formData, callback);
                    return;
                }

                callback({ success: false, error: error.message || 'Signup failed' });
            });
            return;
        }

        this.signupLocal(formData, callback);
    },
    
    /**
     * Handle user logout
     */
    logout: function() {
        const currentUser = storage.getCurrentUser();
        if (currentUser) {
            if (typeof apiClient !== 'undefined' && storage.hasApiSession()) {
                apiClient.logout().catch(() => null);
            }
            storage.logout();
            return true;
        }
        return false;
    },
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated: function() {
        return typeof storage !== 'undefined' && storage.isLoggedIn();
    },
    
    /**
     * Get current authenticated user
     */
    getCurrentUser: function() {
        return typeof storage !== 'undefined' ? storage.getCurrentUser() : null;
    },

    // --- NEW CODE START ---
    forgotPassword: function(email, newPassword, callback) {
        if (typeof apiClient !== 'undefined' && apiClient.isConfigured()) {
            apiClient.forgotPassword({ email, newPassword })
                .then(() => {
                    callback({ success: true, mode: 'api' });
                })
                .catch((error) => {
                    if (this.isNetworkError(error)) {
                        this.forgotPasswordLocal(email, newPassword, callback);
                        return;
                    }

                    callback({ success: false, error: error.message || 'Password reset failed' });
                });
            return;
        }

        this.forgotPasswordLocal(email, newPassword, callback);
    },
    // --- NEW CODE END ---

    restoreSession: function(callback) {
        if (typeof apiClient === 'undefined' || !storage.hasApiSession()) {
            callback({ success: storage.isLoggedIn(), user: storage.getCurrentUser() });
            return;
        }

        apiClient.me()
            .then((snapshot) => {
                storage.hydrateFromServerSnapshot(snapshot);
                callback({ success: true, user: snapshot.user });
            })
            .catch((error) => {
                if (this.isNetworkError(error) && storage.isLoggedIn()) {
                    callback({ success: true, user: storage.getCurrentUser(), mode: 'local' });
                    return;
                }

                storage.logout();
                callback({ success: false, error: error.message || 'Session expired' });
            });
    },
    
    /**
     * Update user profile
     */
    updateProfile: function(userId, updates, callback) {
        if (typeof apiClient !== 'undefined' && storage.hasApiSession()) {
            apiClient.updateMe({
                name: updates.name,
                grade: updates.class,
                preferredWorld: updates.preferredWorld
            }).then((result) => {
                storage.hydrateFromServerSnapshot(result.snapshot);
                callback({ success: true, user: result.snapshot.user });
            }).catch((error) => {
                callback({ success: false, error: error.message || 'Error updating profile' });
            });
            return;
        }

        try {
            const user = storage.updateUser(userId, updates);
            if (user) {
                storage.setCurrentUser(user);
                callback({ success: true, user: user });
            } else {
                callback({ success: false, error: 'User not found' });
            }
        } catch (error) {
            callback({ success: false, error: 'Error updating profile' });
        }
    }
};

console.log('✅ Authentication module loaded!');
