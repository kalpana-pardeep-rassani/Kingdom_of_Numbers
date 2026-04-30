const adminDashboard = {
    state: {
        users: [],
        selectedUser: null,
        analytics: null,
        filters: {
            q: '',
            grade: '',
            status: ''
        }
    },

    renderShell: function() {
        document.getElementById('app').innerHTML = '<div class="admin-shell"></div>';
    },

    renderLogin: function(errorMessage = '') {
        this.renderShell();
        document.querySelector('.admin-shell').innerHTML = `
            <section class="admin-login-card">
                <span class="admin-chip">Admin Access</span>
                <h1>Kingdom Admin Dashboard</h1>
                <p>Sign in to view and manage all learner accounts.</p>
                <form id="adminLoginForm" class="admin-form">
                    <label>Email</label>
                    <input id="adminEmail" type="email" placeholder="Enter admin email" required>
                    <label>Password</label>
                    <input id="adminPassword" type="password" placeholder="Enter admin password" required>
                    <button type="submit">Open Dashboard</button>
                    ${errorMessage ? `<p class="admin-error">${errorMessage}</p>` : ''}
                </form>
                <p class="admin-helper">Student account? <a id="adminBackToLogin">Return to hero login</a></p>
            </section>
        `;

        document.getElementById('adminLoginForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                const payload = await apiClient.login({
                    email: document.getElementById('adminEmail').value,
                    password: document.getElementById('adminPassword').value
                });
                if (payload.user.role !== 'admin') {
                    throw new Error('This account is not an admin account.');
                }
                apiClient.setToken(payload.accessToken);
                storage.hydrateFromServerSnapshot(payload.snapshot);
                app.appState.currentUser = payload.snapshot.user;
                await this.loadDashboard();
            } catch (error) {
                storage.logout();
                this.renderLogin(error.message);
            }
        });

        document.getElementById('adminBackToLogin').addEventListener('click', () => {
            app.showPage('login');
        });
    },

    loadDashboard: async function() {
        this.renderShell();
        const [analytics, users] = await Promise.all([
            apiClient.getAdminAnalytics(),
            apiClient.listUsers(this.state.filters)
        ]);
        this.state.analytics = analytics;
        this.state.users = users.items;
        if (!this.state.selectedUser && this.state.users.length) {
            this.state.selectedUser = await apiClient.getUserDetail(this.state.users[0].id);
        }
        this.renderDashboard();
    },

    renderDashboard: function() {
        const analytics = this.state.analytics || {};
        const selected = this.state.selectedUser;
        document.querySelector('.admin-shell').innerHTML = `
            <header class="admin-header">
                <div>
                    <span class="admin-chip">Central User Management</span>
                    <h1>Admin Dashboard</h1>
                </div>
                <button id="adminLogout">Logout</button>
            </header>
            <section class="admin-summary-grid">
                <article class="admin-stat"><span>Total Users</span><strong>${analytics.totalUsers || 0}</strong></article>
                <article class="admin-stat"><span>Active This Week</span><strong>${analytics.activeUsers7d || 0}</strong></article>
                <article class="admin-stat"><span>Average Score</span><strong>${analytics.averageScore || 0}</strong></article>
                <article class="admin-stat"><span>Average Accuracy</span><strong>${analytics.averageAccuracy || 0}%</strong></article>
            </section>
            <section class="admin-filter-bar">
                <input id="adminSearch" type="text" placeholder="Search by name or email" value="${this.state.filters.q}">
                <select id="adminGradeFilter">
                    <option value="">All Grades</option>
                    <option value="6" ${this.state.filters.grade === '6' ? 'selected' : ''}>Grade 6</option>
                    <option value="7" ${this.state.filters.grade === '7' ? 'selected' : ''}>Grade 7</option>
                    <option value="8" ${this.state.filters.grade === '8' ? 'selected' : ''}>Grade 8</option>
                </select>
                <select id="adminStatusFilter">
                    <option value="">All Status</option>
                    <option value="active" ${this.state.filters.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="suspended" ${this.state.filters.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                    <option value="deleted" ${this.state.filters.status === 'deleted' ? 'selected' : ''}>Deleted</option>
                </select>
                <button id="adminFilterButton">Apply</button>
            </section>
            <section class="admin-layout">
                <article class="admin-panel">
                    <h2>Users</h2>
                    <div class="admin-user-list">
                        ${this.state.users.map((user) => `
                            <button class="admin-user-row ${selected && selected.user.userId === user.id ? 'active' : ''}" data-user-id="${user.id}">
                                <div>
                                    <strong>${user.name}</strong>
                                    <small>${user.email}</small>
                                </div>
                                <div>
                                    <span>${user.totalScore} XP</span>
                                    <small>${user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : 'No activity'}</small>
                                </div>
                            </button>
                        `).join('') || '<p class="admin-empty">No users found.</p>'}
                    </div>
                </article>
                <article class="admin-panel admin-detail-panel">
                    ${selected ? this.renderUserDetail(selected) : '<p class="admin-empty">Select a user to view details.</p>'}
                </article>
            </section>
        `;

        document.getElementById('adminLogout').addEventListener('click', async () => {
            auth.logout();
            app.appState.currentUser = null;
            this.state.selectedUser = null;
            app.showPage('login');
        });

        document.getElementById('adminFilterButton').addEventListener('click', async () => {
            this.state.filters.q = document.getElementById('adminSearch').value.trim();
            this.state.filters.grade = document.getElementById('adminGradeFilter').value;
            this.state.filters.status = document.getElementById('adminStatusFilter').value;
            this.state.selectedUser = null;
            await this.loadDashboard();
        });

        document.querySelectorAll('.admin-user-row').forEach((button) => {
            button.addEventListener('click', async () => {
                this.state.selectedUser = await apiClient.getUserDetail(button.dataset.userId);
                this.renderDashboard();
            });
        });

        const resetButton = document.getElementById('adminResetProgress');
        if (resetButton) {
            resetButton.addEventListener('click', async () => {
                await apiClient.resetUserProgress(resetButton.dataset.userId);
                this.state.selectedUser = await apiClient.getUserDetail(resetButton.dataset.userId);
                await this.loadDashboard();
            });
        }

        const deleteButton = document.getElementById('adminDeleteUser');
        if (deleteButton) {
            deleteButton.addEventListener('click', async () => {
                await apiClient.deleteUser(deleteButton.dataset.userId);
                this.state.selectedUser = null;
                await this.loadDashboard();
            });
        }
    },

    renderUserDetail: function(snapshot) {
        const progress = snapshot.progress || { worlds: [] };
        const stats = snapshot.stats || {};
        const activity = snapshot.activityHistory || [];
        const user = snapshot.user;
        return `
            <h2>${user.name}</h2>
            <p class="admin-subtitle">${user.email} • Grade ${user.class || '-'}</p>
            <div class="admin-detail-grid">
                <div class="admin-detail-card"><span>Status</span><strong>${user.status}</strong></div>
                <div class="admin-detail-card"><span>Total XP</span><strong>${user.totalPoints || 0}</strong></div>
                <div class="admin-detail-card"><span>Questions</span><strong>${stats.totalQuestionsAnswered || 0}</strong></div>
                <div class="admin-detail-card"><span>Accuracy</span><strong>${stats.totalQuestionsAnswered ? Math.round(((stats.correctAnswers || 0) / stats.totalQuestionsAnswered) * 100) : 0}%</strong></div>
            </div>
            <h3>World Progress</h3>
            <div class="admin-world-grid">
                ${progress.worlds.map((world) => `
                    <div class="admin-world-card">
                        <strong>${world.worldId}</strong>
                        <span>${world.completedLevels}/${world.totalLevels} levels</span>
                        <span>${world.points || 0} XP</span>
                    </div>
                `).join('')}
            </div>
            <h3>Recent Activity</h3>
            <div class="admin-activity-list">
                ${activity.slice(0, 8).map((item) => `
                    <div class="admin-activity-row">
                        <strong>${item.type}</strong>
                        <span>${new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                `).join('') || '<p class="admin-empty">No recent activity.</p>'}
            </div>
            <div class="admin-actions">
                <button id="adminResetProgress" data-user-id="${user.userId}">Reset Progress</button>
                <button id="adminDeleteUser" data-user-id="${user.userId}" class="danger">Delete User</button>
            </div>
        `;
    }
};
