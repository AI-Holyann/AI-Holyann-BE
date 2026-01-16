-- Drop foreign key constraint from student_applications to universities
ALTER TABLE "student_applications" DROP CONSTRAINT IF EXISTS "student_applications_university_id_fkey";

-- Drop the old universities table
DROP TABLE IF EXISTS "universities" CASCADE;

-- Create new university table with UUID
CREATE TABLE "university" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "country" VARCHAR(100),
    "description" TEXT,
    "detail_information" TEXT,
    "deadline" JSONB,
    "requirements" TEXT,
    "status" VARCHAR(50),
    "rank" INTEGER,
    "url_link" VARCHAR(500),
    "image_display_url" VARCHAR(500),
    "ai-matching" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_pkey" PRIMARY KEY ("id")
);

-- Create scholarship table
CREATE TABLE "scholarship" (
    "id" UUID NOT NULL,
    "universities_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(6),
    "url_web" VARCHAR(500),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scholarship_pkey" PRIMARY KEY ("id")
);

-- Create faculty table
CREATE TABLE "faculty" (
    "id" UUID NOT NULL,
    "university_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(100),
    "url_web" VARCHAR(500),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "scholarship" ADD CONSTRAINT "scholarship_universities_id_fkey" FOREIGN KEY ("universities_id") REFERENCES "university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "faculty" ADD CONSTRAINT "faculty_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update student_applications to reference new university table
-- First, drop the old column
ALTER TABLE "student_applications" DROP COLUMN IF EXISTS "university_id";

-- Add new university_id column as UUID
ALTER TABLE "student_applications" ADD COLUMN "university_id" UUID;

-- Add foreign key constraint
ALTER TABLE "student_applications" ADD CONSTRAINT "student_applications_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "scholarship_universities_id_idx" ON "scholarship"("universities_id");
CREATE INDEX IF NOT EXISTS "faculty_university_id_idx" ON "faculty"("university_id");
CREATE INDEX IF NOT EXISTS "student_applications_university_id_idx" ON "student_applications"("university_id");
