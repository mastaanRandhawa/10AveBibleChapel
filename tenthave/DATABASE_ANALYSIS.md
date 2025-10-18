# 10th Avenue Bible Chapel - Database Schema Analysis

## Executive Summary

This document provides a comprehensive analysis of the existing frontend codebase and presents a complete Prisma database schema that supports all current functionality while adding essential backend features for a production-ready church website.

## Current Frontend Analysis

### ✅ Existing Data Structures Identified

1. **User Management**

   - Role-based access (admin/member/guest)
   - Basic authentication flow
   - User profile information

2. **Services & Ministries**

   - Weekly services with timing and Zoom links
   - Special ministries with active/inactive status
   - Icon-based display system

3. **Sermon Management**

   - YouTube-based sermon storage
   - Series organization with episode counts
   - Speaker and date tracking
   - Featured sermon highlighting

4. **Prayer Requests**

   - User-submitted prayer requests
   - Privacy controls (public/private)
   - Category and priority classification
   - Anonymous submission support

5. **Content Management**

   - About sections (Who We Are, What We Believe)
   - Contact information with service hours
   - Static content with dynamic display

6. **Navigation & UI**
   - Dynamic menu system
   - Responsive design components
   - Accessibility features

### 🔍 Missing Fields & Improvements Identified

#### Critical Missing Features:

1. **Database Timestamps**

   - ❌ No `createdAt` or `updatedAt` fields in current types
   - ✅ **Added**: Comprehensive timestamp tracking for all models

2. **User Management Enhancements**

   - ❌ No password hashing or security features
   - ❌ No email verification system
   - ❌ No password reset functionality
   - ✅ **Added**: Complete authentication system with security tokens

3. **Prayer Request Workflow**

   - ❌ No approval system for prayer requests
   - ❌ No admin controls for visibility
   - ❌ No user permission system
   - ✅ **Added**: Full approval workflow with role-based permissions

4. **Content Versioning**

   - ❌ No audit trail for content changes
   - ❌ No draft/published states
   - ❌ No content history tracking
   - ✅ **Added**: Complete audit trail and content versioning

5. **Media Management**

   - ❌ No proper file upload system
   - ❌ No image optimization or storage
   - ❌ No media metadata tracking
   - ✅ **Added**: Comprehensive media management system

6. **SEO & Performance**
   - ❌ No SEO metadata fields
   - ❌ No content optimization features
   - ❌ No search functionality
   - ✅ **Added**: SEO fields and performance indexes

## Database Schema Features

### 🏗️ Core Models

#### User Management

- **User**: Complete user profiles with roles and authentication
- **PrayerPermission**: Granular control over prayer request visibility
- **ContentEdit**: Audit trail for all content changes

#### Content Management

- **Service**: Weekly and special services with full scheduling
- **Ministry**: Church ministries with detailed information
- **SermonSeries**: Organized sermon collections
- **Sermon**: Individual sermons with YouTube integration
- **AboutSection**: Editable about page content
- **ContactInfo**: Complete contact and location information

#### Prayer System

- **PrayerRequest**: Comprehensive prayer request management
- **PrayerPermission**: User-specific access controls
- **PrayerStatus**: Approval workflow (PENDING → APPROVED → ANSWERED)

#### Media & Configuration

- **MediaFile**: File upload and management system
- **SiteConfig**: Dynamic site configuration
- **ContentEdit**: Complete audit trail

### 🔐 Security Features

1. **Role-Based Access Control**

   - ADMIN: Full system access
   - MEMBER: Can view private content and submit prayers
   - GUEST: Limited public access only

2. **Prayer Request Privacy**

   - Public/private prayer requests
   - User-specific viewing permissions
   - Admin approval workflow

3. **Content Protection**
   - Draft/published content states
   - Audit trail for all changes
   - User attribution for edits

### 📊 Performance Optimizations

1. **Strategic Indexes**

   - User authentication queries
   - Prayer request filtering
   - Sermon date and series queries
   - Content status filtering

2. **Efficient Relationships**
   - Proper foreign key constraints
   - Cascade delete where appropriate
   - Nullable relationships for flexibility

### 🔄 Data Integrity

1. **Referential Integrity**

   - Foreign key constraints
   - Cascade delete policies
   - Unique constraints where needed

2. **Data Validation**
   - Enum types for controlled values
   - Required field constraints
   - Proper data types for all fields

## Implementation Recommendations

### Phase 1: Core Setup

1. Set up Prisma with PostgreSQL
2. Implement user authentication
3. Create basic CRUD operations for all models

### Phase 2: Content Management

1. Build admin interface for content editing
2. Implement prayer request approval workflow
3. Add media upload functionality

### Phase 3: Advanced Features

1. Implement audit trail system
2. Add SEO optimization features
3. Build advanced search and filtering

### Phase 4: Performance & Security

1. Add caching layer
2. Implement rate limiting
3. Add comprehensive logging

## Migration Strategy

### From Current Frontend to Database-Driven

1. **Data Migration**

   - Convert hardcoded constants to database records
   - Migrate existing sermon data to new structure
   - Set up initial admin user account

2. **API Development**

   - Create RESTful APIs for all data operations
   - Implement authentication middleware
   - Add proper error handling and validation

3. **Frontend Updates**
   - Replace hardcoded data with API calls
   - Add loading states and error handling
   - Implement real-time updates where needed

## Security Considerations

1. **Authentication**

   - JWT tokens with proper expiration
   - Password hashing with bcrypt
   - Email verification for new accounts

2. **Authorization**

   - Role-based access control
   - Resource-level permissions
   - API rate limiting

3. **Data Protection**
   - Input validation and sanitization
   - SQL injection prevention
   - XSS protection for user content

## Scalability Features

1. **Database Design**

   - Normalized structure for data integrity
   - Strategic indexes for performance
   - Proper relationship modeling

2. **Content Management**

   - Draft/published workflow
   - Content versioning
   - Media optimization

3. **User Management**
   - Scalable permission system
   - Efficient user queries
   - Session management

## Conclusion

The proposed database schema provides a robust foundation for the 10th Avenue Bible Chapel website that:

- ✅ Supports all current frontend functionality
- ✅ Adds essential missing features for production use
- ✅ Provides room for future growth and expansion
- ✅ Implements security best practices
- ✅ Optimizes for performance and scalability

The schema is designed to be implemented incrementally, allowing for a smooth transition from the current static frontend to a fully dynamic, database-driven application.
