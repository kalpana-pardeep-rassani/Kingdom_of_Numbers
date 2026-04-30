const apiClient = {
    getBaseUrl: function() {
        const { protocol, hostname } = window.location;
        const resolvedProtocol = protocol === 'https:' ? 'https:' : 'http:';
        const resolvedHost = hostname || '127.0.0.1';
        return `${resolvedProtocol}//${resolvedHost}:3100/api/v1`;
    },

    getApiUrl: function(path) {
        return `${this.getBaseUrl()}${path}`;
    },

    tokenKey: 'kon_api_token',
    // --- NEW CODE START ---
    getPersistenceStore: function(persist) {
        return persist === false ? sessionStorage : localStorage;
    },
    // --- NEW CODE END ---

    getToken: function() {
        return sessionStorage.getItem(this.tokenKey) || localStorage.getItem(this.tokenKey);
    },

    setToken: function(token, persist = true) {
        if (token) {
            this.clearToken();
            this.getPersistenceStore(persist).setItem(this.tokenKey, token);
        }
    },

    clearToken: function() {
        sessionStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.tokenKey);
    },

    request: async function(path, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        const token = this.getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        let response;
        try {
            response = await fetch(this.getApiUrl(path), {
                ...options,
                headers
            });
        } catch (error) {
            const networkError = new Error('Backend server unavailable. Start the backend on port 3100 or use local student mode.');
            networkError.status = 0;
            networkError.isNetworkError = true;
            networkError.cause = error;
            throw networkError;
        }

        const text = await response.text();
        const payload = text ? JSON.parse(text) : {};
        if (!response.ok) {
            const error = new Error(payload.error || 'Request failed');
            error.status = response.status;
            throw error;
        }

        return payload;
    },

    isConfigured: function() {
        return Boolean(this.getBaseUrl());
    },

    signup: function(data) {
        return this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    login: function(data) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // --- NEW CODE START ---
    forgotPassword: function(data) {
        return this.request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    verifyToken: function(data) {
        return this.request('/verify-token', {
            method: 'POST',
            body: JSON.stringify(data || {})
        });
    },
    // --- NEW CODE END ---

    logout: function() {
        return this.request('/auth/logout', { method: 'POST' });
    },

    me: function() {
        return this.request('/users/me');
    },

    updateMe: function(updates) {
        return this.request('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    },

    postProgressEvent: function(payload) {
        return this.request('/progress/events', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    submitDiagnostic: function(payload) {
        return this.request('/diagnostics/submit', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    unlockAchievement: function(achievementId) {
        return this.request('/achievements/unlock', {
            method: 'POST',
            body: JSON.stringify({ achievementId })
        });
    },

    resetMyProgress: function() {
        return this.request('/users/me/reset-progress', { method: 'POST' });
    },

    deleteMyAccount: function() {
        return this.request('/users/me', { method: 'DELETE' });
    },

    listUsers: function(params = {}) {
        const search = new URLSearchParams(params);
        return this.request(`/admin/users?${search.toString()}`);
    },

    getUserDetail: function(userId) {
        return this.request(`/admin/users/${encodeURIComponent(userId)}`);
    },

    updateUser: function(userId, payload) {
        return this.request(`/admin/users/${encodeURIComponent(userId)}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });
    },

    deleteUser: function(userId) {
        return this.request(`/admin/users/${encodeURIComponent(userId)}`, { method: 'DELETE' });
    },

    resetUserProgress: function(userId) {
        return this.request(`/admin/users/${encodeURIComponent(userId)}/reset-progress`, { method: 'POST' });
    },

    getAdminAnalytics: function() {
        return this.request('/admin/analytics/summary');
    }
};
