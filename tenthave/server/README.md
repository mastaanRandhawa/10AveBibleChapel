# Backend API Server

This is the Express.js backend server for the 10th Avenue Bible Chapel website.

## Features

- **Calendar Events**: Full CRUD operations for managing church calendar events
- **Announcements**: Full CRUD operations for church announcements
- **Prayer Requests**: Full CRUD operations for prayer requests

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your database:
   - Create a `.env` file in the root directory (copy from `server/env.example`)
   - The default SQLite database will be created automatically at `./dev.db`
   - No database server setup needed - SQLite is file-based!

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run server:dev
```

### Production Mode:
```bash
npm run server
```

The server will run on `http://localhost:5000` by default (or the PORT specified in your `.env` file).

## API Endpoints

### Calendar Events
- `GET /api/calendar` - Get all calendar events (supports query params: startDate, endDate, status, isPublic, category, limit, offset)
- `GET /api/calendar/:id` - Get a specific calendar event
- `POST /api/calendar` - Create a new calendar event
- `PUT /api/calendar/:id` - Update a calendar event
- `DELETE /api/calendar/:id` - Delete a calendar event

### Announcements
- `GET /api/announcements` - Get all announcements (supports query params: status, isPublic, category, priority, startDate, endDate, limit, offset)
- `GET /api/announcements/:id` - Get a specific announcement
- `POST /api/announcements` - Create a new announcement
- `PUT /api/announcements/:id` - Update an announcement
- `DELETE /api/announcements/:id` - Delete an announcement

### Prayer Requests
- `GET /api/prayer-requests` - Get all prayer requests (supports query params: status, category, priority, isPrivate, isAnswered, limit, offset)
- `GET /api/prayer-requests/:id` - Get a specific prayer request
- `POST /api/prayer-requests` - Create a new prayer request
- `PUT /api/prayer-requests/:id` - Update a prayer request
- `DELETE /api/prayer-requests/:id` - Delete a prayer request

## Example Requests

### Create a Calendar Event
```bash
POST /api/calendar
Content-Type: application/json

{
  "title": "Sunday Service",
  "description": "Weekly Sunday worship service",
  "startDate": "2024-01-14T10:00:00Z",
  "endDate": "2024-01-14T12:00:00Z",
  "isAllDay": false,
  "location": "Main Sanctuary",
  "category": "service",
  "isPublic": true
}
```

### Create an Announcement
```bash
POST /api/announcements
Content-Type: application/json

{
  "title": "New Bible Study Starting",
  "content": "Join us for a new Bible study series starting next week.",
  "category": "ministry",
  "priority": "high",
  "isPublic": true
}
```

### Create a Prayer Request
```bash
POST /api/prayer-requests
Content-Type: application/json

{
  "title": "Prayer for Healing",
  "description": "Please pray for John's recovery from surgery",
  "requester": "Jane Doe",
  "category": "HEALTH",
  "priority": "HIGH",
  "isPrivate": false
}
```

## Database Management

- View database in Prisma Studio: `npm run prisma:studio`
- Create a new migration: `npm run prisma:migrate`

