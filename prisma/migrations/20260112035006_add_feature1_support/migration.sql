-- AlterTable
ALTER TABLE "academic_awards" ADD COLUMN     "category" VARCHAR(50),
ADD COLUMN     "rank" INTEGER,
ADD COLUMN     "region" VARCHAR(50),
ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "academic_extracurriculars" ADD COLUMN     "region" VARCHAR(50),
ADD COLUMN     "scale" INTEGER;

-- AlterTable
ALTER TABLE "non_academic_awards" ADD COLUMN     "rank" INTEGER,
ADD COLUMN     "region" VARCHAR(50),
ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "non_academic_extracurriculars" ADD COLUMN     "region" VARCHAR(50),
ADD COLUMN     "scale" INTEGER;

-- CreateTable
CREATE TABLE "subject_scores" (
    "id" UUID NOT NULL,
    "background_id" UUID NOT NULL,
    "subject" VARCHAR(100) NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "year" INTEGER,
    "semester" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subject_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_projects" (
    "id" UUID NOT NULL,
    "background_id" UUID NOT NULL,
    "project_name" VARCHAR(255) NOT NULL,
    "topic" VARCHAR(100),
    "description" TEXT,
    "duration_months" INTEGER,
    "impact" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_skills" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "skill_name" VARCHAR(150) NOT NULL,
    "proficiency" VARCHAR(50),
    "category" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subject_scores_background_id_idx" ON "subject_scores"("background_id");

-- CreateIndex
CREATE INDEX "personal_projects_background_id_idx" ON "personal_projects"("background_id");

-- CreateIndex
CREATE INDEX "student_skills_student_id_idx" ON "student_skills"("student_id");

-- AddForeignKey
ALTER TABLE "subject_scores" ADD CONSTRAINT "subject_scores_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "student_backgrounds"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_projects" ADD CONSTRAINT "personal_projects_background_id_fkey" FOREIGN KEY ("background_id") REFERENCES "student_backgrounds"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
