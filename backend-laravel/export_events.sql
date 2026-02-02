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
-- Dumping data for table `activity_plans`
--

LOCK TABLES `activity_plans` WRITE;
/*!40000 ALTER TABLE `activity_plans` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `activity_plans` (`id`, `year`, `title`, `description`, `is_active`, `created_at`, `updated_at`) VALUES (1,'2026','Plano de Actividades 2026','Plano estratégico e operacional para o ano de 2026.',1,'2026-01-27 23:41:18','2026-01-27 23:41:18');
/*!40000 ALTER TABLE `activity_plans` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table `activity_plan_items`
--

LOCK TABLES `activity_plan_items` WRITE;
/*!40000 ALTER TABLE `activity_plan_items` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `activity_plan_items` (`id`, `activity_plan_id`, `number`, `activity`, `date`, `time`, `location`, `participants`, `order_index`, `parent_id`, `created_at`, `updated_at`) VALUES (1,1,1,'Reuniões de direcção','Janeiro à Dezembro','A indicar','Sede Social','Membros',0,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
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
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-01-28 16:51:06
