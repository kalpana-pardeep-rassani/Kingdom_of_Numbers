/**
 * =========================================
 * KINGDOM OF NUMBERS - AUDIO MANAGER
 * Lightweight music and sound effects using Web Audio API
 * ========================================= */

const audioManager = {
    STORAGE_KEY: 'kon_audio_settings',
    audioContext: null,
    masterGain: null,
    sceneTimer: null,
    unlocked: false,
    currentScene: {
        pageName: 'login',
        worldId: null
    },
    settings: {
        musicEnabled: true,
        sfxEnabled: true,
        masterVolume: 0.35
    },

    init: function() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                console.warn('Audio settings could not be parsed. Using defaults.');
            }
        }

        document.addEventListener('click', (event) => {
            const interactiveTarget = event.target.closest('button, a, label, input, select');
            if (!interactiveTarget) {
                return;
            }

            this.unlock();

            if (interactiveTarget.closest('.answer-button')) {
                return;
            }

            if (interactiveTarget.id === 'audioMusicToggle' || interactiveTarget.id === 'audioSfxToggle' || interactiveTarget.id === 'audioVolumeCycle') {
                return;
            }

            this.playSfx('click');
        }, true);
    },

    ensureContext: function() {
        if (!this.audioContext) {
            const Context = window.AudioContext || window.webkitAudioContext;
            if (!Context) {
                return false;
            }

            this.audioContext = new Context();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.settings.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
        }

        return true;
    },

    saveSettings: function() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
    },

    unlock: function() {
        if (!this.ensureContext()) {
            return;
        }

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (!this.unlocked) {
            this.unlocked = true;
        }
    },

    setScene: function(pageName, worldId) {
        this.currentScene = { pageName, worldId };
        if (this.sceneTimer) {
            this.startSceneLoop();
        }
    },

    getSettings: function() {
        return { ...this.settings };
    },

    toggleMusic: function() {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        this.saveSettings();
        this.unlock();

        if (!this.settings.musicEnabled) {
            this.stopSceneLoop();
        } else {
            this.startSceneLoop();
            this.playSfx('click');
        }

        if (typeof app !== 'undefined') {
            app.showPage(app.appState.currentPage);
        }
    },

    toggleSfx: function() {
        this.settings.sfxEnabled = !this.settings.sfxEnabled;
        this.saveSettings();
        this.unlock();
        this.playSfx('click');

        if (typeof app !== 'undefined') {
            app.showPage(app.appState.currentPage);
        }
    },

    cycleVolume: function() {
        const levels = [0.2, 0.35, 0.5, 0.65];
        const currentIndex = levels.findIndex(level => Math.abs(level - this.settings.masterVolume) < 0.01);
        const nextIndex = currentIndex === -1 ? 1 : (currentIndex + 1) % levels.length;
        this.settings.masterVolume = levels[nextIndex];
        this.saveSettings();

        if (this.masterGain) {
            this.masterGain.gain.value = this.settings.masterVolume;
        }

        this.unlock();
        this.playSfx('click');

        if (typeof app !== 'undefined') {
            app.showPage(app.appState.currentPage);
        }
    },

    stopSceneLoop: function() {
        if (this.sceneTimer) {
            clearInterval(this.sceneTimer);
            this.sceneTimer = null;
        }
    },

    startSceneLoop: function() {
        this.stopSceneLoop();

        if (!this.unlocked || !this.settings.musicEnabled || !this.ensureContext()) {
            return;
        }

        const sceneProfile = this.getSceneProfile();
        this.playAmbientPattern(sceneProfile);
        this.sceneTimer = setInterval(() => {
            this.playAmbientPattern(sceneProfile);
        }, sceneProfile.intervalMs);
    },

    getSceneProfile: function() {
        const worldProfiles = {
            integers: { base: 220, accent: 277.18, intervalMs: 5200, waveform: 'sine' },
            fractions: { base: 261.63, accent: 329.63, intervalMs: 5000, waveform: 'triangle' },
            algebra: { base: 196.0, accent: 246.94, intervalMs: 5600, waveform: 'sine' },
            geometry: { base: 293.66, accent: 392.0, intervalMs: 4800, waveform: 'triangle' }
        };

        if (this.currentScene.worldId && worldProfiles[this.currentScene.worldId]) {
            return worldProfiles[this.currentScene.worldId];
        }

        const pageProfiles = {
            dashboard: { base: 261.63, accent: 392.0, intervalMs: 6000, waveform: 'sine' },
            progress: { base: 220.0, accent: 329.63, intervalMs: 6200, waveform: 'triangle' },
            profile: { base: 246.94, accent: 293.66, intervalMs: 6200, waveform: 'sine' },
            worlds: { base: 293.66, accent: 349.23, intervalMs: 5400, waveform: 'triangle' },
            diagnostic: { base: 233.08, accent: 349.23, intervalMs: 6000, waveform: 'sine' },
            'diagnostic-results': { base: 329.63, accent: 440.0, intervalMs: 5600, waveform: 'triangle' },
            login: { base: 261.63, accent: 311.13, intervalMs: 6400, waveform: 'sine' },
            signup: { base: 277.18, accent: 349.23, intervalMs: 6400, waveform: 'sine' }
        };

        return pageProfiles[this.currentScene.pageName] || pageProfiles.dashboard;
    },

    playAmbientPattern: function(profile) {
        if (!this.settings.musicEnabled || !this.unlocked || !this.audioContext) {
            return;
        }

        this.playTone(profile.base, 1.8, profile.waveform, 0.035, 0);
        this.playTone(profile.accent, 1.4, profile.waveform, 0.02, 0.35);
        this.playTone(profile.base * 0.5, 2.2, 'sine', 0.016, 0.12);
    },

    playTone: function(frequency, duration, type, volume, delaySeconds) {
        if (!this.ensureContext()) {
            return;
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const startTime = this.audioContext.currentTime + (delaySeconds || 0);
        const attack = 0.04;
        const release = Math.max(0.15, duration * 0.45);

        oscillator.type = type || 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime);
        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + release);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration + release + 0.02);
    },

    playSfx: function(name) {
        if (!this.settings.sfxEnabled) {
            return;
        }

        this.unlock();
        if (!this.audioContext) {
            return;
        }

        switch (name) {
            case 'click':
                this.playTone(660, 0.04, 'triangle', 0.025, 0);
                break;
            case 'correct':
                this.playTone(523.25, 0.08, 'triangle', 0.045, 0);
                this.playTone(659.25, 0.1, 'triangle', 0.04, 0.08);
                this.playTone(783.99, 0.12, 'triangle', 0.038, 0.16);
                break;
            case 'wrong':
                this.playTone(220, 0.08, 'sawtooth', 0.03, 0);
                this.playTone(196, 0.12, 'sawtooth', 0.026, 0.1);
                break;
            case 'badge':
                this.playTone(784, 0.08, 'triangle', 0.04, 0);
                this.playTone(988, 0.1, 'triangle', 0.03, 0.07);
                this.playTone(1174, 0.12, 'triangle', 0.028, 0.14);
                break;
            case 'complete':
                this.playTone(392, 0.12, 'triangle', 0.04, 0);
                this.playTone(523.25, 0.14, 'triangle', 0.038, 0.12);
                this.playTone(659.25, 0.16, 'triangle', 0.036, 0.24);
                this.playTone(783.99, 0.2, 'triangle', 0.034, 0.36);
                break;
            default:
                break;
        }
    }
};

console.log('✅ Audio manager loaded!');
