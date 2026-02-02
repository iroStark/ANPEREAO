/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.1.2-MariaDB, for osx10.21 (arm64)
--
-- Host: localhost    Database: anpere
-- ------------------------------------------------------
-- Server version	12.1.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `about_content`
--

DROP TABLE IF EXISTS `about_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_content` (
  `id` varchar(36) NOT NULL,
  `section` varchar(50) NOT NULL,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_content`
--

LOCK TABLES `about_content` WRITE;
/*!40000 ALTER TABLE `about_content` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `about_content` VALUES
('0311fab3-74ee-435e-afae-65d22b380350','vision','Nossa Visão','Ser a referência nacional na representação dos profissionais das telecomunicações, contribuindo para o desenvolvimento tecnológico e social de Angola.','2025-11-28 04:14:57'),
('91a4344b-b5f2-4626-aab9-c639867e77ef','mission','Nossa Missão','Representar e promover os interesses dos profissionais do espectro radioeléctrico em Angola, fomentando a excelência técnica e o desenvolvimento sustentável do sector das telecomunicações.','2025-11-28 04:14:57');
/*!40000 ALTER TABLE `about_content` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `activity_plan`
--

DROP TABLE IF EXISTS `activity_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_plan` (
  `id` varchar(36) NOT NULL,
  `year` varchar(4) NOT NULL,
  `title` text NOT NULL DEFAULT 'Plano de Atividades',
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_plan`
--

LOCK TABLES `activity_plan` WRITE;
/*!40000 ALTER TABLE `activity_plan` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `activity_plan` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `activity_plan_items`
--

DROP TABLE IF EXISTS `activity_plan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_plan_items` (
  `id` varchar(36) NOT NULL,
  `plan_id` varchar(36) NOT NULL,
  `number` int(11) NOT NULL,
  `activity` text NOT NULL,
  `date` text DEFAULT NULL,
  `time` text DEFAULT NULL,
  `location` text DEFAULT NULL,
  `participants` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `parent_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `activity_plan_items_plan_id_activity_plan_id_fk` (`plan_id`),
  CONSTRAINT `activity_plan_items_plan_id_activity_plan_id_fk` FOREIGN KEY (`plan_id`) REFERENCES `activity_plan` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_plan_items`
--

LOCK TABLES `activity_plan_items` WRITE;
/*!40000 ALTER TABLE `activity_plan_items` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `activity_plan_items` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` varchar(36) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `phone` text DEFAULT NULL,
  `subject` text NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` varchar(36) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `date` varchar(50) NOT NULL,
  `time` varchar(50) NOT NULL,
  `location` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `capacity` varchar(20) DEFAULT NULL,
  `registration_url` text DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `events` VALUES
('429c3e0a-69aa-4092-ac86-f29943dd1da2','Conferência Nacional de Telecomunicações 2024','Evento anual que reúne profissionais do sector para debater as tendências e inovações','15 de Junho, 2024','09:00 - 17:00','Hotel Presidente, Luanda','Conferência','200+',NULL,'2025-11-28 04:14:57','2025-11-28 04:14:57');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` varchar(36) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `type` varchar(10) NOT NULL,
  `date` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `views` int(11) DEFAULT 0,
  `duration` varchar(20) DEFAULT NULL,
  `thumbnail` text DEFAULT NULL,
  `media_url` text DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `gallery` VALUES
('796e8935-7ea7-423f-b31c-9326e3097e28','Conferência Nacional de Telecomunicações 2023','Momentos marcantes da conferência anual que reuniu mais de 300 profissionais','image','Junho 2023','Evento',1250,NULL,'placeholder-conference.jpg',NULL,'2025-11-28 04:14:57','2025-11-28 04:14:57');
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `legislation`
--

DROP TABLE IF EXISTS `legislation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `legislation` (
  `id` varchar(36) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `year` varchar(4) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `content` text DEFAULT NULL,
  `file_url` text DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legislation`
--

LOCK TABLES `legislation` WRITE;
/*!40000 ALTER TABLE `legislation` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `legislation` VALUES
('512064a4-1644-40d5-8da3-e785618d948c','Lei das Comunicações Electrónicas','Lei fundamental que regula o sector das comunicações electrónicas em Angola','Lei Principal','2023','Scale',NULL,NULL,'2025-11-28 04:14:57','2025-11-28 04:14:57');
/*!40000 ALTER TABLE `legislation` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` varchar(36) NOT NULL,
  `member_number` varchar(20) DEFAULT NULL,
  `full_name` text NOT NULL,
  `birth_date` varchar(50) NOT NULL,
  `birth_place` text NOT NULL,
  `nationality` varchar(50) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `marital_status` varchar(20) NOT NULL,
  `id_document` varchar(50) NOT NULL,
  `id_issue_date` varchar(50) NOT NULL,
  `id_issue_place` text NOT NULL,
  `father_name` text NOT NULL,
  `mother_name` text NOT NULL,
  `occupation` text NOT NULL,
  `phone` varchar(20) NOT NULL,
  `current_address` text NOT NULL,
  `municipality` text NOT NULL,
  `work_province` text NOT NULL,
  `email` text NOT NULL,
  `photo_url` text DEFAULT NULL,
  `other_info` text DEFAULT NULL,
  `registration_date` timestamp NULL DEFAULT current_timestamp(),
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` varchar(36) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` text NOT NULL,
  `message` text NOT NULL,
  `link` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `related_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `read_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `orgaos_sociais`
--

DROP TABLE IF EXISTS `orgaos_sociais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orgaos_sociais` (
  `id` varchar(36) NOT NULL,
  `name` text NOT NULL,
  `position` varchar(100) NOT NULL,
  `organ_type` varchar(50) NOT NULL,
  `bio` text DEFAULT NULL,
  `photo_url` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orgaos_sociais`
--

LOCK TABLES `orgaos_sociais` WRITE;
/*!40000 ALTER TABLE `orgaos_sociais` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `orgaos_sociais` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `publications`
--

DROP TABLE IF EXISTS `publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `publications` (
  `id` varchar(36) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `date` varchar(50) NOT NULL,
  `file_url` text DEFAULT NULL,
  `download_url` text DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publications`
--

LOCK TABLES `publications` WRITE;
/*!40000 ALTER TABLE `publications` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `publications` VALUES
('2045dabc-70a1-4814-85b3-74dc6888ac9d','Plano de Actividades 2024','Planeamento estratégico das actividades da ANPERE para o ano de 2024','Plano','Janeiro 2024',NULL,NULL,'2025-11-28 04:14:57','2025-11-28 04:14:57');
/*!40000 ALTER TABLE `publications` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` varchar(36) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `type` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `period` varchar(50) NOT NULL,
  `file_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` varchar(36) NOT NULL,
  `key` text NOT NULL,
  `value` text NOT NULL,
  `description` text NOT NULL,
  `category` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `slideshow`
--

DROP TABLE IF EXISTS `slideshow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `slideshow` (
  `id` varchar(36) NOT NULL,
  `title` text NOT NULL,
  `subtitle` text DEFAULT NULL,
  `description` text NOT NULL,
  `image_url` text NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slideshow`
--

LOCK TABLES `slideshow` WRITE;
/*!40000 ALTER TABLE `slideshow` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `slideshow` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `timeline_events`
--

DROP TABLE IF EXISTS `timeline_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline_events` (
  `id` varchar(36) NOT NULL,
  `year` varchar(10) NOT NULL,
  `event` text NOT NULL,
  `description` text NOT NULL,
  `details` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline_events`
--

LOCK TABLES `timeline_events` WRITE;
/*!40000 ALTER TABLE `timeline_events` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `timeline_events` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` text NOT NULL,
  `email` text DEFAULT NULL,
  `password` text NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'viewer',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `last_login_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES
('853622f5-e280-4ebd-9943-4282e3d43775','admin',NULL,'$2b$10$k4.uxuR9PmK2Orgtar1gW.VGZ.IFkmh5kqN7piX4t9TuAw8oSVSEm','admin',1,'2025-11-28 04:14:57',NULL,'2025-11-28 04:14:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-01-26 21:48:34
