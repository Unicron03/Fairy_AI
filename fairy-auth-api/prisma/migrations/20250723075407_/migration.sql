/*
  Warnings:

  - Added the required column `convName` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `convName` VARCHAR(191) NOT NULL;
