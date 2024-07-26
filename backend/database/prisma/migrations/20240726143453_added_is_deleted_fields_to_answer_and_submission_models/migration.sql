-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
