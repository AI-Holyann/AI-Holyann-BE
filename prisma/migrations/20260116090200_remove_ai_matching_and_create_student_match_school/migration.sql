-- Remove ai-matching column from university table
ALTER TABLE "university" DROP COLUMN IF EXISTS "ai-matching";

-- Create student_match_school table to store matching results
-- Tách thành bảng riêng thay vì JSONB để tối ưu performance và dễ query
CREATE TABLE "student_match_school" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "university_id" UUID NOT NULL,
    "ai_matching" VARCHAR(50) NOT NULL,
    "match_score" DECIMAL(5, 2),
    "match_reason" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_match_school_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "student_match_school" ADD CONSTRAINT "student_match_school_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "student_match_school" ADD CONSTRAINT "student_match_school_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create unique constraint to ensure one matching record per student-university pair
CREATE UNIQUE INDEX "student_match_school_student_university_key" ON "student_match_school"("student_id", "university_id");

-- Create indexes for better query performance
CREATE INDEX "student_match_school_student_id_idx" ON "student_match_school"("student_id");
CREATE INDEX "student_match_school_university_id_idx" ON "student_match_school"("university_id");
CREATE INDEX "student_match_school_ai_matching_idx" ON "student_match_school"("ai_matching");

-- ai_matching values: 'REACH', 'MATCH', 'SAFETY'
