/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Registration_team_idx" ON "Registration"("team");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_userId_eventId_key" ON "Registration"("userId", "eventId");
