/**
 * =========================================
 * KINGDOM OF NUMBERS - UTILITIES
 * Helper functions
 * ========================================= */

const utils = {
    /**
     * Generate a unique ID
     */
    generateId: function() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * Shuffle array randomly
     */
    shuffleArray: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    /**
     * Get random item from array
     */
    randomChoice: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * Get current date in ISO format
     */
    getCurrentDate: function() {
        return new Date().toISOString().split('T')[0];
    },
    
    /**
     * Get current time
     */
    getCurrentTime: function() {
        return new Date();
    },
    
    /**
     * Format date for display
     */
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
    /**
     * Format time in seconds to readable format
     */
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    },
    
    /**
     * Validate email format
     */
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Validate password strength
     */
    validatePassword: function(password) {
        return password && password.length >= 6;
    },
    
    /**
     * Validate form data
     */
    validateForm: function(formData, rules) {
        const errors = {};
        
        for (const field in rules) {
            const value = formData[field];
            const rule = rules[field];
            
            if (rule.required && (!value || value.trim() === '')) {
                errors[field] = `${rule.label} is required`;
            } else if (rule.type === 'email' && value && !this.validateEmail(value)) {
                errors[field] = 'Please enter a valid email';
            } else if (rule.type === 'password' && value && !this.validatePassword(value)) {
                errors[field] = 'Password must be at least 6 characters';
            } else if (rule.minLength && value && value.length < rule.minLength) {
                errors[field] = `${rule.label} must be at least ${rule.minLength} characters`;
            }
        }
        
        return errors;
    },
    
    /**
     * Debounce function calls
     */
    debounce: function(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    },
    
    /**
     * Throttle function calls
     */
    throttle: function(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        };
    },
    
    /**
     * Deep clone object
     */
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    /**
     * Calculate percentage
     */
    calculatePercentage: function(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    },
    
    /**
     * Calculate points based on difficulty and time
     */
    calculatePoints: function(difficulty, timeSpent = 0) {
        const basePoints = {
            'easy': 10,
            'medium': 20,
            'hard': 30
        };
        
        let points = basePoints[difficulty] || 10;
        
        // Bonus for speed (if answered in under 1 minute)
        if (timeSpent > 0 && timeSpent < 60) {
            points += 5;
        }
        
        return points;
    },
    
    /**
     * Get difficulty color
     */
    getDifficultyColor: function(difficulty) {
        const colors = {
            'easy': '#4CAF50',
            'medium': '#FF9800',
            'hard': '#FF6B6B'
        };
        return colors[difficulty] || '#999';
    },
    
    /**
     * Get difficulty emoji
     */
    getDifficultyEmoji: function(difficulty) {
        const emojis = {
            'easy': '🟩',
            'medium': '🟨',
            'hard': '🟥'
        };
        return emojis[difficulty] || '🟪';
    },
    
    /**
     * Show notification/toast
     */
    showNotification: function(message, type = 'info', duration = 3000) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `alert alert-${type} fade-in`;
        notificationDiv.innerHTML = `
            <div class="alert-content">
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notificationDiv);
        
        setTimeout(() => {
            notificationDiv.classList.add('fade-out');
            setTimeout(() => notificationDiv.remove(), 300);
        }, duration);
    },
    
    /**
     * Get greeting based on time
     */
    getTimeGreeting: function() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    },
    
    /**
     * Capitalize first letter
     */
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    /**
     * Get initials from name
     */
    getInitials: function(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
    
    /**
     * Convert seconds to time display
     */
    secondsToTime: function(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        }
        return `${secs}s`;
    },
    
    /**
     * Get random encouragement message
     */
    getEncouragement: function() {
        const messages = [
            'You\'re doing great! 🌟',
            'Keep pushing! 💪',
            'You\'ve got this! 🚀',
            'Believe in yourself! ✨',
            'Amazing progress! 🎉',
            'You\'re a star! ⭐',
            'Fantastic work! 🏆',
            'Keep it up! 🔥'
        ];
        return this.randomChoice(messages);
    },
    
    /**
     * Scroll to element smoothly
     */
    scrollToElement: function(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },
    
    /**
     * Remove element from DOM
     */
    removeElement: function(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    },
    
    /**
     * Clear element content
     */
    clearElement: function(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = '';
        }
    },
    
    /**
     * Check if element is visible in viewport
     */
    isElementVisible: function(selector) {
        const element = document.querySelector(selector);
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
    },
    
    /**
     * Copy text to clipboard
     */
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!', 'success');
        });
    }
};

console.log('✅ Utilities loaded!');
