# Backend API Server

Express.js backend API for the 10th Avenue Bible Chapel website.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your MySQL credentials
   - Set a secure `JWT_SECRET`

3. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```

The server will run on `http://localhost:5000` by default (or the PORT specified in your `.env` file).

## API Endpoints

See the root `README.md` for complete API documentation.

## Database Management

- View database in Prisma Studio: `npm run prisma:studio`
- Create a new migration: `npm run prisma:migrate`
