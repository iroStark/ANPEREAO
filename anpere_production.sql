/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.1.2-MariaDB, for osx10.21 (arm64)
--
-- Host: 127.0.0.1    Database: anpere
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
-- Table structure for table `about_contents`
--

DROP TABLE IF EXISTS `about_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_contents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `section` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `about_contents_section_index` (`section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_contents`
--

LOCK TABLES `about_contents` WRITE;
/*!40000 ALTER TABLE `about_contents` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `about_contents` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `activity_plan_items`
--

DROP TABLE IF EXISTS `activity_plan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_plan_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `activity_plan_id` bigint(20) unsigned NOT NULL,
  `number` int(11) NOT NULL,
  `activity` varchar(255) NOT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `participants` varchar(255) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `parent_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_plan_items_activity_plan_id_foreign` (`activity_plan_id`),
  CONSTRAINT `activity_plan_items_activity_plan_id_foreign` FOREIGN KEY (`activity_plan_id`) REFERENCES `activity_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_plan_items`
--

LOCK TABLES `activity_plan_items` WRITE;
/*!40000 ALTER TABLE `activity_plan_items` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `activity_plan_items` VALUES
(1,1,1,'Reuniões de direcção','Janeiro à Dezembro','A indicar','Sede Social','Membros',0,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(2,1,2,'Difusão de mensagens em datas de efemérides','Janeiro à Dezembro','A indicar','Sede Social','Presidente de Direcção',1,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(3,1,3,'Reuniões de troca de experiências com a FOCOBACC','Janeiro à Dezembro','A indicar','Sede Social da FOCABA','Membros da direcção',2,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(4,1,4,'Visita aos doentes e entrega de cesta básica','Trimestralmente','A indicar','Residência dos doentes','Membros',3,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(5,1,5,'Recontagem da história do R (Lda, Hbo, Mox, Nam, Mal, Huila)','Trimestralmente','A indicar','A indicar','Membros da Família R',4,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(6,1,6,'Exposições fotográficas: Weza Paradise, Acto constitutivo, etc','Trimestralmente','A indicar','Sede Social','Membros da Família R',5,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(7,1,0,'Visitas Turísticas','Trimestralmente','A indicar','Barra do Dande, Barra do Cuanza, Marco Histórico do Kifangondo','Membros',6,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(8,1,7,'Sessão de cinema com a envolvente técnica especializada','Trimestralmente','A indicar','A indicar','Membros',7,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(9,1,8,'Caminhadas pedestres','Mensalmente','7H00','Porto de Luanda x Baleizão','Membros da Família R',8,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(10,1,9,'Jogos de futsal','Mensalmente','A indicar','A indicar','Membros da Família R',9,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
(11,1,10,'Jogos de xadrez','Mensalmente','A indicar','Sede Social','Membros da Família R',10,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18');
/*!40000 ALTER TABLE `activity_plan_items` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `activity_plans`
--

DROP TABLE IF EXISTS `activity_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_plans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `year` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_plans`
--

LOCK TABLES `activity_plans` WRITE;
/*!40000 ALTER TABLE `activity_plans` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `activity_plans` VALUES
(1,'2026','Plano de Actividades 2026','Plano estratégico e operacional para o ano de 2026.',1,'2026-01-27 23:41:18','2026-01-27 23:41:18');
/*!40000 ALTER TABLE `activity_plans` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'unread',
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `capacity` varchar(255) DEFAULT NULL,
  `registration_url` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `galleries`
--

DROP TABLE IF EXISTS `galleries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `galleries` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('image','video') NOT NULL DEFAULT 'image',
  `date` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'Geral',
  `views` int(11) NOT NULL DEFAULT 0,
  `duration` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galleries`
--

LOCK TABLES `galleries` WRITE;
/*!40000 ALTER TABLE `galleries` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `galleries` VALUES
(1,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',271,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011804-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011804-1.jpeg','2026-01-28 10:23:13','2026-01-28 10:23:13','2026-01-28 10:23:13'),
(2,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',322,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011804.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011804.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(3,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',349,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011805-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011805-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(4,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',229,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011805.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011805.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(5,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',29,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011806-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011806-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(6,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',442,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011806.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011806.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(7,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',216,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011807-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011807-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(8,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',424,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011807-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011807-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(9,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',357,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011807-3.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011807-3.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(10,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',170,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011807.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011807.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(11,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',463,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011808.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011808.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(12,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',362,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011811-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011811-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(13,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',157,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011811-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011811-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(14,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',95,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011811-3.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011811-3.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(15,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',110,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011811.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011811.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(16,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',444,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011812-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011812-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(17,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',126,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011812-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011812-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(18,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',82,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011812-3.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011812-3.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(19,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',347,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011812.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011812.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(20,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',224,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011813-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011813-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(21,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',118,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011813-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011813-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(22,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',351,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011813.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011813.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(23,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',363,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011814-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011814-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(24,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',148,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011814-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011814-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(25,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',373,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011814.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011814.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(26,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',128,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011815.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011815.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(27,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',494,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011816.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011816.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(28,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',275,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011817-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011817-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(29,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',131,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011817-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011817-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(30,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',197,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011817.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011817.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(31,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',433,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011818.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011818.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(32,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',183,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011820-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011820-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(33,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',444,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011820-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011820-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(34,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',123,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011820.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011820.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(35,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',227,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011821.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011821.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(36,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',463,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011822.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011822.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(37,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',208,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011823-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011823-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(38,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',383,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011823.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011823.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(39,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',311,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011824-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011824-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(40,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',342,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011824.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011824.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(41,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',478,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011825-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011825-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(42,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',365,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011825-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011825-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(43,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',351,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011825.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011825.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(44,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',103,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011827-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011827-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(45,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',35,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011827.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011827.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(46,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',181,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011834.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011834.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(47,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',367,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011835-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011835-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(48,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',26,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011835.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011835.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(49,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',156,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011842.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011842.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(50,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',180,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011843-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011843-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(51,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',28,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011843.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011843.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(52,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',76,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011844-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011844-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(53,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',72,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011844.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011844.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(54,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',487,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011845-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011845-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(55,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',56,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011845.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011845.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(56,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',432,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011859-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011859-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(57,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',269,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011859.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011859.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(58,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',456,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011900.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011900.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(59,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',292,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012147.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012147.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(60,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',374,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012149-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012149-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(61,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',500,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012149.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012149.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(62,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',261,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012150-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012150-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(63,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',68,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012150.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012150.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(64,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',202,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012152-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012152-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(65,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',449,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012152.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012152.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(66,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',150,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012153-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012153-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(67,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',14,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012153-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012153-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(68,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',210,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012153.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012153.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(69,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',233,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012201.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012201.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(70,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',349,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012202.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012202.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(71,'Acção Social - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Eventos',151,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012456.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012456.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(72,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',223,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012457-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012457-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(73,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',12,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012457-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012457-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(74,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',107,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012457.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012457.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(75,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',459,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012458-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012458-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(76,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Social',330,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012458.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012458.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(77,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',67,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012459-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012459-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(78,'Confraternização de Membros - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',412,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012459-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012459-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(79,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',319,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012459.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012459.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(80,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',18,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012500-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012500-1.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(81,'Evento Técnico - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',277,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012500-2.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012500-2.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14'),
(82,'Assembleia Geral - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Institucional',71,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-012500.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-012500.jpeg','2026-01-28 10:23:14','2026-01-28 10:23:14','2026-01-28 10:23:14');
/*!40000 ALTER TABLE `galleries` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `legislations`
--

DROP TABLE IF EXISTS `legislations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `legislations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legislations`
--

LOCK TABLES `legislations` WRITE;
/*!40000 ALTER TABLE `legislations` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `legislations` VALUES
(1,'Estatutos Revistos 2025','Estatutos da ANPERE revistos em Junho de 2025.','Estatuto','2025','BookOpen','/storage/legislation/estatutos-revistos-junho-2025.pdf','2026-01-28 10:51:44','2026-01-28 10:51:44','2026-01-28 10:51:44');
/*!40000 ALTER TABLE `legislations` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `member_number` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `marital_status` varchar(255) DEFAULT NULL,
  `id_document` varchar(255) DEFAULT NULL,
  `id_issue_date` date DEFAULT NULL,
  `id_issue_place` varchar(255) DEFAULT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `current_address` text DEFAULT NULL,
  `municipality` varchar(255) DEFAULT NULL,
  `work_province` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `other_info` text DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2026_01_27_000000_create_anpere_tables',1),
(5,'2026_01_27_000001_create_personal_access_tokens_table',1),
(6,'2026_01_27_000001_refactor_activity_plans',1),
(7,'2026_01_27_000002_create_timeline_events_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'info',
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_foreign` (`user_id`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `personal_access_tokens` VALUES
(1,'App\\Models\\User',1,'admin-token','4806b49f5640551bf070486de31340fe31b7200119bfb5a79c10b52e9a913fc0','[\"*\"]',NULL,NULL,'2026-01-28 11:00:51','2026-01-28 11:00:51');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `publications`
--

DROP TABLE IF EXISTS `publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `publications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `download_url` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publications`
--

LOCK TABLES `publications` WRITE;
/*!40000 ALTER TABLE `publications` DISABLE KEYS */;
set autocommit=0;
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
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `period` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `reports` VALUES
(1,'Relatório e Contas 2024 - 2025','Relatório e contas oficial da ANPERE respectivo ao período 2024-2025.','Relatório e Contas','published','2024/2025','/storage/reports/relatorio-e-contas-2024-2025.pdf','2026-01-28 10:51:44','2026-01-28 10:51:44');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `sessions` VALUES
('0m50gjn39yvRNqySXco38wS1qE0WTrV4WRLBArb1',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoicERsNGFyYTFRbWE5cHRLQ2xkOGh2aU53RUIxNmx4NWdLQURQOUJkWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769601894),
('3dAoIgudeVivIa66mzfjpJRiWyuAvAC4e3llqMxr',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHhLZEV4YUI4T2tWMER6WWVBSTJyQ21LQ0o1TDh2YWZzMlNMeXJUaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYWN0aXZpdHktcGxhbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1769600034),
('55hBq1aIHP83VHRtUSV4KQn7l6IRWJGzyyfs2F1o',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQkFLOFhjdTRKQzEyOXpVV3BEREJjVzhYSTlXNElUVTB6WWpVaGwyRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769600084),
('90uYwLaJhBlCqrXCa5vD72F4bsxnORrKGu7XtIzi',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSDFtWHlFNk5TQkVZMHowTWNpVXc5bXJ4WVM1WFQyclJzYkJhczFreiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769601493),
('a1OhhlZaaWkcXTPvK4wgChbXlAllXwclpBa4tRdt',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidmxqVjFMNDVpdjVpT203T3lYbGl6N2NxbWRoYnUzWU5QNHBLUTZzdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769598993),
('Bj9qEt11CdUE5iFbnxR9VSGSTigh9Apowe893yiH',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSzBpWjNxaHZpQ2l3M1g2Mm9veVFnbDk0eDF4RWthSFlvZWxkVlg1SyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769600961),
('gADGwMcwwpZqzHv961LBUYWx4NvxcQrn8ATSpjok',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWjcxc0tQalJpdnBVQmZjT0pTRzB2WTNkaVpmSER2ekl4WVNiZWVxQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769601385),
('gB6TJ8KsqyFG5aVEsDIyzdUqS2GanxA9OpU7AOfg',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZjdHVjBIdmNmeHVsSEFjemh3R2ZRZ3R6c1p0UW1uVW5lbWxkRlluMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769601855),
('H8S42iM8K4gD9VSvXf6rVlmKc4lyG8VqQEJYUQxI',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTo1OntzOjY6Il90b2tlbiI7czo0MDoicWVzTWsyaDg1T2pFME53YkpETXVHMjI5RVdJSFRDOEdWekYxREprdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYWRtaW4vbm90aWZpY2F0aW9ucy91bnJlYWQtY291bnQiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjQ6ImFkODhhYzY5OTE2OWI2MjI0MTY4M2IwYjg0ODc4NWI0NThjMGRiNDYzOGZmMGU4NGYyNTg1ODYxMTEyNDk2OTciO30=',1769601991),
('ik7qd67CODTWuS2RgoE4Lf8MQcUJRGVH5Nae2ZXC',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoieUxVZzk5aDRrN1ZkWGFaTHVSbFhBNEJMbmF5a3ZQZmtJV09jRDIxMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYWN0aXZpdHktcGxhbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1769600143),
('NdvCS5bUZmSsgimqWudo4WVHp1WwCelbpzjNQ7sk',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZGppbXJRZ3BqTWJkMGlVNFVIcFVFbmZZZzZLME04VkNwZEVEWVQwdSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769601375),
('ty5ZXbuXVfLIzb4TOF7VObhoGkMm7h1Ar7iaXENH',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHJyRW5oMFVHWVNTaG9BUzNYR1NMSGJvVU85QjdsbWFzTGowS1dYMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769600268),
('wjtmpPv47SO0nzx9K9VwDoPYtQCaf4s0X6wwMDPy',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiR0pHVG1KM2daczFZYThuQzBjR0ZNdVNmQW5UaEZMZTc1QWV4RWNEUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769601173),
('y8PwWMXjsJKtY3b4aY9plRTcdhyHDy505NGcqEP4',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWFRlUGVNUmp2QTFlazlVRlJSYWlRRWtFb1hZRGlYWW9OZndwQjlrdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769600022),
('YwrO4JRLluRZVCY8KQ4v84P4UknTY3M5RHBVsg3b',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoid0lUSGhWSHVPMDdMTFdMNTBFSmJoMHlqeE43U1VrV044N2lSaEpWWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdGltZWxpbmUtZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1769599110),
('ZY6Y7dI4Qg75UTebw6WctEBjcPI5RciaXbHXRhra',NULL,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibm5jMWdaR3ZYQUpqcklzYmxvWk9WcFd3VFNOTWRiOGRORXNIaWFqbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYWN0aXZpdHktcGxhbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1769600085);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `slideshows`
--

DROP TABLE IF EXISTS `slideshows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `slideshows` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slideshows`
--

LOCK TABLES `slideshows` WRITE;
/*!40000 ALTER TABLE `slideshows` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `slideshows` VALUES
(1,'Tecnologia e Inovação','Avançando nas telecomunicações angolanas','http://localhost:8000/storage/uploads/ZFkY5XeNoJCI0UBKD4YhACIe9EwXh9C8LVeFczec.png',NULL,1,1,'2026-01-28 10:55:39','2026-01-28 11:04:09'),
(2,'Membros da ANPERE','Unidos pela profissão','http://localhost:8000/storage/uploads/sR6i1vCKPe6tjxqiMN6Isa4qT8ro5OwsypdrQ7g3.jpg',NULL,2,1,'2026-01-28 10:55:39','2026-01-28 11:03:30'),
(3,'Assembleia de Constituição da ANPERE','Unidade e determinação dos profissionais','http://localhost:8000/storage/uploads/STl4OfoluJfAmUvUi5izn7Em5OIfxbtyBCtNxDnv.png',NULL,3,1,'2026-01-28 10:55:39','2026-01-28 11:04:48');
/*!40000 ALTER TABLE `slideshows` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `social_orgaos`
--

DROP TABLE IF EXISTS `social_orgaos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `social_orgaos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `organ_type` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_orgaos`
--

LOCK TABLES `social_orgaos` WRITE;
/*!40000 ALTER TABLE `social_orgaos` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `social_orgaos` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `timeline_events`
--

DROP TABLE IF EXISTS `timeline_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `timeline_events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `year` varchar(255) NOT NULL,
  `event` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `details` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES
(1,'Administrador','admin@anpere.ao',NULL,'$2y$12$Ok5dsFQO.NFWRtwlFPe3N..D7eHKA1k02/r4KUReEDkpbyLhqV6qK',NULL,'2026-01-28 10:59:11','2026-01-28 10:59:11','admin','admin',1,NULL);
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

-- Dump completed on 2026-01-28 13:06:53
