-- PostgreSQL initial schema (replaces former MySQL migrations)

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER', 'GUEST');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_isApproved_idx" ON "users"("isApproved");

CREATE TABLE "calendar_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" TEXT,
    "location" TEXT,
    "category" TEXT,
    "color" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "link" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "calendar_events_startDate_idx" ON "calendar_events"("startDate");
CREATE INDEX "calendar_events_status_idx" ON "calendar_events"("status");
CREATE INDEX "calendar_events_isPublic_idx" ON "calendar_events"("isPublic");

CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "priority" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "announcements_status_idx" ON "announcements"("status");
CREATE INDEX "announcements_isPublic_idx" ON "announcements"("isPublic");
CREATE INDEX "announcements_pinned_idx" ON "announcements"("pinned");
CREATE INDEX "announcements_publishedAt_idx" ON "announcements"("publishedAt");
CREATE INDEX "announcements_startDate_idx" ON "announcements"("startDate");
CREATE INDEX "announcements_endDate_idx" ON "announcements"("endDate");
CREATE INDEX "announcements_createdAt_idx" ON "announcements"("createdAt");

CREATE TABLE "prayer_requests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requester" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isAnswered" BOOLEAN NOT NULL DEFAULT false,
    "answeredAt" TIMESTAMP(3),
    "answerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prayer_requests_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "prayer_requests_isPrivate_idx" ON "prayer_requests"("isPrivate");
CREATE INDEX "prayer_requests_createdAt_idx" ON "prayer_requests"("createdAt");

CREATE TABLE "sermons" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "speaker" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "passage" TEXT,
    "series" TEXT,
    "videoUrl" TEXT,
    "audioUrl" TEXT,
    "thumbnail" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sermons_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sermons_status_idx" ON "sermons"("status");
CREATE INDEX "sermons_isPublic_idx" ON "sermons"("isPublic");
CREATE INDEX "sermons_isFeatured_idx" ON "sermons"("isFeatured");
CREATE INDEX "sermons_date_idx" ON "sermons"("date");
CREATE INDEX "sermons_series_idx" ON "sermons"("series");
