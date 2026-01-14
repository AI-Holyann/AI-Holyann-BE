-- AlterTable: career_matches
-- Add job-field column to store career group name
ALTER TABLE "career_matches" 
ADD COLUMN "job-field" VARCHAR(255);
