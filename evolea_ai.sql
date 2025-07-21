-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 21 juil. 2025 à 15:36
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `evolea_ai`
--
CREATE DATABASE IF NOT EXISTS `evolea_ai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `evolea_ai`;

-- --------------------------------------------------------

--
-- Structure de la table `conversation`
--

CREATE TABLE `conversation` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `conversation`
--

INSERT INTO `conversation` (`id`, `userId`, `createdAt`) VALUES
('4b2a6e44-cf23-40ab-9f60-662af093b0d0', '1b8df9c6-f137-492c-8444-639409bf6780', '2025-07-21 13:33:49.476'),
('635078a6-7a89-4318-9557-f20a37e2a3c5', '44105985-40de-475b-8a18-c26ea458787f', '2025-07-21 13:33:49.547'),
('b7698233-18b1-4f78-92b9-9e731afe2e4f', '44105985-40de-475b-8a18-c26ea458787f', '2025-07-21 13:33:49.542'),
('c31a145d-ec44-46b2-a2a1-7a1c84291065', '1b8df9c6-f137-492c-8444-639409bf6780', '2025-07-21 13:33:49.470');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `question` varchar(191) NOT NULL,
  `answer` varchar(191) NOT NULL,
  `tokens` int(11) NOT NULL,
  `duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id`, `conversationId`, `question`, `answer`, `tokens`, `duration`) VALUES
('35b11163-a33a-460f-b966-4aed26e41b2d', '635078a6-7a89-4318-9557-f20a37e2a3c5', 'Question 2 de ev123456 ?', 'Réponse 2 à ev123456.', 15, 4),
('3d365b55-9842-472a-811a-669c254b1c00', 'b7698233-18b1-4f78-92b9-9e731afe2e4f', 'Question 1 de ev123456 ?', 'Réponse 1 à ev123456.', 15, 4),
('3fcbf301-2966-4e53-93fd-6dc5b949f6ce', 'c31a145d-ec44-46b2-a2a1-7a1c84291065', 'Question 1 de admin ?', 'Réponse 1 à admin.', 15, 4),
('57955d49-a6f5-4df7-bc97-2a4595f36aed', '635078a6-7a89-4318-9557-f20a37e2a3c5', 'Question 2 de ev123456 ?', 'Réponse 2 à ev123456.', 42, 17),
('6da66872-45a4-4e22-a3d6-55a40164b2f9', 'b7698233-18b1-4f78-92b9-9e731afe2e4f', 'Question 1 de ev123456 ?', 'Réponse 1 à ev123456.', 42, 17),
('c6aeb3e4-f509-47f8-9143-e67c0c20decb', '4b2a6e44-cf23-40ab-9f60-662af093b0d0', 'Question 2 de admin ?', 'Réponse 2 à admin.', 15, 4),
('eb518882-230f-4b42-b8a0-449fccda453a', 'c31a145d-ec44-46b2-a2a1-7a1c84291065', 'Question 1 de admin ?', 'Réponse 1 à admin.', 42, 17),
('f0d30e18-6db5-406e-af8a-001ff299c85d', '4b2a6e44-cf23-40ab-9f60-662af093b0d0', 'Question 2 de admin ?', 'Réponse 2 à admin.', 42, 17);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `role`, `createdAt`) VALUES
('1b8df9c6-f137-492c-8444-639409bf6780', 'admin', 'admin@example.com', '$2b$10$SXhRXkXx391H3aTBwSvfHOtIEVTD2lnj8/w9EuWsLcQPs1Cl6Q/zC', 'ADMIN', '2025-07-21 13:33:49.462'),
('44105985-40de-475b-8a18-c26ea458787f', 'ev123456', 'ev@example.com', '$2b$10$M6CFywtGSDtOxeer2eX9tOLG0IvFBEbXRetYHqH9R9svywPDnLiT2', 'USER', '2025-07-21 13:33:49.536');

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('8ad6b371-42fe-45c0-9b3a-c18065d86639', '4f00db4b11ecf0f7badf8919f29f47c3811e1e393ec49085ce61b5c041be3301', '2025-07-21 13:32:51.841', '20250721133251_init', NULL, NULL, '2025-07-21 13:32:51.738', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Conversation_userId_fkey` (`userId`);

--
-- Index pour la table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Message_conversationId_fkey` (`conversationId`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_name_key` (`name`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Index pour la table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `Conversation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
