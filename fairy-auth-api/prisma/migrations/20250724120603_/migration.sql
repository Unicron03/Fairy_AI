-- DropForeignKey
ALTER TABLE `conversation` DROP FOREIGN KEY `Conversation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_conversationId_fkey`;

-- DropIndex
DROP INDEX `Conversation_userId_fkey` ON `conversation`;

-- DropIndex
DROP INDEX `Message_conversationId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `conversation` MODIFY `convName` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
