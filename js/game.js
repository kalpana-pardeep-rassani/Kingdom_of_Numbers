/**
 * =========================================
 * KINGDOM OF NUMBERS - GAME LOGIC
 * Question handling, scoring, achievements
 * ========================================= */

const game = {
    currentQuestion: null,
    currentWorld: null,
    currentLevel: null,
    questionStartTime: null,
    sessionPoints: 0,
    
    /**
     * Get diagnostic questions
     */
    getDiagnosticQuestions: function() {
        return gameData.diagnosticQuestions;
    },
    
    /**
     * Get questions for a world
     */
    getWorldQuestions: function(worldId, difficulty = null) {
        let questions = gameData.getWorldQuestions(worldId);
        if (difficulty) {
            questions = questions.filter(q => q.difficulty === difficulty);
        }
        return questions;
    },
    
    /**
     * Get a specific question
     */
    getQuestion: function(questionId) {
        return gameData.getQuestionById(questionId);
    },
    
    /**
     * Get next question
     */
    getNextQuestion: function(worldId, difficulty) {
        const questions = this.getWorldQuestions(worldId, difficulty);
        if (!questions.length) {
            return null;
        }

        const progress = this.getWorldProgress(worldId);
        const answeredQuestionIds = progress && progress.levels ? progress.levels.map(level => level.levelId) : [];
        return questions.find(question => !answeredQuestionIds.includes(question.id)) || null;
    },

    startQuestion: function(worldId, questionId) {
        this.currentWorld = worldId;
        this.currentQuestion = questionId;
        this.questionStartTime = Date.now();
        return this.getQuestion(questionId);
    },
    
    /**
     * Validate answer to a question
     */
    validateAnswer: function(questionId, selectedOption) {
        const question = this.getQuestion(questionId);
        if (!question) return { correct: false, message: 'Question not found' };
        
        const correctOption = question.options.find(opt => opt.correct);
        const isCorrect = selectedOption === correctOption.text;
        
        // Update stats
        return {
            correct: isCorrect,
            explanation: question.explanation,
            correctAnswer: correctOption.text
        };
    },
    
    /**
     * Calculate points for an answer
     */
    calculatePoints: function(difficulty, timeSpent = 0) {
        const basePoints = {
            'easy': 10,
            'medium': 20,
            'hard': 30
        };
        
        let points = basePoints[difficulty] || 10;
        
        // Bonus for speed
        if (timeSpent > 0 && timeSpent < 60) {
            points += 5;
        }
        
        return points;
    },
    
    /**
     * Record question completion
     */
    completeQuestion: function(worldId, questionId, isCorrect, points = 0, meta = {}) {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) return false;

        if (isCorrect) {
            storage.updateWorldProgress(currentUser.userId, worldId, questionId, points, {
                isCorrect,
                timeSpent: meta.timeSpent || 0,
                stars: meta.stars || 1
            });

            const user = storage.getUserById(currentUser.userId);
            const newTotalPoints = (user.totalPoints || 0) + points;
            const title = newTotalPoints >= 900 ? 'Legend of Numbers' :
                newTotalPoints >= 500 ? 'Royal Solver' :
                newTotalPoints >= 200 ? 'Quest Champion' :
                'Rookie Hero';
            storage.updateUser(currentUser.userId, {
                totalPoints: newTotalPoints,
                title: title
            });
        }
        
        return true;
    },

    submitWorldAnswer: function(worldId, questionId, selectedOption) {
        const question = this.getQuestion(questionId);
        if (!question) {
            return { success: false, error: 'Question not found.' };
        }

        const previousProgress = this.getWorldProgress(worldId);
        const previousCompletedLevels = previousProgress ? previousProgress.completedLevels : 0;
        const timeSpent = this.questionStartTime ? Math.max(1, Math.round((Date.now() - this.questionStartTime) / 1000)) : 0;
        const validation = this.validateAnswer(questionId, selectedOption);
        const points = validation.correct ? this.calculatePoints(question.difficulty, timeSpent) : 0;
        const currentUser = storage.getCurrentUser();

        if (!currentUser) {
            return { success: false, error: 'Please log in again.' };
        }

        storage.updateStats(currentUser.userId, {
            isCorrect: validation.correct,
            topic: question.topic,
            worldId,
            points,
            timeSpent
        });

        const starsEarned = validation.correct ? (timeSpent <= 15 ? 3 : timeSpent <= 30 ? 2 : 1) : 0;

        this.completeQuestion(worldId, questionId, validation.correct, points, {
            timeSpent,
            stars: starsEarned
        });

        const progress = this.getWorldProgress(worldId);
        const worldCompleted = progress && progress.completedLevels >= progress.totalLevels;
        const treasureUnlocked = validation.correct && Math.floor((progress ? progress.completedLevels : 0) / 3) > Math.floor(previousCompletedLevels / 3);

        if (worldCompleted) {
            storage.markWorldCompleted(currentUser.userId, worldId);
        }

        const unlockedAchievements = this.checkAchievements();

        storage.syncProgressEvent({
            worldId,
            levelId: questionId,
            questionId,
            result: validation.correct ? 'correct' : 'incorrect',
            scoreEarned: points,
            timeSpentSeconds: timeSpent,
            starsEarned,
            topic: question.topic
        });

        return {
            success: true,
            correct: validation.correct,
            explanation: validation.explanation,
            correctAnswer: validation.correctAnswer,
            points,
            timeSpent,
            starsEarned,
            treasureUnlocked,
            worldCompleted,
            achievements: unlockedAchievements,
            nextQuestion: validation.correct ? this.getNextQuestion(worldId) : question,
            question
        };
    },
    
    /**
     * Get world progress
     */
    getWorldProgress: function(worldId) {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) return null;
        
        const progress = storage.getProgress(currentUser.userId);
        return progress.worlds.find(w => w.worldId === worldId);
    },
    
    /**
     * Get all progress
     */
    getAllProgress: function() {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) return { worlds: [] };
        
        return storage.getProgress(currentUser.userId);
    },
    
    /**
     * Check and unlock achievements
     */
    checkAchievements: function() {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) return [];
        
        const stats = storage.getStats(currentUser.userId);
        const unlockedAchievements = [];
        
        gameData.achievements.forEach(achievement => {
            const achievements = storage.getAchievements(currentUser.userId);
            const alreadyUnlocked = achievements.unlocked.find(a => a.id === achievement.id);
            
            if (!alreadyUnlocked && achievement.condition(stats)) {
                storage.unlockAchievement(currentUser.userId, achievement.id);
                unlockedAchievements.push(achievement);
            }
        });
        
        return unlockedAchievements;
    },
    
    /**
     * Get user achievements
     */
    getAchievements: function() {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) return { unlocked: [] };
        
        return storage.getAchievements(currentUser.userId);
    },
    
    /**
     * Run diagnostic test
     */
    runDiagnosticTest: function(answers, callback) {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) {
            callback({ success: false, error: 'Not logged in' });
            return;
        }
        
        // Calculate scores
        const diagnosticQuestions = this.getDiagnosticQuestions();
        const topicScores = {};
        let totalScore = 0;
        
        const topics = ['integers', 'fractions', 'algebra', 'geometry'];
        topics.forEach(topic => {
            topicScores[topic] = { correct: 0, total: 0 };
        });
        
        // Process answers
        Object.entries(answers).forEach(([questionId, answer]) => {
            const question = diagnosticQuestions.find(q => q.id === parseInt(questionId));
            if (question) {
                topicScores[question.topic].total++;
                
                const correctOption = question.options.find(opt => opt.correct);
                if (answer === correctOption.text) {
                    topicScores[question.topic].correct++;
                    totalScore++;
                }
            }
        });
        
        // Calculate percentages
        const topicPercentages = {};
        const weakTopics = [];
        const strongTopics = [];
        
        Object.entries(topicScores).forEach(([topic, scores]) => {
            if (scores.total > 0) {
                const percentage = Math.round((scores.correct / scores.total) * 100);
                topicPercentages[topic] = percentage;
                
                if (percentage < 60) {
                    weakTopics.push(topic);
                } else if (percentage >= 80) {
                    strongTopics.push(topic);
                }
            }
        });

        const recommendations = this.buildLearningPath({ weakTopics, strongTopics, topicScores: topicPercentages });
        
        // Save results
        const results = {
            score: totalScore,
            totalQuestions: diagnosticQuestions.length,
            percentage: Math.round((totalScore / diagnosticQuestions.length) * 100),
            topicScores: topicPercentages,
            weakTopics: weakTopics,
            strongTopics: strongTopics,
            recommendations: recommendations
        };
        
        storage.saveDiagnosticResults(currentUser.userId, results);
        
        callback({ success: true, results: results });
    },
    
    /**
     * Get recommendations based on diagnostic test
     */
    getRecommendations: function() {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) return [];
        
        const diagnosticResults = storage.getDiagnosticResults(currentUser.userId);
        if (!diagnosticResults) return ['integers', 'fractions', 'algebra', 'geometry'];
        return diagnosticResults.recommendations && diagnosticResults.recommendations.length
            ? diagnosticResults.recommendations
            : this.buildLearningPath(diagnosticResults);
    },

    buildLearningPath: function(diagnosticResults) {
        const worldMap = {
            integers: 'integers',
            fractions: 'fractions',
            algebra: 'algebra',
            geometry: 'geometry'
        };
        const recommendations = [];

        (diagnosticResults.weakTopics || []).forEach(topic => {
            if (worldMap[topic] && !recommendations.includes(worldMap[topic])) {
                recommendations.push(worldMap[topic]);
            }
        });

        Object.entries(diagnosticResults.topicScores || {})
            .sort((a, b) => a[1] - b[1])
            .forEach(([topic]) => {
                if (worldMap[topic] && !recommendations.includes(worldMap[topic])) {
                    recommendations.push(worldMap[topic]);
                }
            });

        Object.values(worldMap).forEach(worldId => {
            if (!recommendations.includes(worldId)) {
                recommendations.push(worldId);
            }
        });

        return recommendations;
    },
    
    /**
     * Get game statistics
     */
    getStatistics: function() {
        const currentUser = storage.getCurrentUser();
        if (!currentUser) return null;
        
        const stats = storage.getStats(currentUser.userId);
        const progress = storage.getProgress(currentUser.userId);
        const achievements = storage.getAchievements(currentUser.userId);
        
        return {
            stats: stats,
            progress: progress,
            achievements: achievements,
            diagnosticResults: storage.getDiagnosticResults(currentUser.userId)
        };
    },
    
    /**
     * Get completion percentage for a world
     */
    getWorldCompletionPercentage: function(worldId) {
        const progress = this.getWorldProgress(worldId);
        if (!progress) return 0;
        
        return Math.round((progress.completedLevels / progress.totalLevels) * 100);
    },

    getWorldStarCount: function(worldId) {
        const progress = this.getWorldProgress(worldId);
        if (!progress || !progress.levels) {
            return 0;
        }

        return progress.levels.reduce((total, level) => total + (level.stars || 0), 0);
    },

    getRecommendedWorldCards: function() {
        const recommendations = this.getRecommendations();
        return recommendations.map(worldId => gameData.worlds.find(world => world.id === worldId)).filter(Boolean);
    }
};

console.log('✅ Game logic loaded!');
