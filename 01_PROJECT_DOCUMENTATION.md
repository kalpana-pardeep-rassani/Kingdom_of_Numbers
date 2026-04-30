# Kingdom of Numbers - Complete Project Documentation

**Version:** 1.0  
**Date:** April 2026  
**Course:** Graduation Project  
**Curriculum:** Federal Board Pakistan (Grade 6-8 Mathematics)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Data Structures & Schemas](#data-structures--schemas)
4. [Module Documentation](#module-documentation)
5. [Game Content Format](#game-content-format)
6. [Achievement System](#achievement-system)
7. [Testing Procedures](#testing-procedures)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Browser Compatibility](#browser-compatibility)
10. [Performance Metrics](#performance-metrics)

---

## Project Overview

### Problem Statement
Grade 6-8 students in Pakistan often find mathematics learning monotonous and disconnected from real-world applications. Traditional textbooks don't provide immediate feedback or personalized learning paths. There's a need for an engaging, gamified math learning platform that motivates students while adapting to their individual learning needs.

### Solution
**Kingdom of Numbers** is a web-based gamified math learning platform that transforms mathematics education into an adventure. Students:
- Create personal accounts to track progress
- Complete a diagnostic assessment to identify weak areas
- Battle through 4 themed worlds (Integers Island, Fractions Forest, Algebra Academy, Geometry Garden)
- Answer increasingly challenging questions
- Earn achievements and accumulate points
- View detailed progress analytics

### Target Users
- Grade 6-8 students (ages 11-14)
- Primary: Federal Board Pakistan curriculum
- Secondary: Any region using similar math curricula

### Key Features
✅ **Personalized Learning**: Diagnostic test identifies weak topics  
✅ **Gamified Progression**: 4 unique worlds with villain characters  
✅ **Achievement System**: 8 achievements unlock through milestones  
✅ **Real-time Feedback**: Immediate answer validation with explanations  
✅ **Progress Tracking**: Statistics, accuracy percentage, completion tracking  
✅ **Offline Capable**: All data stored locally in browser  
✅ **Responsive Design**: Works on mobile, tablet, and desktop  
✅ **Accessibility**: Large buttons, clear typography, high contrast colors

---

## System Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: Browser Local Storage API
- **No Backend**: Client-side only, no server dependency
- **No Build Tools**: Direct browser execution, copy-paste deployable

### Architecture Pattern: 5-Layer Modular Design

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Data Layer (Pure Content)                          │
│ └─ data.js: Game questions, worlds, achievements, dialogs   │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Storage & Utility Layer (No Dependencies)          │
│ ├─ storage.js: Local Storage CRUD operations                │
│ ├─ characters.js: Character definitions                     │
│ └─ utils.js: 30+ helper functions                           │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: UI Layer (Rendering)                               │
│ └─ ui.js: All page renders, HTML generation                 │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Business Logic (Core Game Mechanics)               │
│ ├─ auth.js: Login, signup, session management               │
│ └─ game.js: Question logic, achievements, statistics        │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: Application Controller (Main Router)               │
│ └─ app.js: Page routing, state management, event handlers   │
└─────────────────────────────────────────────────────────────┘

Execution Order:
index.html loads: data.js → storage.js → characters.js → utils.js → auth.js → game.js → ui.js → app.js
```

### Application Flow

```
START
  ↓
LOGIN PAGE
  ├─ Email/Password
  └─ Link to Signup
  ↓
SIGNUP PAGE
  ├─ Name, Class, Email, Password
  └─ Creates account in Local Storage
  ↓
DIAGNOSTIC TEST
  ├─ 10 mixed-topic questions
  ├─ Identifies weak topics
  └─ Routes to recommended worlds
  ↓
WORLD SELECTION
  ├─ 4 worlds: Integers, Fractions, Algebra, Geometry
  ├─ Shows progress per world
  └─ Player selects world
  ↓
GAME QUESTIONS
  ├─ Loop: Question → Answer → Feedback → Next
  ├─ Tracks progress
  ├─ Calculates points
  └─ Checks achievements
  ↓
WORLD COMPLETE
  ├─ Celebration screen
  └─ Back to world selection
  ↓
PROGRESS PAGE
  ├─ Statistics dashboard
  ├─ World completion grid
  ├─ Achievements list
  └─ Accuracy percentage
  ↓
REPEAT or LOGOUT
```

---

## Data Structures & Schemas

### User Data Schema (Local Storage: `kon_users`)
```javascript
{
  "userId": "unique-uuid-string",
  "name": "John Student",
  "email": "john@example.com",
  "password": "hashed-password-string",
  "class": "7",  // Grade level: "6", "7", or "8"
  "totalPoints": 250,
  "createdDate": "2026-04-29T12:00:00.000Z",
  "lastLoginDate": "2026-04-29T14:30:00.000Z"
}
```

### Current Session (Local Storage: `kon_currentUser`)
```javascript
{
  // Same structure as User Data
}
```

### Progress Data Schema (Local Storage: `kon_progress_{userId}`)
```javascript
{
  "userId": "unique-uuid-string",
  "worlds": [
    {
      "worldId": "integers",
      "completedLevels": 5,
      "totalLevels": 10,
      "points": 120,
      "levels": [
        {
          "levelId": 101,
          "completed": true,
          "points": 30,
          "completedDate": "2026-04-29T12:05:00.000Z"
        },
        // ... more levels
      ]
    },
    // ... other worlds (fractions, algebra, geometry)
  ]
}
```

### Statistics Schema (Local Storage: `kon_stats_{userId}`)
```javascript
{
  "userId": "unique-uuid-string",
  "totalQuestionsAnswered": 23,
  "correctAnswers": 18,
  "incorrectAnswers": 5,
  "streak": 3,  // Current consecutive correct
  "longestStreak": 7,  // Best consecutive correct
  "lastActivityDate": "2026-04-29T14:30:00.000Z",
  "topicsProgress": {
    "integers": { "attempted": 5, "correct": 4, "percentage": 80 },
    "fractions": { "attempted": 8, "correct": 6, "percentage": 75 },
    "algebra": { "attempted": 5, "correct": 5, "percentage": 100 },
    "geometry": { "attempted": 5, "correct": 3, "percentage": 60 }
  },
  "worldsCompleted": ["integers", "fractions"],
  "speedCount": 2  // Questions answered in < 1 minute
}
```

### Game Question Schema
```javascript
{
  "id": 101,  // Unique question ID (101-110: Integers, 201-210: Fractions, etc.)
  "topic": "integers",  // Or: fractions, algebra, geometry
  "difficulty": "easy",  // Or: medium, hard
  "question": "A knight has 10 gold coins. He finds 5 more. How many does he have now?",
  "story": "On Integers Island, a brave knight discovers treasure! 🏰",
  "options": [
    { "text": "5", "correct": false },
    { "text": "15", "correct": true },
    { "text": "50", "correct": false },
    { "text": "10", "correct": false }
  ],
  "explanation": "10 + 5 = 15 gold coins! The knight is rich! 💰"
}
```

### Achievement Schema
```javascript
{
  "id": "first_steps",
  "title": "First Steps",
  "description": "Answer your first question correctly",
  "icon": "🎯",
  "condition": (stats) => stats.correctAnswers >= 1,
  "unlocked": false
}
```

---

## Module Documentation

### 1. data.js (600+ lines)
**Purpose**: Pure game content - questions, worlds, achievements, dialogs  
**No Dependencies**: Loaded first, can be loaded independently

#### Key Exports
```javascript
window.gameData = {
  // Questions organized by world
  diagnosticQuestions: [...],
  integersQuestions: [...],
  fractionsQuestions: [...],
  algebraQuestions: [...],
  geometryQuestions: [...],
  
  // World definitions
  worlds: [...],
  
  // Achievement definitions
  achievements: [...],
  
  // Character dialogs
  characterDialogs: {...},
  
  // Helper methods
  getWorldQuestions(worldId) { ... },
  getQuestionById(questionId) { ... }
}
```

#### Sample Content
- **50 total questions**: 10 per world + 10 diagnostic
- **Difficulty distribution**: 3 easy, 3 medium, 4 hard per world
- **8 achievements**: Progressive unlocking based on performance metrics
- **5 characters**: Math Wizard (guide) + 4 villains (per world)

---

### 2. storage.js (300+ lines)
**Purpose**: Local Storage abstraction layer - persistent data CRUD  
**Dependencies**: None

#### Key Methods
```javascript
// User Management
createUser(userData)
getAllUsers()
getUserByEmail(email)
getUserById(userId)
updateUser(userId, updates)

// Session Management
setCurrentUser(user)
getCurrentUser()
isLoggedIn()
logout()

// Progress Tracking
initializeProgress(userId)
getProgress(userId)
saveProgress(userId, progressData)
updateWorldProgress(userId, worldId, levelId, points)

// Statistics
initializeStats(userId)
getStats(userId)
updateStats(userId, isCorrect)

// Achievements
getAchievements(userId)
unlockAchievement(userId, achievementId)

// Diagnostic
saveDiagnosticResults(userId, results)
getDiagnosticResults(userId)
hasDiagnosticTest(userId)

// Utilities
generateId()
hashPassword(password)
verifyPassword(password, hash)
resetAllData()
```

#### Data Namespace
All Local Storage keys prefixed with `kon_`:
- `kon_users`: All user accounts
- `kon_currentUser`: Active session user
- `kon_progress_{userId}`: Per-user progress
- `kon_stats_{userId}`: Per-user statistics
- `kon_achievements_{userId}`: Per-user achievements

---

### 3. characters.js (150+ lines)
**Purpose**: Character system - personalities and dialogs  
**Dependencies**: None

#### Characters
```javascript
{
  mathWizard: {
    name: "Math Wizard 🧙",
    emoji: "🧙",
    color: "#2E7D32",
    role: "guide",
    dialogs: { welcome: [...], correct: [...], incorrect: [...], ... }
  },
  
  integerMonster: {
    name: "Integer Monster 👹",
    emoji: "👹",
    color: "#2196F3",  // Integers theme color
    role: "villain",
    dialogs: { ... }
  },
  
  // ... fractionThief, algebraSphinx, geometryGuardian
}
```

#### Key Methods
```javascript
getCharacterDialog(characterKey, dialogType)
  Returns: Random dialog string from character's dialog array

getCharacterEmoji(characterKey)
  Returns: Character's emoji

getCharacterForWorld(worldId)
  Returns: Villain character for given world
```

---

### 4. utils.js (200+ lines)
**Purpose**: 30+ utility helper functions  
**Dependencies**: None

#### Categories
**UUID/ID Generation**
```javascript
generateId()  // Returns unique UUID
```

**Array Utilities**
```javascript
shuffleArray(array)  // Fisher-Yates shuffle
randomChoice(array)  // Random element
```

**Validation**
```javascript
validateEmail(email)
validatePassword(password)  // Min 6 characters
validateForm(formData, rules)  // Multi-field validation
```

**Date/Time**
```javascript
getCurrentDate()
getCurrentTime()
formatDate(dateString)  // "April 29, 2026"
formatTime(seconds)  // "MM:SS"
secondsToTime(seconds)  // Human readable
```

**Performance**
```javascript
debounce(func, delay)  // Delayed execution
throttle(func, delay)  // Rate limiting
```

**Objects**
```javascript
deepClone(obj)  // Recursive cloning
```

**Math**
```javascript
calculatePercentage(value, total)
calculatePoints(difficulty, timeSpent)
getDifficultyColor(difficulty)  // CSS color
getDifficultyEmoji(difficulty)  // Visual indicator
```

**DOM**
```javascript
showNotification(message, type, duration)
removeElement(selector)
clearElement(selector)
scrollToElement(selector)
isElementVisible(selector)
copyToClipboard(text)
```

**Text**
```javascript
capitalize(str)
getInitials(name)
getEncouragement()  // Random motivational message
```

---

### 5. auth.js (150+ lines)
**Purpose**: Authentication and session management  
**Dependencies**: storage.js, utils.js

#### Key Methods
```javascript
login(email, password, callback)
  // Validates credentials, creates session
  // Callback: {success: bool, user: userData, error: string}

signup(formData, callback)
  // Creates account, initializes progress/stats
  // Callback: {success: bool, user: userData, errors: {field: msg}}

logout()
  // Clears session

isAuthenticated()
  // Returns: boolean

getCurrentUser()
  // Returns: user object or null

updateProfile(userId, updates, callback)
  // Updates user data
```

#### Security Notes
⚠️ **Password Hashing**: Currently uses simple hash (NOT cryptographically secure)  
**Recommendation**: Use bcrypt or similar for production

---

### 6. game.js (300+ lines)
**Purpose**: Game mechanics and progression  
**Dependencies**: storage.js, utils.js, data.js

#### Key Methods
```javascript
// Question Management
getDiagnosticQuestions()
getWorldQuestions(worldId, difficulty = null)
getQuestion(questionId)
getNextQuestion(worldId, difficulty)

// Answer Validation
validateAnswer(questionId, selectedOption)
  // Returns: {correct: bool, explanation: string, correctAnswer: string}

// Points Calculation
calculatePoints(difficulty, timeSpent = 0)
  // Returns: points earned

// Progress Recording
completeQuestion(worldId, questionId, isCorrect, points)
getWorldProgress(worldId)
getAllProgress()
getWorldCompletionPercentage(worldId)

// Achievement System
checkAchievements()
  // Evaluates all conditions, unlocks earned achievements
  // Returns: [unlockedAchievements]

getAchievements()
  // Returns: user's achievements object

// Diagnostic Test
runDiagnosticTest(answers, callback)
  // Analyzes answers by topic
  // Callback: {success: bool, results: {...}}

getRecommendations()
  // Returns: [worldIds] ordered by weakness

// Statistics
getStatistics()
  // Returns: aggregated stats object
```

#### Achievement Unlocking Conditions
- **First Steps**: 1 correct answer
- **On Fire**: 3 consecutive correct
- **Perfect Five**: 5 questions answered perfectly in one session
- **Speed Demon**: 3 questions answered in < 1 minute
- **Integers Master**: Complete Integers world
- **Fractions Master**: Complete Fractions world
- **Algebra Master**: Complete Algebra world
- **Legend**: Complete all 4 worlds

---

### 7. ui.js (600+ lines)
**Purpose**: HTML rendering for all 8 screens  
**Dependencies**: data.js, characters.js, utils.js

#### Pages Rendered
```javascript
renderLoginPage()      // Email/password login
renderSignupPage()     // Registration form
renderDashboard()      // Welcome + stats + actions
renderWorlds()         // 4 world cards
renderGameQuestion()   // Question display
renderQuestionResult() // Answer feedback card
renderProgress()       // Stats + achievements
renderProfile()        // User info
renderDiagnosticTest() // 10-question diagnostic
renderWorldComplete()  // Celebration screen
```

#### Key Features
- **Responsive HTML**: All screens mobile-first
- **Dynamic Content**: JavaScript template literals
- **Event Listeners**: Form submissions and button clicks
- **Animations**: CSS classes for transitions

---

### 8. app.js (350+ lines)
**Purpose**: Main application controller and router  
**Dependencies**: All modules

#### App State
```javascript
appState: {
  currentUser: null,
  currentPage: 'login',
  currentWorld: null,
  currentQuestion: null,
  gameAnswers: {},
  diagnosticAnswers: {},
  isDiagnosticTest: false
}
```

#### Key Methods
```javascript
init()
  // Checks auth, initializes UI, sets up listeners

showPage(pageName)
  // Router: switches between 8 pages
  // Pages: login, signup, dashboard, diagnostic, worlds, game, progress, profile

handleLogin()
handleSignup()
selectWorld(worldId)
showGamePage(worldId)
handleGameAnswer(worldId, questionId, answer, buttonElement)
submitDiagnosticTest()
logout()
resetAllData()
```

#### Event Flow
1. `DOMContentLoaded` → `app.init()`
2. Check authentication → show login or dashboard
3. User actions → `handleLogin()`, `handleSignup()`, etc.
4. Page changes via `showPage()`
5. Callbacks update app state and rerender UI

---

## Game Content Format

### Adding New Questions

#### Step 1: Define Question Object
```javascript
{
  id: 111,  // Next sequential ID for world (100s for Integers)
  topic: "integers",
  difficulty: "easy",  // or medium, hard
  question: "Your question text here?",
  story: "Narrative context for the question",
  options: [
    { text: "Wrong option 1", correct: false },
    { text: "Correct answer", correct: true },
    { text: "Wrong option 2", correct: false },
    { text: "Wrong option 3", correct: false }
  ],
  explanation: "Why this answer is correct and explanation of concept"
}
```

#### Step 2: Add to data.js
```javascript
const integersQuestions = [
  // ... existing questions
  {
    id: 111,
    topic: "integers",
    difficulty: "easy",
    // ... etc
  }
];
```

#### Step 3: Update Totals
- Keep 10 questions per world
- Keep distribution: 3 easy, 3 medium, 4 hard
- Ensure IDs don't duplicate

---

## Achievement System

### Achievement Conditions
All conditions evaluate `stats` object:

```javascript
{
  totalQuestionsAnswered: 25,
  correctAnswers: 20,
  streak: 3,
  longestStreak: 7,
  topicsProgress: {...},
  worldsCompleted: ["integers"],
  speedCount: 2
}
```

### Adding New Achievements

```javascript
{
  id: "unique-id",
  title: "Achievement Name",
  description: "What does this achievement mean?",
  icon: "emoji",
  condition: (stats) => {
    // Return true when achievement should unlock
    return stats.correctAnswers >= 50;
  },
  unlocked: false
}
```

---

## Testing Procedures

### Manual Test Checklist

#### 1. Authentication
- [ ] Signup with valid data creates account
- [ ] Signup with invalid email shows error
- [ ] Signup with password < 6 chars shows error
- [ ] Login with correct credentials works
- [ ] Login with wrong password shows error
- [ ] Logout clears session
- [ ] Reload page remembers logged-in user

#### 2. Diagnostic Test
- [ ] All 10 questions display
- [ ] Radio buttons work
- [ ] Submit validates all answered
- [ ] Results analyzed by topic
- [ ] User routed to worlds after

#### 3. World Selection
- [ ] All 4 worlds display
- [ ] Progress bars show correct % (0% initially)
- [ ] World count shows 0/10 initially
- [ ] Clicking START goes to first unanswered question

#### 4. Game Gameplay
- [ ] Question displays with villain character
- [ ] Answer buttons work
- [ ] Correct answer shows ✅ with explanation and points
- [ ] Incorrect answer shows ❌ with explanation (0 points)
- [ ] "Next Question" button shows next unanswered question
- [ ] Questions progress in order (not backwards or random)
- [ ] Progress updated after each answer
- [ ] Achievement unlocks trigger notifications
- [ ] World complete screen shows after 10 questions answered

#### 5. Progress Tracking
- [ ] Dashboard stats update in real-time
- [ ] Progress page shows all worlds
- [ ] Progress bars fill as questions answered
- [ ] Accuracy percentage calculated correctly
- [ ] Achievements display with descriptions

#### 6. Data Persistence
- [ ] Close browser and reopen - user still logged in
- [ ] Progress saved across sessions
- [ ] Stats persist
- [ ] Achievements persist

#### 7. UI/UX
- [ ] All pages render correctly
- [ ] Mobile responsive (test on 375px width)
- [ ] Tablet responsive (test on 768px width)
- [ ] Desktop responsive (test on 1920px width)
- [ ] Text readable
- [ ] Buttons clickable
- [ ] No console errors

#### 8. Edge Cases
- [ ] All questions in world answered → complete screen
- [ ] Going back to world and continuing → shows next unanswered
- [ ] Multiple answer attempts tracked correctly
- [ ] Stats accumulate correctly

---

## Troubleshooting Guide

### Issue: "Application not ready" Alert
**Cause**: Modules not fully loaded when form submitted  
**Solution**: 
1. Wait 2-3 seconds after page load before interacting
2. Refresh page if issue persists
3. Check browser console for errors

### Issue: Modules Undefined (TypeError)
**Cause**: Script loading order issue  
**Solution**:
1. Check `index.html` script loading order - must be:
   - data.js → storage.js → characters.js → utils.js → auth.js → game.js → ui.js → app.js
2. Check for syntax errors in files: `node -c js/file.js`
3. Ensure window.load event fires: Check browser DevTools > Console

### Issue: Data Not Saving (Progress Lost)
**Cause**: Local Storage disabled or full  
**Solution**:
1. Check Local Storage enabled in browser settings
2. Clear browser cache and storage
3. Check storage quota: `localStorage.length`
4. Test with new user account

### Issue: Questions Showing Backwards
**Cause**: Progress not properly tracked  
**Solution**:
1. Clear browser Local Storage
2. Reload page
3. Create new account and test again

### Issue: Achievement Not Unlocking
**Cause**: Condition not met or achievements not checked  
**Solution**:
1. Check stats in console: `storage.getStats(storage.getCurrentUser().userId)`
2. Verify achievement condition in data.js
3. Complete another question to trigger checkAchievements()

### Issue: Character Dialog Not Showing
**Cause**: Character key mismatch  
**Solution**:
1. Check character.js for available characters
2. Verify world → character mapping correct
3. Check getCharacterForWorld(worldId) returns expected character

### Issue: Points Not Calculated
**Cause**: Difficulty not set on question or timeSpent issue  
**Solution**:
1. Verify question has difficulty: "easy", "medium", "hard"
2. Check utils.calculatePoints() receives valid difficulty
3. Test point calculation in console

---

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (not recommended)

### Required APIs
- **Local Storage**: All major browsers
- **ES6 JavaScript**: Arrow functions, template literals, const/let
- **CSS Grid/Flexbox**: All modern browsers

### Testing Recommendations
1. Test on Chrome, Firefox, Safari, Edge
2. Test on iOS Safari and Android Chrome
3. Test on screen sizes: 375px, 768px, 1920px
4. Test with JavaScript disabled (won't work - app requires JS)

---

## Performance Metrics

### Load Time Targets
- Initial page load: < 2 seconds
- Page transitions: < 300ms
- Question answer feedback: < 500ms
- Dashboard update: < 200ms

### Storage Usage
- Per user: ~20-50KB (questions included from data.js)
- All data persists in browser Local Storage (max ~10MB per domain)
- Supports 100+ user accounts on typical browser

### Scalability Notes
- Questions stored in memory (data.js)
- No network calls - all client-side
- Can support 10,000+ questions without performance impact
- Progress/stats linear growth with answers taken

---

## Maintenance & Future Enhancements

### Regular Maintenance
- [ ] Review error logs in browser console
- [ ] Update achievement conditions based on usage data
- [ ] Monitor Local Storage usage
- [ ] Test on new browser versions

### Possible Enhancements
1. **Backend Integration**: Store data on server for cloud sync
2. **Teacher Dashboard**: Track class progress
3. **More Worlds**: Extend to higher grades or other subjects
4. **Mobile App**: React Native/Flutter wrapper
5. **Multiplayer**: Leaderboards and challenges
6. **Accessibility**: Screen reader support, keyboard navigation
7. **Animations**: More engaging visual feedback
8. **Analytics**: Student learning patterns and weak areas

---

## Technical Implementation Notes

### Module Initialization Order
The application uses a strict dependency injection pattern. Scripts must load in order:

```html
<!-- Layer 1: Pure Data -->
<script src="js/data.js"></script>

<!-- Layer 2: Storage & Utils -->
<script src="js/storage.js"></script>
<script src="js/characters.js"></script>
<script src="js/utils.js"></script>

<!-- Layer 3: Business Logic -->
<script src="js/auth.js"></script>
<script src="js/game.js"></script>

<!-- Layer 4: UI Layer -->
<script src="js/ui.js"></script>

<!-- Layer 5: Application Controller -->
<script src="js/app.js"></script>

<!-- Layer 6: Initialize -->
<script>
  window.addEventListener('load', function() {
    if (typeof app !== 'undefined') {
      app.init();
    }
  });
</script>
```

### Error Prevention
- All auth methods check `typeof storage !== 'undefined'`
- All UI renders check object existence before access
- All callbacks include error handling
- Form validation prevents invalid data

### Data Consistency
- User email is unique key for login
- Password stored as hash (not plaintext)
- Progress keyed by userId for isolation
- All timestamps in ISO 8601 format

---

**End of Documentation**  
For questions or issues, refer to the Troubleshooting Guide section.
