/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the column `isExpired` on the `Survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "expiryDate",
DROP COLUMN "isExpired",
ADD COLUMN     "closingDate" TIMESTAMP(3),
ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false;
