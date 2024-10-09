/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `creatorEmail` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_creatorId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "creatorId",
ADD COLUMN     "creatorEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorEmail_fkey" FOREIGN KEY ("creatorEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
