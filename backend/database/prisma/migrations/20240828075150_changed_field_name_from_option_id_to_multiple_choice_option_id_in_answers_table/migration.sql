/*
  Warnings:

  - You are about to drop the column `optionId` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `multipleChoiceOptionId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_optionId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "optionId",
ADD COLUMN     "multipleChoiceOptionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_multipleChoiceOptionId_fkey" FOREIGN KEY ("multipleChoiceOptionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
