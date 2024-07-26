/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Verification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "updateAt",
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "code" DROP NOT NULL;
