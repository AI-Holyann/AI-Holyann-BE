-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SchoolCategory" AS ENUM ('REACH', 'MATCH', 'SAFETY');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('RESEARCHING', 'ESSAY_WRITING', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'WAITLISTED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "auth_provider" VARCHAR(50) DEFAULT 'LOCAL',
    "auth_provider_id" VARCHAR(255),
    "avatar_url" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "user_id" UUID NOT NULL,
    "current_school" VARCHAR(255),
    "current_grade" VARCHAR(50),
    "current_address" TEXT,
    "talents" TEXT,
    "hobbies" TEXT,
    "target_country" VARCHAR(100),
    "intended_major" VARCHAR(255),
    "yearly_budget" DECIMAL(15,2),
    "personal_desire" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "assessments_completed" BOOLEAN DEFAULT false,

    CONSTRAINT "students_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "student_academic_profiles" (
    "student_id" UUID NOT NULL,
    "gpa_transcript_details" JSONB DEFAULT '{}',
    "english_certificates" JSONB DEFAULT '{}',
    "standardized_tests" JSONB DEFAULT '{}',
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_academic_profiles_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "student_backgrounds" (
    "student_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_backgrounds_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "academic_awards" (
    "id" UUID NOT NULL,
    "background_id" UUID NOT NULL,
    "award_name" VARCHAR(255) NOT NULL,
    "issuing_organization" VARCHAR(255),
    "award_level" VARCHAR(100),
    "award_date" DATE,
    "description" TEXT,
    "certificate_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "non_academic_awards" (
    "id" UUID NOT NULL,
    "background_id" UUID NOT NULL,
    "award_name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),
    "issuing_organization" VARCHAR(255),
    "award_level" VARCHAR(100),
    "award_date" DATE,
    "description" TEXT,
    "certificate_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "non_academic_awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_extracurriculars" (
    "id" UUID NOT NULL,
    "background_id" UUID NOT NULL,
    "activity_name" VARCHAR(255) NOT NULL,
    "organization" VARCHAR(255),
    "role" VARCHAR(100),
    "start_date" DATE,
    "end_date" DATE,
    "hours_per_week" INTEGER,
    "weeks_per_year" INTEGER,
    "description" TEXT,
    "achievements" TEXT,
    "related_to_major" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_extracurriculars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "non_academic_extracurriculars" (
    "id" UUID NOT NULL,
    "background_id" UUID NOT NULL,
    "activity_name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),
    "organization" VARCHAR(255),
    "role" VARCHAR(100),
    "start_date" DATE,
    "end_date" DATE,
    "hours_per_week" INTEGER,
    "weeks_per_year" INTEGER,
    "description" TEXT,
    "achievements" TEXT,
    "impact" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "non_academic_extracurriculars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experiences" (
    "id" UUID NOT NULL,
    "background_id" UUID NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "job_title" VARCHAR(150) NOT NULL,
    "employment_type" VARCHAR(50),
    "location" VARCHAR(255),
    "start_date" DATE,
    "end_date" DATE,
    "is_current" BOOLEAN DEFAULT false,
    "responsibilities" TEXT,
    "achievements" TEXT,
    "skills_gained" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_experiences" (
    "id" UUID NOT NULL,
    "background_id" UUID NOT NULL,
    "project_title" VARCHAR(255) NOT NULL,
    "institution" VARCHAR(255),
    "supervisor_name" VARCHAR(150),
    "role" VARCHAR(100),
    "start_date" DATE,
    "end_date" DATE,
    "is_current" BOOLEAN DEFAULT false,
    "research_field" VARCHAR(255),
    "description" TEXT,
    "methodologies" TEXT,
    "findings" TEXT,
    "publication_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_parents" (
    "id" UUID NOT NULL,
    "student_id" UUID,
    "full_name" VARCHAR(100) NOT NULL,
    "relationship" VARCHAR(50),
    "phone_number" VARCHAR(20),
    "email" VARCHAR(255),
    "job_title" VARCHAR(150),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "country" VARCHAR(100),
    "state" VARCHAR(100),
    "current_ranking" INTEGER,
    "website_url" TEXT,
    "logo_url" TEXT,
    "ai_matching_data" JSONB DEFAULT '{}',
    "essay_requirements" TEXT,
    "scholarship_info" JSONB DEFAULT '{}',

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_applications" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "university_id" INTEGER,
    "category" "SchoolCategory" NOT NULL DEFAULT 'MATCH',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'RESEARCHING',
    "personal_notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_analyses" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "analysis_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "academic_data" JSONB NOT NULL DEFAULT '{}',
    "extracurricular_data" JSONB NOT NULL DEFAULT '{}',
    "skill_data" JSONB NOT NULL DEFAULT '{}',
    "overall_score" DOUBLE PRECISION,
    "academic_score" DOUBLE PRECISION,
    "extracurricular_score" DOUBLE PRECISION,
    "summary" TEXT,
    "swot_data" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mbti_tests" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "status" "TestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "current_step" INTEGER NOT NULL DEFAULT 0,
    "answers" JSONB NOT NULL DEFAULT '[]',
    "result_type" VARCHAR(10),
    "score_e" DOUBLE PRECISION,
    "score_i" DOUBLE PRECISION,
    "score_s" DOUBLE PRECISION,
    "score_n" DOUBLE PRECISION,
    "score_t" DOUBLE PRECISION,
    "score_f" DOUBLE PRECISION,
    "score_j" DOUBLE PRECISION,
    "score_p" DOUBLE PRECISION,
    "completed_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mbti_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riasec_tests" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "status" "TestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "current_step" INTEGER NOT NULL DEFAULT 0,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "result_code" VARCHAR(10),
    "score_realistic" DOUBLE PRECISION,
    "score_investigative" DOUBLE PRECISION,
    "score_artistic" DOUBLE PRECISION,
    "score_social" DOUBLE PRECISION,
    "score_enterprising" DOUBLE PRECISION,
    "score_conventional" DOUBLE PRECISION,
    "top_3_types" JSONB DEFAULT '[]',
    "completed_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riasec_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grit_tests" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "status" "TestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "current_step" INTEGER NOT NULL DEFAULT 0,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "total_score" DOUBLE PRECISION,
    "level" VARCHAR(50),
    "description" TEXT,
    "completed_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grit_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_matches" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "job_title" VARCHAR(255) NOT NULL,
    "match_percentage" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "academic_awards_background_id_idx" ON "academic_awards"("background_id");

-- CreateIndex
CREATE INDEX "non_academic_awards_background_id_idx" ON "non_academic_awards"("background_id");

-- CreateIndex
CREATE INDEX "academic_extracurriculars_background_id_idx" ON "academic_extracurriculars"("background_id");

-- CreateIndex
CREATE INDEX "non_academic_extracurriculars_background_id_idx" ON "non_academic_extracurriculars"("background_id");

-- CreateIndex
CREATE INDEX "work_experiences_background_id_idx" ON "work_experiences"("background_id");

-- CreateIndex
CREATE INDEX "research_experiences_background_id_idx" ON "research_experiences"("background_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_applications_user_id_university_id_key" ON "student_applications"("user_id", "university_id");

-- CreateIndex
CREATE INDEX "profile_analyses_student_id_idx" ON "profile_analyses"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "mbti_tests_student_id_key" ON "mbti_tests"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "riasec_tests_student_id_key" ON "riasec_tests"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "grit_tests_student_id_key" ON "grit_tests"("student_id");

-- CreateIndex
CREATE INDEX "career_matches_student_id_idx" ON "career_matches"("student_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_academic_profiles" ADD CONSTRAINT "student_academic_profiles_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_backgrounds" ADD CONSTRAINT "student_backgrounds_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_awards" ADD CONSTRAINT "academic_awards_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "student_backgrounds"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_academic_awards" ADD CONSTRAINT "non_academic_awards_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "student_backgrounds"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_extracurriculars" ADD CONSTRAINT "academic_extracurriculars_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "student_backgrounds"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_academic_extracurriculars" ADD CONSTRAINT "non_academic_extracurriculars_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "student_backgrounds"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "student_backgrounds"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_experiences" ADD CONSTRAINT "research_experiences_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "student_backgrounds"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_applications" ADD CONSTRAINT "student_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_applications" ADD CONSTRAINT "student_applications_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_analyses" ADD CONSTRAINT "profile_analyses_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mbti_tests" ADD CONSTRAINT "mbti_tests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riasec_tests" ADD CONSTRAINT "riasec_tests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grit_tests" ADD CONSTRAINT "grit_tests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_matches" ADD CONSTRAINT "career_matches_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
