# Quick Start Guide

## First Time Setup

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

### 2. Configure Backend

1. Copy the environment example:
   ```bash
   cd backend
   copy .env.example .env
   ```

2. Edit `backend/.env` and add your database credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/tenthave"
   JWT_SECRET="your-secret-key-here"
   PORT=5000
   ```

### 3. Set Up Database

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 4. Run the Application

**Open two terminal windows:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend running on http://localhost:3000

## Daily Development

Just run both commands in separate terminals:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2  
cd frontend && npm start
```

## Creating Your First Admin User

1. Register a user via API:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@church.com","password":"password123","name":"Admin User"}'
   ```

2. Update role to ADMIN in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@church.com';
   ```

   Or use Prisma Studio:
   ```bash
   cd backend
   npm run prisma:studio
   ```

## Troubleshooting

- **Backend won't start?** Check your `.env` file has correct DATABASE_URL
- **Frontend can't connect?** Make sure backend is running on port 5000
- **Database errors?** Run `npm run prisma:generate` in backend folder

