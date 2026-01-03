# 10th Avenue Bible Chapel Website

A full-stack web application for managing church calendar events, announcements, and prayer requests.

## Project Structure

```
tenthave/
├── frontend/          # React frontend application
├── backend/           # Express.js backend API
└── README.md         # This file
```

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Set Up Database

1. Create a MySQL database named `tenthave`
2. Copy `.env.example` to `.env` in the `backend` folder:
   ```bash
   cd backend
   copy .env.example .env
   ```
3. Update `backend/.env` with your database credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/tenthave"
   JWT_SECRET="your-secret-key-here"
   ```

### 3. Run Database Migrations

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

## Available Scripts

### Backend Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Frontend Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires auth)

### Calendar Events
- `GET /api/calendar` - Get all events (PUBLIC)
- `GET /api/calendar/:id` - Get specific event (PUBLIC)
- `POST /api/calendar` - Create event (ADMIN ONLY)
- `PUT /api/calendar/:id` - Update event (ADMIN ONLY)
- `DELETE /api/calendar/:id` - Delete event (ADMIN ONLY)

### Announcements
- `GET /api/announcements` - Get all announcements (PUBLIC)
- `GET /api/announcements/:id` - Get specific announcement (PUBLIC)
- `POST /api/announcements` - Create announcement (ADMIN ONLY)
- `PUT /api/announcements/:id` - Update announcement (ADMIN ONLY)
- `DELETE /api/announcements/:id` - Delete announcement (ADMIN ONLY)

### Prayer Requests
- `GET /api/prayer-requests` - Get all requests (PUBLIC)
- `GET /api/prayer-requests/:id` - Get specific request (PUBLIC)
- `POST /api/prayer-requests` - Create request (PUBLIC)
- `PUT /api/prayer-requests/:id` - Update request (PUBLIC)
- `DELETE /api/prayer-requests/:id` - Delete request (PUBLIC)

## Creating an Admin User

After registering a user, update their role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:
```bash
cd backend
npm run prisma:studio
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Tech Stack

### Frontend
- React 19
- TypeScript
- React Router
- FullCalendar

### Backend
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication
- bcryptjs

## License

Private - 10th Avenue Bible Chapel
