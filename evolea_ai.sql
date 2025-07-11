-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 11 juil. 2025 à 16:09
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
('05b61d72-e6d9-4c55-ab6f-a250ff7465a1', '144284ab-68cf-4d93-b495-99ae2dd3c775', '2025-07-11 13:41:07.419'),
('0e75828c-064a-4068-9dd9-f5f6f9a6b41a', 'fc81377a-0ab8-4f9f-bf7d-1c5caff3ed46', '2025-07-11 13:41:07.347'),
('6cdf5b45-899e-4033-9ea4-fcddb830827c', '144284ab-68cf-4d93-b495-99ae2dd3c775', '2025-07-11 13:30:03.782'),
('717e8d07-e26f-42e8-86c9-911990216a43', 'fc81377a-0ab8-4f9f-bf7d-1c5caff3ed46', '2025-07-11 13:30:03.773'),
('84125b36-01b6-460f-b134-9ecc8cb439ab', 'fc81377a-0ab8-4f9f-bf7d-1c5caff3ed46', '2025-07-11 13:30:03.779'),
('ad5064fc-9b3d-4dc0-8c41-36119ac45a9e', '144284ab-68cf-4d93-b495-99ae2dd3c775', '2025-07-11 13:30:03.787'),
('b1c62c97-b9ff-4acd-9ddf-97a98d61842b', 'fc81377a-0ab8-4f9f-bf7d-1c5caff3ed46', '2025-07-11 13:41:07.353'),
('dc93298c-85cf-4da2-8b47-e72f613f3ba5', '144284ab-68cf-4d93-b495-99ae2dd3c775', '2025-07-11 13:30:03.790'),
('e0354a79-dbd8-46ef-8dca-207cc4646ceb', '144284ab-68cf-4d93-b495-99ae2dd3c775', '2025-07-11 13:41:07.428');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE `message` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `sender` varchar(191) NOT NULL,
  `content` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `duration` int(11) NOT NULL,
  `tokens` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id`, `conversationId`, `sender`, `content`, `createdAt`, `duration`, `tokens`) VALUES
('27f27b30-5d41-418b-916c-39f2a7b2742c', 'b1c62c97-b9ff-4acd-9ddf-97a98d61842b', 'assistant', 'Réponse 2 à admin.', '2025-07-11 13:41:07.360', 6, 30),
('3b80e4c0-0c2f-44c2-9ea2-601f0239b711', '05b61d72-e6d9-4c55-ab6f-a250ff7465a1', 'assistant', 'Réponse 1 à ev123456.', '2025-07-11 13:41:07.424', 6, 30),
('6f0cffa8-2e34-4ed3-a002-1f9bad584bb3', '0e75828c-064a-4068-9dd9-f5f6f9a6b41a', 'assistant', 'Réponse 1 à admin.', '2025-07-11 13:41:07.351', 6, 30),
('7cdba84e-2fd0-45e3-b735-8900be3f79b7', 'e0354a79-dbd8-46ef-8dca-207cc4646ceb', 'assistant', 'Réponse 2 à ev123456.', '2025-07-11 13:41:07.430', 6, 30),
('80e5cde8-5842-4c30-9f54-4b35300c83cf', 'b1c62c97-b9ff-4acd-9ddf-97a98d61842b', 'user', 'Question 2 de admin ?', '2025-07-11 13:41:07.360', 4, 15),
('a0563e04-7b9f-4329-890a-9507c157078c', 'e0354a79-dbd8-46ef-8dca-207cc4646ceb', 'user', 'Question 2 de ev123456 ?', '2025-07-11 13:41:07.430', 4, 15),
('a7509bb2-ffd9-4d00-b133-1ab6614c76c5', '0e75828c-064a-4068-9dd9-f5f6f9a6b41a', 'user', 'Question 1 de admin ?', '2025-07-11 13:41:07.351', 4, 15),
('f1787c3e-756f-466e-85d3-238a9480861f', '05b61d72-e6d9-4c55-ab6f-a250ff7465a1', 'user', 'Question 1 de ev123456 ?', '2025-07-11 13:41:07.424', 4, 15);

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
('144284ab-68cf-4d93-b495-99ae2dd3c775', 'ev123456', 'ev@example.com', '$2b$10$3Q4AEMxVOB0Nt21ZM0gj5u7RN.BMoma7RLnrpimfnO5Pl1tEHMVTW', 'USER', '2025-07-09 10:00:47.540'),
('fc81377a-0ab8-4f9f-bf7d-1c5caff3ed46', 'admin', 'admin@example.com', '$2b$10$eM6RriVvgqBklLmpnBMHzOejiFHCfj6MHs3wkfZDQOn1fYaOBPE1O', 'ADMIN', '2025-07-09 09:12:55.258');

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
('7fe2327f-926b-4041-a880-948b7d2b8738', '8bde66f937a8af767cf8ebb8d8c066d1446e3992ea63d5f3d8c7b4e41381c642', '2025-07-11 13:29:10.480', '20250711132910_', NULL, NULL, '2025-07-11 13:29:10.429', 1),
('a5036d3c-a9c3-44fd-9ea7-4d8c9d5ecb45', '73f00fe6690896e9ab9defbf4a0a60d7d2f07d1eca41a41d331ec11b35221e6f', '2025-07-09 08:23:04.961', '20250709082304_init', NULL, NULL, '2025-07-09 08:23:04.858', 1),
('d67941b1-76c2-4cbc-870b-e3e39b9a82b8', '22c84986cd79c274592c88a8d6c36ca0ee3933b6da2b5a78a4fd63216e29789c', '2025-07-11 13:35:32.386', '20250711133532_', NULL, NULL, '2025-07-11 13:35:32.365', 1);

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
