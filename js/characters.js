/**
 * =========================================
 * KINGDOM OF NUMBERS - CHARACTERS
 * Character definitions and dialogs
 * ========================================= */

const characters = {
    mathWizard: {
        name: 'Math Wizard',
        emoji: '🧙‍♂️',
        color: '#FF9800',
        role: 'guide',
        dialogs: {
            welcome: [
                'Welcome, young scholar! I am the Math Wizard. Let me guide you! 🧙‍♂️',
                'Greetings! I\'ve been waiting for a brave hero like you!',
                'Welcome to the Kingdom of Numbers! Your adventure begins now!'
            ],
            correct: [
                'Excellent work! You\'re a natural! 🌟',
                'Perfect! You truly understand this concept!',
                'Bravo! You\'ve got it! Keep this up!',
                'Amazing! That\'s exactly right!',
                'Wonderful! You\'re getting stronger!'
            ],
            incorrect: [
                'Not quite, but don\'t worry! Learning takes practice. 📚',
                'Hmm, not this time. Let me explain...',
                'That\'s not right, but let\'s learn together!',
                'No worries! Everyone learns at their own pace.'
            ],
            hint: [
                'Think about what numbers could work here...',
                'Try to visualize the problem differently...',
                'Remember the rule we learned earlier?',
                'What operation might help you solve this?'
            ],
            encouragement: [
                'You\'re doing amazing! Keep pushing! 💪',
                'Keep going! You\'re on the right track!',
                'Don\'t give up! I believe in you!',
                'Every correct answer makes you stronger!'
            ],
            complete: [
                'You\'ve completed this world! You\'re incredible! 🏆',
                'Amazing! You\'ve mastered this realm!',
                'Phenomenal work! You\'ve proven yourself!'
            ]
        }
    },
    
    integerMonster: {
        name: 'Integer Monster',
        emoji: '👹',
        color: '#2196F3',
        role: 'villain',
        dialogs: {
            challenge: [
                'I guard the cliffs of Integers Island. Track every rise and fall carefully. 👹',
                'Show me you can tell the difference between gains, losses, and direction changes.',
                'These integer missions look simple, but every sign matters.'
            ],
            correct: [
                'Impressive. You kept the signs under control.',
                'Strong work. You read the direction of the numbers correctly.',
                'You solved it with solid integer reasoning.'
            ],
            incorrect: [
                'Check whether the story describes a gain, loss, rise, or fall.',
                'Look again at the sign of each number before answering.',
                'The numbers are close. Rebuild the steps carefully.'
            ],
            taunt: [
                'Negative numbers are easier when you imagine a number line.',
                'Think about which direction the value is moving.',
                'A correct sign often decides the whole answer.'
            ]
        }
    },
    
    fractionThief: {
        name: 'Fraction Thief',
        emoji: '🕵️',
        color: '#4CAF50',
        role: 'villain',
        dialogs: {
            challenge: [
                'I split treasures into equal parts. Can you keep track of the whole? 🕵️',
                'The forest rewards heroes who compare parts carefully.',
                'If you understand equal parts, you can catch every fraction I hide.'
            ],
            correct: [
                'You caught the correct part of the whole.',
                'Good job. Your fraction sense is getting sharper.',
                'Well done. You compared the parts accurately.'
            ],
            incorrect: [
                'Check the equal parts before you choose again.',
                'Try matching the numerator and denominator to the story.',
                'Look at how much of the whole is being described.'
            ],
            taunt: [
                'Fair sharing is the heart of fractions.',
                'Equivalent fractions can look different but mean the same amount.',
                'Always ask: how many equal parts are there in the whole?'
            ]
        }
    },
    
    algebraSphinx: {
        name: 'Algebra Sphinx',
        emoji: '🦁',
        color: '#9C27B0',
        role: 'villain',
        dialogs: {
            challenge: [
                'I am the Algebra Sphinx. Undo each operation with care. 🦁',
                'Hidden values become clear when your steps are organized.',
                'Show me that letters in math can be solved, not feared.'
            ],
            correct: [
                'You solved the equation with clear logic.',
                'Excellent. That was careful algebra, not a lucky guess.',
                'The unknown is no longer hidden from you.'
            ],
            incorrect: [
                'Try reversing the operations one step at a time.',
                'Substitute carefully and recheck the arithmetic.',
                'The structure is there. Slow down and solve it in order.'
            ],
            taunt: [
                'Find the hidden value by keeping both sides balanced.',
                'Like terms belong together. Start there when you simplify.',
                'Patterns become easy once you notice what repeats.'
            ]
        }
    },
    
    geometryGuardian: {
        name: 'Geometry Guardian',
        emoji: '👑',
        color: '#FF9800',
        role: 'villain',
        dialogs: {
            challenge: [
                'I am the Geometry Guardian. Accuracy is your key to passing. 👑',
                'Measure, classify, and justify. That is the geometry way.',
                'These shapes will reward careful observation.'
            ],
            correct: [
                'Accurate and well reasoned. Geometry suits you.',
                'You used the right shape fact at the right moment.',
                'Excellent. Precision made the difference.'
            ],
            incorrect: [
                'Return to the angle fact or formula and try again.',
                'Check whether the question asks for perimeter, area, or a shape property.',
                'A careful diagram in your mind can help here.'
            ],
            taunt: [
                'Geometry becomes easier when you name the property first.',
                'A shape can tell you a lot if you notice its sides and angles.',
                'Formula plus reasoning is better than guessing.'
            ]
        }
    }
};

/**
 * Get a random dialog from a character
 * @param {string} characterKey - The character identifier
 * @param {string} dialogType - The type of dialog (correct, incorrect, etc.)
 * @returns {string} A random dialog from the character
 */
function getCharacterDialog(characterKey, dialogType) {
    const character = characters[characterKey];
    if (!character || !character.dialogs[dialogType]) {
        return 'Great job!';
    }
    
    const dialogs = character.dialogs[dialogType];
    if (Array.isArray(dialogs)) {
        return dialogs[Math.floor(Math.random() * dialogs.length)];
    }
    return dialogs;
}

/**
 * Get a character's emoji
 * @param {string} characterKey - The character identifier
 * @returns {string} The character's emoji
 */
function getCharacterEmoji(characterKey) {
    return characters[characterKey]?.emoji || '🧙‍♂️';
}

/**
 * Get character for a given world
 * @param {string} worldId - The world identifier
 * @returns {object} The character object for that world
 */
function getCharacterForWorld(worldId) {
    const map = {
        'integers': characters.integerMonster,
        'fractions': characters.fractionThief,
        'algebra': characters.algebraSphinx,
        'geometry': characters.geometryGuardian
    };
    return map[worldId] || characters.mathWizard;
}

console.log('✅ Characters loaded!');
