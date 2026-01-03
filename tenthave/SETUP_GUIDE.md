# Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` with the following:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/tenthave"

# JWT Configuration  
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend Environment Variables (Optional)

Create `frontend/.env` with the following (defaults to localhost:5000):

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

## Installation Steps

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Setup Database

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with test data
npm run seed
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Test Credentials

After running the seed script, you can login with:

- **Admin**: `admin@tenthave.com` / `admin123`
- **Member**: `john@example.com` / `member123`
- **Member**: `mary@example.com` / `member123`

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## Database Management

```bash
# Open Prisma Studio (database GUI)
cd backend
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npm run prisma:migrate reset

# Re-run seed after reset
npm run seed
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check DATABASE_URL in backend/.env
- Ensure database exists: `CREATE DATABASE tenthave;`

### Port Already in Use
- Backend (5000): Kill process or change PORT in backend/.env
- Frontend (3000): React will offer to use different port

### Migration Errors
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate reset
npm run seed
```

### Frontend Cannot Connect to Backend
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env
- Check browser console for CORS errors

## Production Deployment

See IMPLEMENTATION_SUMMARY.md for production deployment considerations.

