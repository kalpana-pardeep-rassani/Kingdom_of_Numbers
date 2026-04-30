# Account System API

## Authentication

### POST /api/v1/auth/signup

Create a student account.

Request body:

```json
{
  "name": "Kalpana",
  "email": "kalpana@example.com",
  "password": "SecurePass123!",
  "grade": "7"
}
```

Response:

```json
{
  "user": {
    "id": "usr_123",
    "name": "Kalpana",
    "email": "kalpana@example.com",
    "grade": "7",
    "role": "student"
  },
  "accessToken": "jwt-access-token"
}
```

### POST /api/v1/auth/login

Login for student or admin.

Request body:

```json
{
  "email": "kalpana@example.com",
  "password": "SecurePass123!"
}
```

Response:

```json
{
  "user": {
    "id": "usr_123",
    "name": "Kalpana",
    "email": "kalpana@example.com",
    "role": "student"
  },
  "accessToken": "jwt-access-token"
}
```

### POST /api/v1/auth/logout

Invalidate refresh token and end session.

### POST /api/v1/auth/refresh

Issue a new access token using a valid refresh token.

### GET /api/v1/auth/me

Return the currently authenticated user profile and role.

## Student Profile

### GET /api/v1/users/me

Get student profile.

### PATCH /api/v1/users/me

Update allowed profile fields.

Request body:

```json
{
  "name": "Kalpana Pardeep",
  "grade": "8",
  "avatar": "hero"
}
```

## Progress and Tracking

### GET /api/v1/progress/me

Get current student progress summary.

Response shape:

```json
{
  "summary": {
    "totalScore": 320,
    "accuracyRate": 82,
    "worldsCompleted": 2,
    "lastActiveAt": "2026-04-29T16:45:00Z"
  },
  "worlds": [],
  "topics": []
}
```

### POST /api/v1/progress/events

Store gameplay progress as an event.

Request body:

```json
{
  "worldId": "integers",
  "levelId": 101,
  "questionId": 101,
  "result": "correct",
  "scoreEarned": 20,
  "timeSpentSeconds": 18,
  "starsEarned": 3,
  "topic": "integers"
}
```

### POST /api/v1/diagnostics/submit

Store diagnostic result and topic breakdown.

### GET /api/v1/activity/me

Return recent activity history for the current student.

## Admin Users

All admin endpoints require role = admin.

### GET /api/v1/admin/users

List users with search, filters, sorting, and pagination.

Query params:
- q
- grade
- status
- role
- sortBy
- sortOrder
- page
- pageSize

Example:

`GET /api/v1/admin/users?q=ali&grade=7&status=active&sortBy=lastActiveAt&sortOrder=desc&page=1&pageSize=20`

Response:

```json
{
  "items": [
    {
      "id": "usr_123",
      "name": "Ali",
      "email": "ali@example.com",
      "grade": "7",
      "status": "active",
      "totalScore": 420,
      "worldsCompleted": 3,
      "lastActiveAt": "2026-04-29T16:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 125
  }
}
```

### GET /api/v1/admin/users/:userId

Return full user detail for admin review.

Includes:
- profile
- progress summary
- world progress
- topic performance
- activity history
- diagnostic history

### PATCH /api/v1/admin/users/:userId

Update managed fields such as status, grade, or role.

### DELETE /api/v1/admin/users/:userId

Soft-delete a user account.

### POST /api/v1/admin/users/:userId/reset-progress

Reset progress while keeping the account.

## Admin Analytics

### GET /api/v1/admin/analytics/summary

Return top-level dashboard metrics.

Response:

```json
{
  "totalUsers": 420,
  "activeUsers7d": 178,
  "activeUsers30d": 256,
  "averageScore": 318,
  "averageAccuracy": 74,
  "mostPlayedWorld": "fractions"
}
```

### GET /api/v1/admin/analytics/engagement

Return timeseries activity such as daily active users and progress event volume.

### GET /api/v1/admin/analytics/performance

Return aggregated performance by world, topic, and grade.

## Audit and Activity

### GET /api/v1/admin/audit-logs

Return admin action history.

### GET /api/v1/admin/users/:userId/activity

Return full activity log for one user.

## Status Values

- `active`
- `suspended`
- `deleted`

## Roles

- `student`
- `admin`

## Notes for This App

- The current frontend can continue to validate answers locally for responsiveness.
- The backend should still receive the result event and persist it.
- Later, question validation can be moved server-side if you want stronger integrity.