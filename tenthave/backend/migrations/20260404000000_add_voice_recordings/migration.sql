-- Add voice_recordings table

CREATE TABLE "voice_recordings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "speaker" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "passage" TEXT,
    "category" TEXT,
    "embedUrl" TEXT NOT NULL,
    "embedType" TEXT NOT NULL DEFAULT 'iframe',
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voice_recordings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "voice_recordings_status_idx" ON "voice_recordings"("status");
CREATE INDEX "voice_recordings_isPublic_idx" ON "voice_recordings"("isPublic");
CREATE INDEX "voice_recordings_isFeatured_idx" ON "voice_recordings"("isFeatured");
CREATE INDEX "voice_recordings_date_idx" ON "voice_recordings"("date");
CREATE INDEX "voice_recordings_category_idx" ON "voice_recordings"("category");
