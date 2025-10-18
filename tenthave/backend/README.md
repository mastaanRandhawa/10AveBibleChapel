# 10th Avenue Bible Chapel - Backend API

A comprehensive, scalable Node.js/TypeScript backend API for the 10th Avenue Bible Chapel website. Built with modern best practices, security-first design, and production-ready architecture.

## 🚀 Features

### Core Functionality

- **User Management**: Registration, authentication, role-based access control
- **Prayer Requests**: Submit, approve, manage prayer requests with privacy controls
- **Sermon Management**: YouTube-based sermons with series organization
- **Content Management**: Services, ministries, about sections, contact info
- **Media Management**: File uploads with image optimization and thumbnails
- **Admin Dashboard**: Comprehensive admin interface with statistics and management tools
- **API Documentation**: Interactive Swagger UI documentation for all endpoints

### Security & Performance

- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: Admin, Member, and Guest roles with granular permissions
- **Rate Limiting**: Configurable rate limiting for all endpoints
- **Input Validation**: Comprehensive validation using Joi schemas
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Audit Trail**: Complete audit logging for all content changes
- **File Security**: Secure file uploads with type validation and size limits
- **API Documentation**: Comprehensive Swagger UI with interactive testing

### Database & Architecture

- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Scalable Design**: Modular architecture with service layer pattern
- **Database Migrations**: Version-controlled database schema changes
- **Connection Pooling**: Optimized database connections
- **Indexes**: Strategic database indexes for performance

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL 13.0 or higher
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/tenthave_db"

   # JWT
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="7d"
   JWT_REFRESH_EXPIRES_IN="30d"

   # Server
   PORT=3001
   NODE_ENV="development"

   # Email Configuration
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   EMAIL_FROM="noreply@10thavebiblechapel.com"

   # File Upload
   UPLOAD_DIR="./uploads"
   MAX_FILE_SIZE=10485760

   # CORS
   CORS_ORIGIN="http://localhost:3000"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # (Optional) Seed the database
   npm run db:seed
   ```

5. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## 📚 API Documentation

### Interactive Swagger UI

The API includes comprehensive interactive documentation powered by Swagger UI:

- **Development**: http://localhost:3001/api/v1/docs
- **Production**: https://api.10thavebiblechapel.org/api/v1/docs

#### Features

- **Interactive Testing**: Test all endpoints directly from the browser
- **Authentication Support**: Built-in JWT token authentication
- **Request/Response Examples**: Real examples for all endpoints
- **Schema Validation**: Automatic validation of request/response schemas
- **Complete Coverage**: Documentation for all 50+ API endpoints

#### Quick Start with Swagger

1. Open the Swagger UI in your browser
2. Click "Authorize" and enter your JWT token
3. Explore and test any endpoint
4. View detailed request/response schemas

For detailed Swagger documentation, see [SWAGGER.md](./SWAGGER.md).

### Base URL

```
http://localhost:3001/api/v1
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### Authentication (`/auth`)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Confirm password reset
- `GET /auth/profile` - Get current user profile
- `PUT /auth/profile` - Update user profile
- `PUT /auth/change-password` - Change password
- `POST /auth/logout` - Logout

#### Prayer Requests (`/prayer-requests`)

- `GET /prayer-requests` - Get prayer requests (public approved ones)
- `POST /prayer-requests` - Submit prayer request
- `GET /prayer-requests/:id` - Get prayer request by ID
- `PUT /prayer-requests/:id` - Update prayer request (own requests)
- `DELETE /prayer-requests/:id` - Delete prayer request (own requests)
- `PATCH /prayer-requests/:id/approve` - Approve prayer request (admin)
- `PATCH /prayer-requests/:id/reject` - Reject prayer request (admin)
- `PATCH /prayer-requests/:id/answered` - Mark as answered (admin)

#### Sermons (`/sermons`)

- `GET /sermons` - Get sermons
- `GET /sermons/:id` - Get sermon by ID
- `GET /sermons/slug/:slug` - Get sermon by slug
- `POST /sermons` - Create sermon (admin)
- `PUT /sermons/:id` - Update sermon (admin)
- `DELETE /sermons/:id` - Delete sermon (admin)
- `GET /sermons/featured/list` - Get featured sermons
- `GET /sermons/series` - Get sermon series
- `POST /sermons/series` - Create sermon series (admin)

#### Content (`/content`)

- `GET /content/services` - Get services
- `GET /content/ministries` - Get ministries
- `GET /content/about-sections` - Get about sections
- `GET /content/contact-info` - Get contact information
- `PUT /content/contact-info` - Update contact info (admin)

#### Media (`/media`)

- `POST /media/upload` - Upload single file
- `POST /media/upload/multiple` - Upload multiple files
- `GET /media/:id` - Get file by ID
- `DELETE /media/:id` - Delete file (admin)

#### Admin (`/admin`)

- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/health` - System health check
- `POST /admin/maintenance/cleanup` - System cleanup
- `GET /admin/export/:type` - Export data
- `GET /admin/audit-logs` - Get audit logs

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server
npm test            # Run tests
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors

# Database
npm run db:generate # Generate Prisma client
npm run db:push     # Push schema to database
npm run db:migrate  # Run database migrations
npm run db:studio   # Open Prisma Studio
npm run db:seed     # Seed database with sample data
```

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── server.ts        # Main server file
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seed file
├── uploads/             # File upload directory
├── logs/                # Application logs
└── dist/                # Compiled JavaScript (production)
```

## 🗄️ Database Schema

The application uses a comprehensive Prisma schema with the following main models:

- **User**: User accounts with role-based access
- **PrayerRequest**: Prayer requests with approval workflow
- **PrayerPermission**: Granular prayer request permissions
- **Sermon**: Individual sermons with YouTube integration
- **SermonSeries**: Organized sermon collections
- **Service**: Weekly and special services
- **Ministry**: Church ministries and programs
- **AboutSection**: Editable about page content
- **ContactInfo**: Contact and location information
- **MediaFile**: File upload management
- **ContentEdit**: Audit trail for content changes
- **SiteConfig**: Dynamic site configuration

## 🔐 Security Features

### Authentication & Authorization

- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Member, Guest)
- Password hashing with bcrypt
- Email verification system
- Password reset functionality

### Input Validation & Sanitization

- Comprehensive input validation using Joi
- SQL injection prevention with Prisma
- XSS protection with input sanitization
- File upload security with type validation

### Rate Limiting & Monitoring

- Configurable rate limiting per endpoint
- Request logging and monitoring
- Error tracking and reporting
- Audit trail for all content changes

## 📊 Monitoring & Logging

### Logging

- Structured logging with Winston
- Different log levels (error, warn, info, debug)
- File and console output
- Request/response logging

### Health Checks

- Database connection monitoring
- System resource monitoring
- API endpoint health checks
- Automated error reporting

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

### Environment Variables

Ensure all required environment variables are set in production:

- Database connection string
- JWT secrets
- Email configuration
- File upload settings
- CORS origins
- Rate limiting configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Email: info@10thavebiblechapel.com
- Phone: (604) 222-7777
- Address: 7103 - 10th Ave., Burnaby, BC V3N 2R5

## 🙏 Acknowledgments

Built with love for the 10th Avenue Bible Chapel community. Special thanks to all contributors and the church leadership for their guidance and support.
