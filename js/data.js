/**
 * =========================================
 * KINGDOM OF NUMBERS - GAME DATA
 * Federal Board aligned content bank
 * ========================================= */

const diagnosticQuestions = [
    {
        id: 1,
        topic: 'integers',
        difficulty: 'easy',
        chapter: 'Integers',
        gradeBand: '6-7',
        learningGoal: 'Add and subtract integers in context',
        question: 'On the school hiking trail, Zara is at 4 meters above camp. She climbs 3 more meters. What is her new position?',
        options: [
            { text: '1 m', correct: false },
            { text: '7 m', correct: true },
            { text: '-7 m', correct: false },
            { text: '12 m', correct: false }
        ],
        explanation: 'She starts at 4 and climbs 3 more, so 4 + 3 = 7 meters above camp.',
        points: 10
    },
    {
        id: 2,
        topic: 'fractions',
        difficulty: 'easy',
        chapter: 'Fractions and Decimals',
        gradeBand: '6-7',
        learningGoal: 'Identify equivalent fractions',
        question: 'The canteen cuts one paratha into 4 equal parts. Two parts are eaten. Which fraction shows the eaten part in simplest form?',
        options: [
            { text: '1/4', correct: false },
            { text: '2/4', correct: false },
            { text: '1/2', correct: true },
            { text: '3/4', correct: false }
        ],
        explanation: 'Two out of four equal parts is 2/4, and 2/4 simplifies to 1/2.',
        points: 10
    },
    {
        id: 3,
        topic: 'algebra',
        difficulty: 'easy',
        chapter: 'Algebraic Expressions and Linear Equations',
        gradeBand: '7-8',
        learningGoal: 'Solve a one-step linear equation',
        question: 'A treasure chest opens when x + 5 = 12. What number must x be?',
        options: [
            { text: '5', correct: false },
            { text: '7', correct: true },
            { text: '12', correct: false },
            { text: '17', correct: false }
        ],
        explanation: 'Subtract 5 from both sides: x = 12 - 5 = 7.',
        points: 10
    },
    {
        id: 4,
        topic: 'geometry',
        difficulty: 'easy',
        chapter: 'Lines, Angles and Basic Shapes',
        gradeBand: '6-7',
        learningGoal: 'Recognize angle types',
        question: 'A gate opens at 90 degrees. What type of angle is this?',
        options: [
            { text: 'Acute angle', correct: false },
            { text: 'Right angle', correct: true },
            { text: 'Obtuse angle', correct: false },
            { text: 'Straight angle', correct: false }
        ],
        explanation: 'An angle of exactly 90 degrees is a right angle.',
        points: 10
    },
    {
        id: 5,
        topic: 'integers',
        difficulty: 'medium',
        chapter: 'Integers',
        gradeBand: '6-7',
        learningGoal: 'Interpret negative numbers in real life',
        question: 'The morning temperature is -2 C. By noon it rises 6 degrees. What is the new temperature?',
        options: [
            { text: '4 C', correct: true },
            { text: '-8 C', correct: false },
            { text: '-4 C', correct: false },
            { text: '8 C', correct: false }
        ],
        explanation: 'Starting from -2 and rising 6 means -2 + 6 = 4 C.',
        points: 20
    },
    {
        id: 6,
        topic: 'fractions',
        difficulty: 'medium',
        chapter: 'Fractions and Decimals',
        gradeBand: '6-7',
        learningGoal: 'Add fractions with like denominators',
        question: 'A water tank is filled by 1/8 in the morning and 3/8 in the afternoon. How much of the tank is filled altogether?',
        options: [
            { text: '4/8', correct: true },
            { text: '3/16', correct: false },
            { text: '2/8', correct: false },
            { text: '1/2 of 1/8', correct: false }
        ],
        explanation: 'The denominators are the same, so add the numerators: 1/8 + 3/8 = 4/8.',
        points: 20
    },
    {
        id: 7,
        topic: 'algebra',
        difficulty: 'medium',
        chapter: 'Algebraic Expressions and Linear Equations',
        gradeBand: '7-8',
        learningGoal: 'Evaluate an algebraic expression',
        question: 'In the robot workshop, the energy formula is 3n + 2. If n = 4, how much energy is needed?',
        options: [
            { text: '6', correct: false },
            { text: '12', correct: false },
            { text: '14', correct: true },
            { text: '20', correct: false }
        ],
        explanation: 'Substitute n = 4: 3(4) + 2 = 12 + 2 = 14.',
        points: 20
    },
    {
        id: 8,
        topic: 'geometry',
        difficulty: 'medium',
        chapter: 'Perimeter and Area',
        gradeBand: '6-8',
        learningGoal: 'Find the perimeter of a rectangle',
        question: 'The school garden is a rectangle with length 9 m and width 4 m. What is its perimeter?',
        options: [
            { text: '13 m', correct: false },
            { text: '26 m', correct: true },
            { text: '36 m', correct: false },
            { text: '18 m', correct: false }
        ],
        explanation: 'Perimeter = 2(length + width) = 2(9 + 4) = 26 m.',
        points: 20
    },
    {
        id: 9,
        topic: 'integers',
        difficulty: 'hard',
        chapter: 'Integers',
        gradeBand: '7-8',
        learningGoal: 'Multiply integers using sign rules',
        question: 'A game trap makes the hero lose 3 hearts for 4 turns. What is the total change in hearts?',
        options: [
            { text: '12', correct: false },
            { text: '-12', correct: true },
            { text: '1', correct: false },
            { text: '-7', correct: false }
        ],
        explanation: 'Losing 3 hearts each turn for 4 turns is 4 x (-3) = -12.',
        points: 30
    },
    {
        id: 10,
        topic: 'fractions',
        difficulty: 'hard',
        chapter: 'Fractions, Decimals and Percentages',
        gradeBand: '7-8',
        learningGoal: 'Find a percentage of a quantity',
        question: 'The library has 80 storybooks. If 25% are adventure books, how many adventure books are there?',
        options: [
            { text: '10', correct: false },
            { text: '20', correct: true },
            { text: '25', correct: false },
            { text: '40', correct: false }
        ],
        explanation: '25% means one quarter. One quarter of 80 is 80 / 4 = 20.',
        points: 30
    }
];

const integersQuestions = [
    {
        id: 101,
        topic: 'integers',
        difficulty: 'easy',
        chapter: 'Integers',
        gradeBand: '6',
        learningGoal: 'Represent integers on a number line',
        story: 'At Camp Elevation, Bilal must place rescue flags on a mountain number line before sunset.',
        question: 'Bilal stands at 0 and walks 6 steps to the right on the number line trail. Where does he stop?',
        options: [
            { text: '-6', correct: false },
            { text: '6', correct: true },
            { text: '0', correct: false },
            { text: '12', correct: false }
        ],
        explanation: 'Moving to the right on a number line means going in the positive direction, so Bilal stops at 6.',
        points: 10
    },
    {
        id: 102,
        topic: 'integers',
        difficulty: 'easy',
        chapter: 'Integers',
        gradeBand: '6',
        learningGoal: 'Subtract whole numbers in context',
        story: 'The gatekeeper gives your team 14 lanterns, but 5 are used inside the cave mission.',
        question: 'How many lanterns remain with the team?',
        options: [
            { text: '9', correct: true },
            { text: '19', correct: false },
            { text: '5', correct: false },
            { text: '10', correct: false }
        ],
        explanation: 'The team had 14 lanterns and used 5, so 14 - 5 = 9 lanterns remain.',
        points: 10
    },
    {
        id: 103,
        topic: 'integers',
        difficulty: 'easy',
        chapter: 'Integers',
        gradeBand: '6',
        learningGoal: 'Interpret negative values',
        story: 'The weather tower marks temperatures below zero for the night watch.',
        question: 'If the temperature is 3 degrees below zero, which integer represents it?',
        options: [
            { text: '3', correct: false },
            { text: '-3', correct: true },
            { text: '+3', correct: false },
            { text: '0', correct: false }
        ],
        explanation: 'A value below zero is written with a negative sign, so 3 degrees below zero is -3.',
        points: 10
    },
    {
        id: 104,
        topic: 'integers',
        difficulty: 'medium',
        chapter: 'Integers',
        gradeBand: '6-7',
        learningGoal: 'Add a positive integer to a negative integer',
        story: 'Your climber starts 4 meters below the camp bridge and climbs 9 meters up the rope path.',
        question: 'What is the climber\'s new position relative to the bridge?',
        options: [
            { text: '-13 m', correct: false },
            { text: '5 m', correct: true },
            { text: '-5 m', correct: false },
            { text: '13 m', correct: false }
        ],
        explanation: 'Start at -4 and add 9: -4 + 9 = 5. The climber ends 5 meters above the bridge.',
        points: 20
    },
    {
        id: 105,
        topic: 'integers',
        difficulty: 'medium',
        chapter: 'Integers',
        gradeBand: '6-7',
        learningGoal: 'Subtract integers in context',
        story: 'A submarine scout is at -12 meters. A whirlpool pulls it down 7 more meters.',
        question: 'What is the scout\'s new depth?',
        options: [
            { text: '-5 m', correct: false },
            { text: '19 m', correct: false },
            { text: '-19 m', correct: true },
            { text: '-7 m', correct: false }
        ],
        explanation: 'Being pulled down 7 more meters means subtract 7: -12 - 7 = -19.',
        points: 20
    },
    {
        id: 106,
        topic: 'integers',
        difficulty: 'medium',
        chapter: 'Integers',
        gradeBand: '7',
        learningGoal: 'Add two negative integers',
        story: 'Two storm clouds drain the crystal tower by 5 units and 8 units.',
        question: 'What integer shows the total change in tower energy?',
        options: [
            { text: '13', correct: false },
            { text: '-3', correct: false },
            { text: '-13', correct: true },
            { text: '3', correct: false }
        ],
        explanation: 'A drain is negative. Add the changes: -5 + -8 = -13.',
        points: 20
    },
    {
        id: 107,
        topic: 'integers',
        difficulty: 'hard',
        chapter: 'Integers',
        gradeBand: '7',
        learningGoal: 'Multiply a positive and a negative integer',
        story: 'The ice dragon freezes 6 health points every round for 3 rounds.',
        question: 'What is the total change in health after 3 rounds?',
        options: [
            { text: '-18', correct: true },
            { text: '18', correct: false },
            { text: '-9', correct: false },
            { text: '9', correct: false }
        ],
        explanation: 'Each round changes health by -6. For 3 rounds, 3 x -6 = -18.',
        points: 30
    },
    {
        id: 108,
        topic: 'integers',
        difficulty: 'hard',
        chapter: 'Integers',
        gradeBand: '7',
        learningGoal: 'Use sign rules for multiplication',
        story: 'A magic mirror reverses a debt of 4 coins across 5 portals.',
        question: 'What is (-4) x (-5)?',
        options: [
            { text: '-20', correct: false },
            { text: '20', correct: true },
            { text: '-9', correct: false },
            { text: '9', correct: false }
        ],
        explanation: 'The product of two negative integers is positive, so (-4) x (-5) = 20.',
        points: 30
    },
    {
        id: 109,
        topic: 'integers',
        difficulty: 'hard',
        chapter: 'Integers',
        gradeBand: '7-8',
        learningGoal: 'Evaluate a multi-step integer expression',
        story: 'At the glacier checkpoint, your score changes by +7, -11, and +6 during the quest.',
        question: 'What is the final score change?',
        options: [
            { text: '2', correct: true },
            { text: '-2', correct: false },
            { text: '24', correct: false },
            { text: '-24', correct: false }
        ],
        explanation: 'Add step by step: 7 - 11 + 6 = -4 + 6 = 2.',
        points: 30
    },
    {
        id: 110,
        topic: 'integers',
        difficulty: 'hard',
        chapter: 'Integers',
        gradeBand: '7-8',
        learningGoal: 'Compare integers on a number line',
        story: 'The rescue drone must choose the colder weather station first.',
        question: 'Which temperature is colder: -9 C or -4 C?',
        options: [
            { text: '-9 C', correct: true },
            { text: '-4 C', correct: false },
            { text: 'They are equal', correct: false },
            { text: 'Cannot be compared', correct: false }
        ],
        explanation: 'On the number line, -9 is to the left of -4, so it is the smaller and colder temperature.',
        points: 30
    }
];

const fractionsQuestions = [
    {
        id: 201,
        topic: 'fractions',
        difficulty: 'easy',
        chapter: 'Fractions and Decimals',
        gradeBand: '6',
        learningGoal: 'Identify a fraction from equal parts',
        story: 'In Fractions Forest, 8 equal fruit baskets are prepared for the village feast.',
        question: 'If 3 of the 8 baskets are filled with apples, what fraction of the baskets hold apples?',
        options: [
            { text: '3/8', correct: true },
            { text: '8/3', correct: false },
            { text: '5/8', correct: false },
            { text: '1/3', correct: false }
        ],
        explanation: 'The fraction is number of apple baskets over total baskets: 3/8.',
        points: 10
    },
    {
        id: 202,
        topic: 'fractions',
        difficulty: 'easy',
        chapter: 'Fractions and Decimals',
        gradeBand: '6',
        learningGoal: 'Recognize equivalent fractions',
        story: 'The forest baker cuts one pie into 2 equal pieces, then marks the same amount in fourths.',
        question: 'Which fraction is equal to 1/2?',
        options: [
            { text: '1/4', correct: false },
            { text: '2/4', correct: true },
            { text: '3/4', correct: false },
            { text: '4/2', correct: false }
        ],
        explanation: 'Two out of four equal parts cover the same amount as one out of two equal parts, so 2/4 = 1/2.',
        points: 10
    },
    {
        id: 203,
        topic: 'fractions',
        difficulty: 'easy',
        chapter: 'Decimals',
        gradeBand: '6',
        learningGoal: 'Convert tenths to decimals',
        story: 'A stream marker shows that 7 out of 10 water stones are glowing.',
        question: 'What decimal is equal to 7/10?',
        options: [
            { text: '0.07', correct: false },
            { text: '0.7', correct: true },
            { text: '7.0', correct: false },
            { text: '70', correct: false }
        ],
        explanation: 'Seven tenths is written as 0.7.',
        points: 10
    },
    {
        id: 204,
        topic: 'fractions',
        difficulty: 'medium',
        chapter: 'Fractions',
        gradeBand: '6-7',
        learningGoal: 'Add fractions with like denominators',
        story: 'The forest team gathers 2/9 of a basket of berries in the morning and 4/9 in the evening.',
        question: 'How much of the basket is filled altogether?',
        options: [
            { text: '6/9', correct: true },
            { text: '6/18', correct: false },
            { text: '2/13', correct: false },
            { text: '8/9', correct: false }
        ],
        explanation: 'The denominators match, so add numerators: 2/9 + 4/9 = 6/9.',
        points: 20
    },
    {
        id: 205,
        topic: 'fractions',
        difficulty: 'medium',
        chapter: 'Fractions',
        gradeBand: '6-7',
        learningGoal: 'Subtract fractions with like denominators',
        story: 'A juice barrel is 7/10 full, and the travelers drink 3/10 of it.',
        question: 'How much juice is left in the barrel?',
        options: [
            { text: '4/10', correct: true },
            { text: '10/10', correct: false },
            { text: '3/7', correct: false },
            { text: '1/10', correct: false }
        ],
        explanation: 'Subtract the numerators because the denominators are the same: 7/10 - 3/10 = 4/10.',
        points: 20
    },
    {
        id: 206,
        topic: 'fractions',
        difficulty: 'medium',
        chapter: 'Decimals',
        gradeBand: '6-7',
        learningGoal: 'Compare decimals',
        story: 'Two racing fireflies glow for 0.6 minutes and 0.56 minutes.',
        question: 'Which time is greater?',
        options: [
            { text: '0.56', correct: false },
            { text: '0.6', correct: true },
            { text: 'They are equal', correct: false },
            { text: 'Cannot compare', correct: false }
        ],
        explanation: 'Write 0.6 as 0.60. Since 0.60 > 0.56, 0.6 is greater.',
        points: 20
    },
    {
        id: 207,
        topic: 'fractions',
        difficulty: 'hard',
        chapter: 'Fractions',
        gradeBand: '7',
        learningGoal: 'Add unlike fractions',
        story: 'To heal the ancient tree, the wizard pours 1/2 vial of moonwater and 1/4 vial of rainwater.',
        question: 'How much liquid is poured in total?',
        options: [
            { text: '2/6', correct: false },
            { text: '3/4', correct: true },
            { text: '1/6', correct: false },
            { text: '2/4', correct: false }
        ],
        explanation: 'Convert to like denominators: 1/2 = 2/4, then 2/4 + 1/4 = 3/4.',
        points: 30
    },
    {
        id: 208,
        topic: 'fractions',
        difficulty: 'hard',
        chapter: 'Fractions',
        gradeBand: '7',
        learningGoal: 'Multiply fractions',
        story: 'A potion uses 2/3 of a leaf bundle, and the healer prepares only 3/5 of the full recipe.',
        question: 'What fraction of the leaf bundle is used?',
        options: [
            { text: '6/15', correct: true },
            { text: '5/6', correct: false },
            { text: '1/2', correct: false },
            { text: '9/8', correct: false }
        ],
        explanation: 'Multiply numerator by numerator and denominator by denominator: 2/3 x 3/5 = 6/15.',
        points: 30
    },
    {
        id: 209,
        topic: 'fractions',
        difficulty: 'hard',
        chapter: 'Percentages',
        gradeBand: '7-8',
        learningGoal: 'Find a percentage of a quantity',
        story: 'The forest museum has 120 shells. Exactly 15% are rare silver shells.',
        question: 'How many rare silver shells are there?',
        options: [
            { text: '12', correct: false },
            { text: '15', correct: false },
            { text: '18', correct: true },
            { text: '20', correct: false }
        ],
        explanation: '10% of 120 is 12 and 5% is 6, so 15% is 12 + 6 = 18.',
        points: 30
    },
    {
        id: 210,
        topic: 'fractions',
        difficulty: 'hard',
        chapter: 'Decimals and Percentages',
        gradeBand: '7-8',
        learningGoal: 'Convert a decimal to a percentage',
        story: 'The tracker crystal shows a success rate of 0.85 for your shield spell.',
        question: 'What percentage is 0.85?',
        options: [
            { text: '8.5%', correct: false },
            { text: '85%', correct: true },
            { text: '0.85%', correct: false },
            { text: '850%', correct: false }
        ],
        explanation: 'To change a decimal to a percent, multiply by 100. So 0.85 = 85%.',
        points: 30
    }
];

const algebraQuestions = [
    {
        id: 301,
        topic: 'algebra',
        difficulty: 'easy',
        chapter: 'Algebraic Expressions',
        gradeBand: '7',
        learningGoal: 'Translate a pattern into an expression',
        story: 'In Algebra Academy, each spell scroll needs n stars and 2 extra seals.',
        question: 'Which expression matches the total seals needed?',
        options: [
            { text: 'n + 2', correct: true },
            { text: '2n', correct: false },
            { text: 'n - 2', correct: false },
            { text: '2 - n', correct: false }
        ],
        explanation: 'You need n stars plus 2 extra seals, so the expression is n + 2.',
        points: 10
    },
    {
        id: 302,
        topic: 'algebra',
        difficulty: 'easy',
        chapter: 'Algebraic Expressions',
        gradeBand: '7',
        learningGoal: 'Evaluate an expression',
        story: 'The lantern machine uses 2x + 1 sparks when x torches are lit.',
        question: 'How many sparks are needed when x = 3?',
        options: [
            { text: '5', correct: false },
            { text: '6', correct: false },
            { text: '7', correct: true },
            { text: '9', correct: false }
        ],
        explanation: 'Substitute x = 3: 2(3) + 1 = 6 + 1 = 7.',
        points: 10
    },
    {
        id: 303,
        topic: 'algebra',
        difficulty: 'easy',
        chapter: 'Linear Equations',
        gradeBand: '7',
        learningGoal: 'Solve a one-step equation',
        story: 'A gate code says y - 4 = 9. Only the correct value of y opens the gate.',
        question: 'What is y?',
        options: [
            { text: '5', correct: false },
            { text: '13', correct: true },
            { text: '9', correct: false },
            { text: '36', correct: false }
        ],
        explanation: 'Add 4 to both sides: y = 9 + 4 = 13.',
        points: 10
    },
    {
        id: 304,
        topic: 'algebra',
        difficulty: 'medium',
        chapter: 'Algebraic Expressions',
        gradeBand: '7-8',
        learningGoal: 'Simplify like terms',
        story: 'The academy stores 3x blue crystals and 2x more blue crystals in the same vault.',
        question: 'What is the simplified expression for the total blue crystals?',
        options: [
            { text: '5x', correct: true },
            { text: '6x', correct: false },
            { text: 'x', correct: false },
            { text: '3x2', correct: false }
        ],
        explanation: 'Like terms can be added: 3x + 2x = 5x.',
        points: 20
    },
    {
        id: 305,
        topic: 'algebra',
        difficulty: 'medium',
        chapter: 'Linear Equations',
        gradeBand: '7-8',
        learningGoal: 'Solve a two-step equation',
        story: 'The clock tower resets only if 2m + 3 = 15.',
        question: 'What value of m resets the clock tower?',
        options: [
            { text: '6', correct: true },
            { text: '9', correct: false },
            { text: '12', correct: false },
            { text: '24', correct: false }
        ],
        explanation: 'Subtract 3 first: 2m = 12. Then divide by 2: m = 6.',
        points: 20
    },
    {
        id: 306,
        topic: 'algebra',
        difficulty: 'medium',
        chapter: 'Sequences and Patterns',
        gradeBand: '7-8',
        learningGoal: 'Recognize a linear pattern',
        story: 'Magic tiles glow in the pattern 5, 8, 11, 14, ... along the academy corridor.',
        question: 'What is the next number in the pattern?',
        options: [
            { text: '15', correct: false },
            { text: '16', correct: false },
            { text: '17', correct: true },
            { text: '18', correct: false }
        ],
        explanation: 'Each term increases by 3, so after 14 comes 17.',
        points: 20
    },
    {
        id: 307,
        topic: 'algebra',
        difficulty: 'hard',
        chapter: 'Linear Equations',
        gradeBand: '8',
        learningGoal: 'Solve equations with variables on both sides conceptually',
        story: 'The balance scale stays level only when 3x + 2 = x + 10.',
        question: 'What value of x keeps the scale balanced?',
        options: [
            { text: '2', correct: false },
            { text: '4', correct: true },
            { text: '6', correct: false },
            { text: '8', correct: false }
        ],
        explanation: 'Subtract x from both sides to get 2x + 2 = 10. Then 2x = 8, so x = 4.',
        points: 30
    },
    {
        id: 308,
        topic: 'algebra',
        difficulty: 'hard',
        chapter: 'Algebraic Expressions',
        gradeBand: '8',
        learningGoal: 'Use substitution in a formula',
        story: 'A flying cart uses the rule fare = 4d + 6, where d is distance in kilometers.',
        question: 'What is the fare when d = 5?',
        options: [
            { text: '20', correct: false },
            { text: '26', correct: true },
            { text: '11', correct: false },
            { text: '45', correct: false }
        ],
        explanation: 'Substitute d = 5: 4(5) + 6 = 20 + 6 = 26.',
        points: 30
    },
    {
        id: 309,
        topic: 'algebra',
        difficulty: 'hard',
        chapter: 'Sequences and Patterns',
        gradeBand: '8',
        learningGoal: 'Find the nth term from a simple arithmetic pattern',
        story: 'A stair spell grows as 4, 7, 10, 13, ... . The academy asks for the 6th term.',
        question: 'What is the 6th term of the pattern?',
        options: [
            { text: '16', correct: false },
            { text: '19', correct: true },
            { text: '21', correct: false },
            { text: '24', correct: false }
        ],
        explanation: 'The pattern adds 3 each time. The terms are 4, 7, 10, 13, 16, 19, so the 6th term is 19.',
        points: 30
    },
    {
        id: 310,
        topic: 'algebra',
        difficulty: 'hard',
        chapter: 'Linear Equations',
        gradeBand: '8',
        learningGoal: 'Solve a word problem using an equation',
        story: 'A quest shop charges a fixed 50 coins plus 15 coins per healing kit.',
        question: 'If the bill is 95 coins, how many healing kits were bought?',
        options: [
            { text: '2', correct: false },
            { text: '3', correct: true },
            { text: '4', correct: false },
            { text: '5', correct: false }
        ],
        explanation: 'Let k be the number of kits. Then 50 + 15k = 95. Subtract 50 to get 15k = 45, so k = 3.',
        points: 30
    }
];

const geometryQuestions = [
    {
        id: 401,
        topic: 'geometry',
        difficulty: 'easy',
        chapter: 'Lines and Angles',
        gradeBand: '6',
        learningGoal: 'Identify parallel lines',
        story: 'The castle bridge has two rails that never meet, no matter how far they extend.',
        question: 'What do we call lines that never meet and stay the same distance apart?',
        options: [
            { text: 'Intersecting lines', correct: false },
            { text: 'Parallel lines', correct: true },
            { text: 'Perpendicular lines', correct: false },
            { text: 'Curved lines', correct: false }
        ],
        explanation: 'Parallel lines stay the same distance apart and do not meet.',
        points: 10
    },
    {
        id: 402,
        topic: 'geometry',
        difficulty: 'easy',
        chapter: 'Angles',
        gradeBand: '6',
        learningGoal: 'Classify acute angles',
        story: 'An arrow sign opens to 40 degrees at the garden gate.',
        question: 'What type of angle is 40 degrees?',
        options: [
            { text: 'Acute angle', correct: true },
            { text: 'Right angle', correct: false },
            { text: 'Obtuse angle', correct: false },
            { text: 'Straight angle', correct: false }
        ],
        explanation: 'An acute angle is less than 90 degrees, so 40 degrees is acute.',
        points: 10
    },
    {
        id: 403,
        topic: 'geometry',
        difficulty: 'easy',
        chapter: 'Triangles and Quadrilaterals',
        gradeBand: '6-7',
        learningGoal: 'Recognize polygons by number of sides',
        story: 'The guardian asks you to sort shields by shape before entering the hall.',
        question: 'How many sides does a hexagon have?',
        options: [
            { text: '5', correct: false },
            { text: '6', correct: true },
            { text: '7', correct: false },
            { text: '8', correct: false }
        ],
        explanation: 'A hexagon is a polygon with 6 sides.',
        points: 10
    },
    {
        id: 404,
        topic: 'geometry',
        difficulty: 'medium',
        chapter: 'Triangles',
        gradeBand: '7',
        learningGoal: 'Use the angle sum of a triangle',
        story: 'The beacon triangle has two known angles: 50 degrees and 60 degrees.',
        question: 'What is the third angle of the triangle?',
        options: [
            { text: '70 degrees', correct: true },
            { text: '80 degrees', correct: false },
            { text: '90 degrees', correct: false },
            { text: '110 degrees', correct: false }
        ],
        explanation: 'The angles of a triangle add to 180 degrees. So 180 - 50 - 60 = 70 degrees.',
        points: 20
    },
    {
        id: 405,
        topic: 'geometry',
        difficulty: 'medium',
        chapter: 'Perimeter',
        gradeBand: '6-7',
        learningGoal: 'Calculate perimeter',
        story: 'You are fencing a rectangular herb patch that is 8 m long and 3 m wide.',
        question: 'How much fence is needed?',
        options: [
            { text: '11 m', correct: false },
            { text: '22 m', correct: true },
            { text: '24 m', correct: false },
            { text: '48 m', correct: false }
        ],
        explanation: 'Perimeter = 2(8 + 3) = 2 x 11 = 22 m.',
        points: 20
    },
    {
        id: 406,
        topic: 'geometry',
        difficulty: 'medium',
        chapter: 'Area',
        gradeBand: '7',
        learningGoal: 'Find the area of a rectangle',
        story: 'The royal carpet room needs a floor cover for a rectangle 7 m by 5 m.',
        question: 'What is the area of the floor?',
        options: [
            { text: '12 square m', correct: false },
            { text: '24 square m', correct: false },
            { text: '35 square m', correct: true },
            { text: '70 square m', correct: false }
        ],
        explanation: 'Area of a rectangle = length x width = 7 x 5 = 35 square meters.',
        points: 20
    },
    {
        id: 407,
        topic: 'geometry',
        difficulty: 'hard',
        chapter: 'Circles',
        gradeBand: '8',
        learningGoal: 'Use the diameter-radius relationship',
        story: 'A moon fountain has a circular top with radius 6 cm.',
        question: 'What is its diameter?',
        options: [
            { text: '3 cm', correct: false },
            { text: '6 cm', correct: false },
            { text: '12 cm', correct: true },
            { text: '18 cm', correct: false }
        ],
        explanation: 'The diameter is twice the radius, so 2 x 6 = 12 cm.',
        points: 30
    },
    {
        id: 408,
        topic: 'geometry',
        difficulty: 'hard',
        chapter: 'Area of Triangle',
        gradeBand: '8',
        learningGoal: 'Find the area of a triangle',
        story: 'A triangular banner has base 10 cm and height 6 cm.',
        question: 'What is the area of the banner?',
        options: [
            { text: '16 square cm', correct: false },
            { text: '30 square cm', correct: true },
            { text: '60 square cm', correct: false },
            { text: '20 square cm', correct: false }
        ],
        explanation: 'Area of a triangle = 1/2 x base x height = 1/2 x 10 x 6 = 30 square cm.',
        points: 30
    },
    {
        id: 409,
        topic: 'geometry',
        difficulty: 'hard',
        chapter: 'Quadrilaterals',
        gradeBand: '7-8',
        learningGoal: 'Reason about properties of shapes',
        story: 'The guardian shows a shape with four equal sides and four right angles.',
        question: 'Which shape is being described?',
        options: [
            { text: 'Rectangle', correct: false },
            { text: 'Rhombus', correct: false },
            { text: 'Square', correct: true },
            { text: 'Trapezium', correct: false }
        ],
        explanation: 'A square has four equal sides and four right angles.',
        points: 30
    },
    {
        id: 410,
        topic: 'geometry',
        difficulty: 'hard',
        chapter: 'Angles',
        gradeBand: '8',
        learningGoal: 'Find a missing angle on a straight line',
        story: 'Two light beams form adjacent angles of 112 degrees and x on a straight path.',
        question: 'What is the value of x?',
        options: [
            { text: '58 degrees', correct: false },
            { text: '68 degrees', correct: true },
            { text: '72 degrees', correct: false },
            { text: '112 degrees', correct: false }
        ],
        explanation: 'Angles on a straight line add to 180 degrees, so x = 180 - 112 = 68 degrees.',
        points: 30
    }
];

const worlds = [
    {
        id: 'integers',
        name: 'Integers Island',
        emoji: '🏝️',
        description: 'Federal Board chapter cluster: integers, directed numbers, comparison, and integer operations.',
        villain: 'Integer Monster',
        color: '#2196F3',
        story: 'Climb cliffs, dive below sea level, and master positive and negative numbers through rescue missions.',
        chapterFocus: ['Integers', 'Directed numbers', 'Integer operations'],
        grades: ['Grade 6', 'Grade 7'],
        learningArc: 'Start with number-line movement, then move to signed operations and multi-step reasoning.'
    },
    {
        id: 'fractions',
        name: 'Fractions Forest',
        emoji: '🌲',
        description: 'Federal Board chapter cluster: fractions, decimals, equivalent forms, and percentages.',
        villain: 'Fraction Thief',
        color: '#4CAF50',
        story: 'Restore fair sharing in the forest by combining, comparing, and converting parts of whole quantities.',
        chapterFocus: ['Fractions', 'Decimals', 'Percentages'],
        grades: ['Grade 6', 'Grade 7', 'Grade 8'],
        learningArc: 'Move from equal parts and equivalence to decimal comparison and percentage reasoning.'
    },
    {
        id: 'algebra',
        name: 'Algebra Academy',
        emoji: '📚',
        description: 'Federal Board chapter cluster: algebraic expressions, linear equations, and simple sequences.',
        villain: 'Algebra Sphinx',
        color: '#9C27B0',
        story: 'Decode formulas, solve equation gates, and uncover patterns hidden inside the academy.',
        chapterFocus: ['Algebraic expressions', 'Linear equations', 'Patterns and sequences'],
        grades: ['Grade 7', 'Grade 8'],
        learningArc: 'Build from substitution and one-step equations toward two-step equations and pattern rules.'
    },
    {
        id: 'geometry',
        name: 'Geometry Garden',
        emoji: '🏛️',
        description: 'Federal Board chapter cluster: lines, angles, triangles, quadrilaterals, perimeter, and area.',
        villain: 'Geometry Guardian',
        color: '#FF9800',
        story: 'Train with shapes, measure royal spaces, and unlock geometry gates with accurate reasoning.',
        chapterFocus: ['Lines and angles', 'Triangles and quadrilaterals', 'Perimeter and area'],
        grades: ['Grade 6', 'Grade 7', 'Grade 8'],
        learningArc: 'Begin with shape recognition, then work through angle facts, perimeter, area, and geometry relationships.'
    }
];

const achievements = [
    {
        id: 'first_question',
        name: 'First Steps',
        description: 'Answer your first syllabus challenge correctly',
        icon: '🎯',
        condition: (stats) => stats.correctAnswers >= 1
    },
    {
        id: 'speed_demon',
        name: 'Quick Thinker',
        description: 'Answer 3 questions in under 1 minute',
        icon: '⚡',
        condition: (stats) => (stats.speedCount || 0) >= 3
    },
    {
        id: 'perfect_five',
        name: 'Perfect Five',
        description: 'Get 5 questions correct in a row',
        icon: '🌟',
        condition: (stats) => (stats.streak || 0) >= 5
    },
    {
        id: 'on_fire',
        name: 'Study Streak',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        condition: (stats) => (stats.dayStreak || 0) >= 7
    },
    {
        id: 'integer_master',
        name: 'Integer Master',
        description: 'Complete Integers Island',
        icon: '🏝️',
        condition: (stats) => (stats.worldsCompleted || []).includes('integers')
    },
    {
        id: 'fraction_expert',
        name: 'Fraction Expert',
        description: 'Complete Fractions Forest',
        icon: '🌲',
        condition: (stats) => (stats.worldsCompleted || []).includes('fractions')
    },
    {
        id: 'algebra_scholar',
        name: 'Algebra Scholar',
        description: 'Complete Algebra Academy',
        icon: '📚',
        condition: (stats) => (stats.worldsCompleted || []).includes('algebra')
    },
    {
        id: 'geometry_artist',
        name: 'Geometry Guardian',
        description: 'Complete Geometry Garden',
        icon: '🏛️',
        condition: (stats) => (stats.worldsCompleted || []).includes('geometry')
    },
    {
        id: 'legend',
        name: 'Math Legend',
        description: 'Complete all 4 worlds',
        icon: '👑',
        condition: (stats) => (stats.worldsCompleted || []).length === 4
    },
    {
        id: 'high_scorer',
        name: 'Royal High Scorer',
        description: 'Earn 1000 points',
        icon: '💰',
        condition: (stats) => stats.totalPoints >= 1000
    }
];

const characterDialogs = {
    mathWizard: {
        welcome: 'Welcome to the kingdom. Each quest is built from real Grade 6-8 math chapters.',
        correct: 'Excellent. You solved the idea and not just the surface of the question.',
        incorrect: 'Not yet. Read the explanation and try the same idea with more confidence.',
        hint: 'Look for the chapter skill first, then use the story details.',
        encouragement: 'Steady progress beats rushing. Keep going.'
    },
    integerMonster: {
        challenge: 'I guard the integer cliffs. Can you track rises, falls, and sign changes correctly?',
        correct: 'Strong work. You handled the direction of the numbers properly.',
        incorrect: 'Check whether the move was upward, downward, gain, or loss.'
    },
    fractionThief: {
        challenge: 'I split the forest treasures into parts. Can you tell which parts really match?',
        correct: 'You caught the right part of the whole.',
        incorrect: 'Count the equal parts carefully before choosing again.'
    },
    algebraSphinx: {
        challenge: 'Every symbol hides a number. Show me you can uncover it step by step.',
        correct: 'Well reasoned. Your equation work is precise.',
        incorrect: 'Slow down and undo the operations one at a time.'
    },
    geometryGuardian: {
        challenge: 'Shapes reward careful thinkers. Measure, compare, and justify your answer.',
        correct: 'Accurate and clear. That is how geometry is mastered.',
        incorrect: 'Return to the shape facts and check the formula or angle rule.'
    }
};

window.gameData = {
    diagnosticQuestions,
    integersQuestions,
    fractionsQuestions,
    algebraQuestions,
    geometryQuestions,
    worlds,
    achievements,
    characterDialogs,

    getWorldQuestions: function(worldId) {
        const map = {
            integers: this.integersQuestions,
            fractions: this.fractionsQuestions,
            algebra: this.algebraQuestions,
            geometry: this.geometryQuestions
        };

        return map[worldId] || [];
    },

    getQuestionById: function(questionId) {
        const allQuestions = [
            ...this.diagnosticQuestions,
            ...this.integersQuestions,
            ...this.fractionsQuestions,
            ...this.algebraQuestions,
            ...this.geometryQuestions
        ];

        return allQuestions.find((question) => question.id === questionId);
    }
};

console.log('Game data loaded successfully.');