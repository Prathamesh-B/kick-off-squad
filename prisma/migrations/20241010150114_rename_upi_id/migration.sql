/*
  Warnings:

  - You are about to drop the column `upiNumber` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "upiNumber",
ADD COLUMN     "upiId" TEXT;
