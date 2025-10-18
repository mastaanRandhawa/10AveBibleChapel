# API Documentation with Swagger

This document provides comprehensive information about the Swagger API documentation for the 10th Avenue Bible Chapel backend.

## Overview

The API documentation is automatically generated using Swagger UI and provides interactive documentation for all endpoints. The documentation includes:

- Complete API endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Error handling information

## Accessing the Documentation

### Development Environment

- **Swagger UI**: http://localhost:3000/api/v1/docs
- **API Info**: http://localhost:3000/api/v1/docs/info

### Production Environment

- **Swagger UI**: https://api.10thavebiblechapel.org/api/v1/docs
- **API Info**: https://api.10thavebiblechapel.org/api/v1/docs/info

## Features

### Interactive Documentation

- **Try it out**: Test API endpoints directly from the browser
- **Authentication**: Built-in JWT token authentication support
- **Request/Response Examples**: Real examples for all endpoints
- **Schema Validation**: Automatic validation of request/response schemas

### Comprehensive Coverage

The documentation covers all API endpoints:

#### Authentication Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password` - Password reset confirmation
- `POST /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `PUT /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/request-email-verification` - Request email verification
- `POST /api/v1/auth/logout` - User logout

#### Prayer Request Endpoints

- `GET /api/v1/prayer-requests` - Get prayer requests (with filtering)
- `GET /api/v1/prayer-requests/{id}` - Get prayer request by ID
- `POST /api/v1/prayer-requests` - Submit prayer request
- `PUT /api/v1/prayer-requests/{id}` - Update prayer request
- `DELETE /api/v1/prayer-requests/{id}` - Delete prayer request
- `POST /api/v1/prayer-requests/{id}/approve` - Approve prayer request (Admin)
- `POST /api/v1/prayer-requests/{id}/reject` - Reject prayer request (Admin)
- `POST /api/v1/prayer-requests/{id}/answer` - Mark as answered (Admin)

#### Sermon Endpoints

- `GET /api/v1/sermons` - Get sermons (with filtering)
- `GET /api/v1/sermons/{id}` - Get sermon by ID
- `POST /api/v1/sermons` - Create sermon (Admin)
- `PUT /api/v1/sermons/{id}` - Update sermon (Admin)
- `DELETE /api/v1/sermons/{id}` - Delete sermon (Admin)
- `GET /api/v1/sermons/series` - Get sermon series
- `POST /api/v1/sermons/series` - Create sermon series (Admin)
- `GET /api/v1/sermons/featured` - Get featured sermons

#### Content Management Endpoints

- `GET /api/v1/content/services` - Get services
- `POST /api/v1/content/services` - Create service (Admin)
- `GET /api/v1/content/ministries` - Get ministries
- `POST /api/v1/content/ministries` - Create ministry (Admin)
- `GET /api/v1/content/about` - Get about sections
- `POST /api/v1/content/about` - Create about section (Admin)
- `GET /api/v1/content/contact` - Get contact information
- `PUT /api/v1/content/contact` - Update contact information (Admin)

#### Media Management Endpoints

- `POST /api/v1/media/upload` - Upload single file
- `POST /api/v1/media/upload-multiple` - Upload multiple files
- `GET /api/v1/media/{id}` - Get file by ID
- `GET /api/v1/media/entity/{entityType}/{entityId}` - Get files by entity
- `PUT /api/v1/media/{id}` - Update file metadata
- `DELETE /api/v1/media/{id}` - Delete file

#### User Management Endpoints (Admin Only)

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `PUT /api/v1/users/{id}` - Update user role
- `DELETE /api/v1/users/{id}` - Deactivate user

#### Admin Dashboard Endpoints

- `GET /api/v1/admin/dashboard` - Get dashboard statistics
- `GET /api/v1/admin/health` - System health check
- `POST /api/v1/admin/cleanup` - Cleanup orphaned files
- `GET /api/v1/admin/export` - Export data
- `GET /api/v1/admin/audit` - Get audit logs

## Authentication

### JWT Token Authentication

Most endpoints require authentication using JWT tokens:

1. **Login** to get an access token:

   ```bash
   POST /api/v1/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Use the token** in the Authorization header:

   ```bash
   Authorization: Bearer <your-jwt-token>
   ```

3. **Refresh the token** when it expires:
   ```bash
   POST /api/v1/auth/refresh
   {
     "refreshToken": "<your-refresh-token>"
   }
   ```

### Role-Based Access Control

The API supports three user roles:

- **Admin**: Full access to all endpoints
- **Member**: Access to most endpoints, limited admin functions
- **Guest**: Limited access to public content

## Request/Response Formats

### Standard Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": { ... } // For paginated responses
}
```

### Error Response Format

Error responses include detailed information:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { ... } // Additional error details
}
```

### Pagination

Paginated endpoints include metadata:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Data Models

### Core Models

- **User**: User account information
- **PrayerRequest**: Prayer request submissions
- **Sermon**: Individual sermons
- **SermonSeries**: Sermon series collections
- **Service**: Church services
- **Ministry**: Church ministries
- **AboutSection**: About page content
- **ContactInfo**: Contact information
- **MediaFile**: Uploaded files

### Enums

- **UserRole**: admin, member, guest
- **PrayerStatus**: pending, approved, rejected, answered
- **PrayerCategory**: health, family, work, spiritual, other
- **PrayerPriority**: low, medium, high, urgent
- **ContentStatus**: draft, published, archived
- **ServiceType**: weekly, special, online

## Testing with Swagger UI

### 1. Authentication

1. Open the Swagger UI
2. Click "Authorize" button
3. Enter your JWT token: `Bearer <your-token>`
4. Click "Authorize"

### 2. Testing Endpoints

1. Find the endpoint you want to test
2. Click "Try it out"
3. Fill in the required parameters
4. Click "Execute"
5. View the response

### 3. Example Workflow

1. **Register** a new user
2. **Login** to get a token
3. **Authorize** with the token
4. **Submit** a prayer request
5. **View** the prayer request

## Error Handling

### Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND_ERROR`: Resource not found
- `CONFLICT_ERROR`: Resource already exists
- `RATE_LIMIT_ERROR`: Too many requests
- `DATABASE_ERROR`: Database operation failed
- `EXTERNAL_SERVICE_ERROR`: External service unavailable

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `413`: Payload Too Large
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Password Reset**: 3 requests per hour
- **Email Verification**: 3 requests per hour
- **Prayer Requests**: 10 requests per hour
- **File Upload**: 20 requests per hour

## File Upload

### Supported File Types

- **Images**: jpg, jpeg, png, gif, webp
- **Documents**: pdf, doc, docx, txt
- **Audio**: mp3, wav, m4a
- **Video**: mp4, avi, mov

### File Size Limits

- **Images**: 10MB maximum
- **Documents**: 25MB maximum
- **Audio**: 50MB maximum
- **Video**: 100MB maximum

### Upload Process

1. Use `POST /api/v1/media/upload` endpoint
2. Include file in multipart/form-data
3. Specify entityType and entityId if applicable
4. Receive file metadata in response

## Development

### Adding New Endpoints

1. Create the route in the appropriate route file
2. Add Swagger documentation using JSDoc comments
3. Update the additional documentation in `swagger-routes.ts`
4. Test the endpoint in Swagger UI

### Updating Documentation

1. Modify the JSDoc comments in route files
2. Update schemas in `swagger.ts`
3. Add new paths to `swagger-routes.ts`
4. Restart the server to see changes

## Production Considerations

### Security

- Swagger UI is only available in development by default
- In production, consider restricting access to admin users
- Use HTTPS for all API communications
- Implement proper CORS policies

### Performance

- Swagger UI adds minimal overhead
- Documentation is generated at startup
- Consider caching for high-traffic APIs

### Monitoring

- Monitor API usage through Swagger UI
- Track endpoint performance
- Log API access for security auditing

## Troubleshooting

### Common Issues

1. **Swagger UI not loading**

   - Check if server is running
   - Verify the correct URL
   - Check browser console for errors

2. **Authentication not working**

   - Ensure token is valid
   - Check token format: `Bearer <token>`
   - Verify token hasn't expired

3. **Endpoints not appearing**

   - Check JSDoc comment format
   - Verify route file is included in apis array
   - Restart server after changes

4. **Validation errors**
   - Check request body format
   - Verify required fields are included
   - Check data types match schema

### Getting Help

- Check the server logs for detailed error messages
- Use the browser developer tools to inspect requests
- Verify the API documentation matches your implementation
- Test with simple requests first

## Best Practices

1. **Always use HTTPS** in production
2. **Validate all inputs** on both client and server
3. **Handle errors gracefully** with meaningful messages
4. **Use appropriate HTTP status codes**
5. **Implement proper authentication** and authorization
6. **Rate limit sensitive endpoints**
7. **Log important operations** for auditing
8. **Keep documentation up to date**
9. **Test endpoints thoroughly** before deployment
10. **Monitor API performance** and usage

This comprehensive API documentation ensures that developers can easily understand and integrate with the 10th Avenue Bible Chapel backend API.
