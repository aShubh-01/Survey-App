/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `votes` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `attempts` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `closingDate` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Survey` table. All the data in the column will be lost.
  - Made the column `optionId` on table `Answer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "isDeleted",
ALTER COLUMN "optionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "isDeleted",
DROP COLUMN "votes";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "attempts",
DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "closingDate",
DROP COLUMN "isDeleted";

-- CreateTable
CREATE TABLE "CheckboxesResponse" (
    "id" SERIAL NOT NULL,
    "answerId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "CheckboxesResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckboxesResponse" ADD CONSTRAINT "CheckboxesResponse_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckboxesResponse" ADD CONSTRAINT "CheckboxesResponse_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
