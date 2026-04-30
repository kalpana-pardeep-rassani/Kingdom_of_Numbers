# Account System Blueprint

## Goal

Replace the current browser-only account storage with a secure backend account system that supports:
- user signup, login, logout, and profile management
- structured progress and activity tracking
- admin search, filtering, analytics, and account management
- clean separation between frontend UI and backend data services

This blueprint is designed for the current Kingdom of Numbers app, which already has:
- login and signup UI
- profile page
- progress tracking
- diagnostic results
- world completion and score updates

## Current App Constraint

The existing app stores users, auth state, progress, and stats in Local Storage.

That is fine for a prototype, but it does not provide:
- secure authentication
- server-side admin visibility
- cross-device progress sync
- durable audit logs
- role-based access control

## Recommended System Structure

### Frontend
- Keep the current app UI for student flows.
- Replace Local Storage auth and data writes with API calls.
- Add a separate admin dashboard route set.
- Use a shared API service layer so UI components do not call fetch directly everywhere.

### Backend
- REST API with role-based access control.
- JWT access tokens with refresh token rotation.
- Password hashing with bcrypt or Argon2.
- Relational database for users, progress, activity, and admin reporting.
- Audit log table for admin and user actions.

### Database
- PostgreSQL is the recommended default.
- It supports structured relational data, filtering, indexing, analytics queries, and future reporting.

## Ready-to-Implement Project Layout

```text
frontend/
  src/
    api/
      authApi.ts
      usersApi.ts
      progressApi.ts
      adminApi.ts
    features/
      auth/
      profile/
      progress/
      admin/
    pages/
      LoginPage
      SignupPage
      ProfilePage
      DashboardPage
      AdminDashboardPage
      AdminUserDetailPage
    state/
      authStore.ts
      userStore.ts
      adminStore.ts
    utils/
      auth.ts
      date.ts
      validation.ts

backend/
  src/
    config/
      env.ts
      database.ts
    modules/
      auth/
        auth.controller.ts
        auth.service.ts
        auth.routes.ts
      users/
        users.controller.ts
        users.service.ts
        users.routes.ts
      progress/
        progress.controller.ts
        progress.service.ts
        progress.routes.ts
      analytics/
        analytics.controller.ts
        analytics.service.ts
        analytics.routes.ts
      admin/
        admin.controller.ts
        admin.service.ts
        admin.routes.ts
    middleware/
      authenticate.ts
      authorize.ts
      validateRequest.ts
      errorHandler.ts
    db/
      migrations/
      seeds/
    app.ts
    server.ts
```

## Roles

### Student
- sign up
- log in and out
- view and update own profile
- play the game
- submit answers
- view own progress and activity

### Admin
- log in through secure admin route
- view all users
- search and filter users
- open a user detail page
- inspect progress, scores, and activity history
- soft delete, suspend, or reset user accounts
- view system analytics

## Authentication Design

### Signup
- Student submits name, email, password.
- Backend validates input.
- Backend hashes password.
- Backend creates student user record.
- Backend returns access token, refresh token, and safe user payload.

### Login
- Student or admin submits email and password.
- Backend validates credentials.
- Backend returns signed access token and refresh token.
- Frontend stores access token in memory and refresh token in secure HttpOnly cookie if possible.

### Logout
- Backend revokes refresh token.
- Frontend clears session state.

### Security Rules
- Passwords never stored in plaintext.
- Refresh tokens stored server-side with revocation support.
- Admin routes require role = admin.
- Rate-limit login and signup endpoints.
- Write audit logs for admin actions.

## Main Data Flows

### Student Flow
1. Signup or login
2. Load profile and current progress
3. Start diagnostic or world
4. Submit answer results to backend
5. Backend updates progress, stats, activity history, and analytics aggregates
6. Frontend refreshes dashboard with latest values

### Admin Flow
1. Admin login
2. Open dashboard
3. View user list with filters
4. Open user detail page
5. Review progress, scores, recent activity, and account state
6. Apply management action if required

## Tracking Model

Track these items over time:
- total score
- total questions answered
- correct answer rate
- world completion rate
- diagnostic history
- login activity
- gameplay activity history
- last active date

## Simple Analytics to Show in Admin

- total users
- active users in last 7 days
- active users in last 30 days
- average total score
- average accuracy rate
- users by grade
- most played world
- lowest-performing topic cluster

## Admin Dashboard Layout

### Top Summary Row
- Total Users
- Active This Week
- Average Score
- Average Accuracy

### Second Row
- Search box
- Grade filter
- Status filter
- Sort selector

### Main Area
- Left: user table
- Right: quick analytics cards or charts

### User Table Columns
- Name
- Email
- Grade
- Role
- Status
- Total Score
- Worlds Completed
- Last Active
- Actions

### User Detail Page Layout

#### Header
- name
- email
- grade
- role
- status
- joined date

#### Section 1
- profile summary
- current totals

#### Section 2
- progress by world
- scores by topic

#### Section 3
- recent activity history
- login history

#### Section 4
- admin actions
  - suspend user
  - reset progress
  - delete user

## Frontend Migration Guidance for This Repo

Map existing modules like this:

- current auth.js -> call auth API instead of Local Storage methods
- current storage.js -> split into api storage and temporary cache helpers
- current game.js -> send answer results to backend after validation or shift validation server-side later
- current profile and progress UI -> read from API responses

## Suggested Implementation Order

1. Add backend auth and users module
2. Add PostgreSQL schema and migrations
3. Replace Local Storage signup/login with API auth
4. Add server-side progress tracking endpoints
5. Add admin login and user list page
6. Add user detail page and analytics
7. Add audit logging and account actions

## Practical MVP Scope

If you want the fastest useful version, build this first:
- signup
- login
- logout
- get current profile
- track progress snapshot
- admin list users
- admin user detail page
- admin analytics summary

That gives you a real account system without trying to finish every advanced admin feature in the first pass.