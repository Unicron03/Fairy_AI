/*
  Warnings:

  - You are about to drop the column `answer` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `tokens` on the `conversation` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokens` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `conversation` DROP COLUMN `answer`,
    DROP COLUMN `duration`,
    DROP COLUMN `question`,
    DROP COLUMN `tokens`;

-- AlterTable
ALTER TABLE `message` ADD COLUMN `duration` INTEGER NOT NULL,
    ADD COLUMN `tokens` INTEGER NOT NULL;
