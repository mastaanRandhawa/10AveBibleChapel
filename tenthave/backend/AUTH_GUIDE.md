# Authentication & Authorization Guide

## Overview

This backend now includes JWT-based authentication and role-based authorization. Only users with the ADMIN role can create, update, or delete calendar events and announcements.

## User Roles

- **ADMIN**: Full access - can manage calendar events and announcements
- **MEMBER**: Regular member - can view public content
- **GUEST**: Limited access

## Setup

### 1. Update Environment Variables

Add to your `.env` file:

```env
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Important**: Change this to a strong, random secret in production!

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Database Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

## API Endpoints

### Authentication Endpoints

#### Register a New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "MEMBER"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "MEMBER"
  }
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN

Response:
{
  "id": "clx...",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "MEMBER",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Protected Routes (Admin Only)

The following routes require authentication AND admin role:

### Calendar Events
- `POST /api/calendar` - Create calendar event
- `PUT /api/calendar/:id` - Update calendar event
- `DELETE /api/calendar/:id` - Delete calendar event

### Announcements
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Public Routes (No Auth Required)
- `GET /api/calendar` - View all calendar events
- `GET /api/calendar/:id` - View specific calendar event
- `GET /api/announcements` - View all announcements
- `GET /api/announcements/:id` - View specific announcement
- `GET /api/prayer-requests` - View prayer requests
- All prayer request routes (for now)

## Using Protected Routes

To access admin-only routes, include the JWT token in the Authorization header:

```bash
POST /api/calendar
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Sunday Service",
  "description": "Weekly worship service",
  "startDate": "2024-01-14T10:00:00Z",
  "isPublic": true
}
```

## Creating an Admin User

### Option 1: Direct Database Update

After registering a user, update their role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### Option 2: Using Prisma Studio

1. Run: `npm run prisma:studio`
2. Open the users table
3. Find your user
4. Change role from 'MEMBER' to 'ADMIN'
5. Save

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

## Frontend Integration

### Store Token

After login, store the token in localStorage:

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

### Make Authenticated Requests

```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/calendar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(eventData)
});
```

### Check User Role

```javascript
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const user = await response.json();
if (user.role === 'ADMIN') {
  // Show admin UI
}
```

## Security Best Practices

1. **Change JWT_SECRET**: Use a strong, random secret in production
2. **Use HTTPS**: Always use HTTPS in production to protect tokens
3. **Token Expiration**: Tokens expire after 7 days
4. **Secure Storage**: Store tokens in httpOnly cookies (not localStorage) for production
5. **Rate Limiting**: Consider adding rate limiting to auth endpoints
6. **Password Requirements**: Enforce strong password policies in production

## Testing

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Test Protected Route
```bash
curl -X POST http://localhost:5000/api/calendar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Test Event","startDate":"2024-01-14T10:00:00Z"}'
```


