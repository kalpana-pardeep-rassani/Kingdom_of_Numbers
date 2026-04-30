# Kingdom of Numbers

Kingdom of Numbers is a gamified educational web app for Grade 6 to 8 students following the Federal Board Pakistan mathematics syllabus. It turns practice into a story-based adventure with worlds, characters, rewards, progress tracking, and personalized recommendations.

## Project Summary

Students begin by creating an account and taking a 10-question diagnostic test. The app then identifies weak topics, recommends a learning path, and sends the player into one of four worlds:

- Integers Island
- Fractions Forest
- Algebra Academy
- Geometry Garden

Each world contains 10 story-based levels, one question per level. Correct answers award XP, speed bonuses, achievements, and saved progress in browser Local Storage.

## Features

- Signup and login with validation
- Diagnostic test with result analysis
- Personalized learning path based on weak topics
- 4 themed game worlds
- 40 world questions plus 10 diagnostic questions
- Story-based question scenarios
- Character-driven encouragement and villain dialogue
- XP, streaks, achievements, and progress dashboard
- Profile update form
- Local Storage CRUD for users, progress, stats, achievements, and diagnostic data
- Responsive kid-friendly UI for desktop and mobile

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Local Storage
- Node.js backend for account and admin APIs

Student mode can run from the frontend alone. Admin login and backend account APIs require the backend server.

## How to Run

1. Open the project folder in VS Code.
2. Frontend only for student mode:
	- Serve the root folder with Live Server or open `index.html` in a browser.
	- Use this for local student gameplay and Local Storage testing.
3. Backend required for admin mode and API-backed login:
	- Open a terminal in `backend`.
	- Run `npm install` once.
	- Run `npm start`.
	- Confirm the server prints `Kingdom of Numbers backend running on http://127.0.0.1:3100`.
4. Open the frontend at `http://127.0.0.1:5500/index.html` if using Live Server.
5. For admin access, open `http://127.0.0.1:5500/index.html?view=admin` while the backend is running.
6. Create a student account, complete the diagnostic test, and start playing recommended worlds.

You can also use the VS Code Live Server extension if you want automatic refresh while editing.

## Quick Run Checklist

Use this each time you reopen the project:

1. Start the frontend with Live Server from the project root.
2. Start the backend in a second terminal:

```powershell
cd backend
npm start
```

3. Verify backend health:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3100/api/v1/health
```

4. Open student mode:
	- `http://127.0.0.1:5500/index.html`
5. Open admin mode:
	- `http://127.0.0.1:5500/index.html?view=admin`
6. If admin login shows `Backend server unavailable`, check that nothing has stopped the backend terminal and that port `3100` is still listening.

Default admin account seeded by the backend:

- Email: `kalpanapardeeprassani@gmail.com`
- Password: `kp9999`

## Testing Checklist

Use this checklist during your final project demo:

1. Sign up with a new account.
2. Verify email and password validation.
3. Complete the diagnostic test.
4. Confirm weak and strong topics appear.
5. Start a recommended world.
6. Answer one level correctly and verify XP increases.
7. Open the dashboard and check progress updates.
8. Open the profile page and update the user details.
9. Refresh the browser and confirm saved progress remains.
10. Reset progress from the profile page and verify data changes.

## Local Storage Keys

The app stores data in these browser keys:

- kon_users
- kon_currentUser
- kon_progress
- kon_achievements
- kon_stats
- kon_diagnostic

## Project Deliverables Included

- Project planning document
- UI/UX design document
- Tech stack document
- Sample game content document
- Full project documentation
- Presentation slides content
- Demo video script
- README setup guide

## Future Improvements

- Teacher dashboard
- Parent progress portal
- More chapters and question banks
- Sound effects and richer character illustrations
- Downloadable student progress report
- Backend sync for cross-device access
