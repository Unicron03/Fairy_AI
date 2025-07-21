-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 21 juil. 2025 à 11:04
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
CREATE DATABASE IF NOT EXISTS `evolea_ai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
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
('2525997b-170e-471e-b4be-f4f547b84a63', '36e59cdc-891b-4856-8d3b-f992da7e9bf1', '2025-07-21 09:01:00.758'),
('2a6e1313-b5d1-4c98-bbed-a9ed77a3c329', 'e43fab31-43c6-4e31-a07d-746223442e63', '2025-07-21 09:00:47.355'),
('a8315227-0787-4e65-8608-7dfcf3ed0022', '36e59cdc-891b-4856-8d3b-f992da7e9bf1', '2025-07-21 09:00:47.427'),
('af27754c-6e6b-48c0-8f43-2ab406b64e34', 'e43fab31-43c6-4e31-a07d-746223442e63', '2025-07-21 09:00:47.346'),
('e315b95d-c265-4780-bee3-e6ecfe412dcc', '36e59cdc-891b-4856-8d3b-f992da7e9bf1', '2025-07-21 09:00:47.419');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `sender` varchar(191) NOT NULL,
  `content` varchar(191) NOT NULL,
  `tokens` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id`, `conversationId`, `sender`, `content`, `tokens`, `duration`, `createdAt`) VALUES
('20af19b0-b5c0-47a1-a25c-3e790410c5ef', 'a8315227-0787-4e65-8608-7dfcf3ed0022', 'assistant', 'Réponse 2 à ev123456.', 30, 6, '2025-07-21 09:00:47.430'),
('51deac1e-9654-4f82-939c-7dedfb5d15b7', 'a8315227-0787-4e65-8608-7dfcf3ed0022', 'user', 'Question 2 de ev123456 ?', 15, 4, '2025-07-21 09:00:47.430'),
('5eeadf05-17d9-42fe-b118-f506f5d6d13b', 'af27754c-6e6b-48c0-8f43-2ab406b64e34', 'assistant', 'Réponse 1 à admin.', 30, 6, '2025-07-21 09:00:47.353'),
('63e50c00-c5ab-439f-8e0f-10aae992061f', 'e315b95d-c265-4780-bee3-e6ecfe412dcc', 'user', 'Question 1 de ev123456 ?', 15, 4, '2025-07-21 09:00:47.424'),
('6ab525d4-1864-4c87-baf2-648b07f16acd', '2a6e1313-b5d1-4c98-bbed-a9ed77a3c329', 'assistant', 'Réponse 2 à admin.', 30, 6, '2025-07-21 09:00:47.359'),
('83c4bd7f-028e-440b-af28-a677b03797c9', '2a6e1313-b5d1-4c98-bbed-a9ed77a3c329', 'user', 'Question 2 de admin ?', 15, 4, '2025-07-21 09:00:47.359'),
('8862f3ae-e4c9-49e2-add7-3d8a2f8c9d95', 'af27754c-6e6b-48c0-8f43-2ab406b64e34', 'user', 'Question 1 de admin ?', 15, 4, '2025-07-21 09:00:47.353'),
('b6b70633-4020-4946-93af-841a8c6b961d', 'e315b95d-c265-4780-bee3-e6ecfe412dcc', 'assistant', 'Réponse 1 à ev123456.', 30, 6, '2025-07-21 09:00:47.424');

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
('36e59cdc-891b-4856-8d3b-f992da7e9bf1', 'ev123456', 'ev@example.com', '$2b$10$VH.xkF9NbieZKUo/O/LwQ..m.vL2wHv75ARsz/yBclIZdupxAqFAa', 'USER', '2025-07-21 09:00:47.415'),
('e43fab31-43c6-4e31-a07d-746223442e63', 'admin', 'admin@example.com', '$2b$10$4uEnRN04jKX76X8yZyiX9uXp89amoWjTFoHDVlWHpyy5vpKYt/kx2', 'ADMIN', '2025-07-21 09:00:47.336');

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
('471359f8-0481-4a3c-8bbe-6b7a74725de5', '2a88bc2d54cee9666cd0299073aa053eb5568ace0d73ffec25296789537edc1b', '2025-07-21 08:10:58.593', '20250721081058_init', NULL, NULL, '2025-07-21 08:10:58.462', 1);

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
