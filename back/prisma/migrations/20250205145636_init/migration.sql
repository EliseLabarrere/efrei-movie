/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `session` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Reservation` DROP COLUMN `sessionId`,
    DROP COLUMN `time`,
    ADD COLUMN `session` DATETIME(3) NOT NULL;
