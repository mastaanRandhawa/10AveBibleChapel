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
   - Configure email settings (see Email Configuration below)

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

## Email Configuration

The contact form uses InterServer's mail service. Add these variables to your `.env` file:

```env
# InterServer Email Configuration
SMTP_HOST=mail.interserver.net              # InterServer SMTP server
SMTP_PORT=587                                # Use 587 for TLS (recommended) or 465 for SSL
SMTP_USER=info@10thavebiblechapel.com       # Your InterServer email address (full email)
SMTP_PASS=your-email-password                # Your InterServer email account password
CONTACT_EMAIL=info@10thavebiblechapel.com    # Where to send contact form emails
```

### InterServer Setup:
1. **SMTP Host**: `mail.interserver.net` (default, can be overridden)
2. **SMTP Port**: 
   - `587` for TLS (recommended) - set `SMTP_PORT=587`
   - `465` for SSL - set `SMTP_PORT=465`
3. **Authentication**: Use your full InterServer email address as `SMTP_USER`
4. **Password**: Use your InterServer email account password as `SMTP_PASS`

### Notes:
- The `SMTP_USER` should be your full email address (e.g., `info@10thavebiblechapel.com`)
- Make sure your InterServer email account is active and the password is correct
- If you encounter connection issues, try port `465` with SSL instead of `587` with TLS
- Contact InterServer support if you need help with email account setup
