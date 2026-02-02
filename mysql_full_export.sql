/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.1.2-MariaDB, for osx10.21 (arm64)
--
-- Host: 127.0.0.1    Database: anpere
-- ------------------------------------------------------
-- Server version	12.1.2-MariaDB
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO,POSTGRESQL' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Dumping data for table "about_contents"
--

LOCK TABLES "about_contents" WRITE;
/*!40000 ALTER TABLE "about_contents" DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE "about_contents" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "activity_plan_items"
--

LOCK TABLES "activity_plan_items" WRITE;
/*!40000 ALTER TABLE "activity_plan_items" DISABLE KEYS */;
set autocommit=0;
INSERT INTO "activity_plan_items" ("id", "activity_plan_id", "number", "activity", "date", "time", "location", "participants", "order_index", "parent_id", "created_at", "updated_at") VALUES (1,1,1,'Reuniões de direcção','Janeiro à Dezembro','A indicar','Sede Social','Membros',0,NULL,'2026-01-27 23:41:18','2026-01-27 23:41:18'),
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
/*!40000 ALTER TABLE "activity_plan_items" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "activity_plans"
--

LOCK TABLES "activity_plans" WRITE;
/*!40000 ALTER TABLE "activity_plans" DISABLE KEYS */;
set autocommit=0;
INSERT INTO "activity_plans" ("id", "year", "title", "description", "is_active", "created_at", "updated_at") VALUES (1,'2026','Plano de Actividades 2026','Plano estratégico e operacional para o ano de 2026.',1,'2026-01-27 23:41:18','2026-01-27 23:41:18');
/*!40000 ALTER TABLE "activity_plans" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "contact_messages"
--

LOCK TABLES "contact_messages" WRITE;
/*!40000 ALTER TABLE "contact_messages" DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE "contact_messages" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "events"
--

LOCK TABLES "events" WRITE;
/*!40000 ALTER TABLE "events" DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE "events" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "galleries"
--

LOCK TABLES "galleries" WRITE;
/*!40000 ALTER TABLE "galleries" DISABLE KEYS */;
set autocommit=0;
INSERT INTO "galleries" ("id", "title", "description", "type", "date", "category", "views", "duration", "thumbnail", "media_url", "published_at", "created_at", "updated_at") VALUES (1,'Visita Institucional - 28/01/2026','Registo fotográfico das actividades recentes da ANPERE.','image','2026-01-28','Reuniões',271,NULL,'/storage/gallery/whatsapp-image-2026-01-28-at-011804-1.jpeg','/storage/gallery/whatsapp-image-2026-01-28-at-011804-1.jpeg','2026-01-28 10:23:13','2026-01-28 10:23:13','2026-01-28 10:23:13'),
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
/*!40000 ALTER TABLE "galleries" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "legislations"
--

LOCK TABLES "legislations" WRITE;
/*!40000 ALTER TABLE "legislations" DISABLE KEYS */;
set autocommit=0;
INSERT INTO "legislations" ("id", "title", "description", "category", "year", "icon", "file_url", "published_at", "created_at", "updated_at") VALUES (1,'Estatutos Revistos 2025','Estatutos da ANPERE revistos em Junho de 2025.','Estatuto','2025','BookOpen','/storage/legislation/estatutos-revistos-junho-2025.pdf','2026-01-28 10:51:44','2026-01-28 10:51:44','2026-01-28 10:51:44');
/*!40000 ALTER TABLE "legislations" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "members"
--

LOCK TABLES "members" WRITE;
/*!40000 ALTER TABLE "members" DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE "members" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "notifications"
--

LOCK TABLES "notifications" WRITE;
/*!40000 ALTER TABLE "notifications" DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE "notifications" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "publications"
--

LOCK TABLES "publications" WRITE;
/*!40000 ALTER TABLE "publications" DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE "publications" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "reports"
--

LOCK TABLES "reports" WRITE;
/*!40000 ALTER TABLE "reports" DISABLE KEYS */;
set autocommit=0;
INSERT INTO "reports" ("id", "title", "description", "type", "status", "period", "file_url", "created_at", "updated_at") VALUES (1,'Relatório e Contas 2024 - 2025','Relatório e contas oficial da ANPERE respectivo ao período 2024-2025.','Relatório e Contas','published','2024/2025','/storage/reports/relatorio-e-contas-2024-2025.pdf','2026-01-28 10:51:44','2026-01-28 10:51:44');
/*!40000 ALTER TABLE "reports" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "slideshows"
--

LOCK TABLES "slideshows" WRITE;
/*!40000 ALTER TABLE "slideshows" DISABLE KEYS */;
set autocommit=0;
INSERT INTO "slideshows" ("id", "title", "subtitle", "image_url", "link", "order_index", "active", "created_at", "updated_at") VALUES (1,'Tecnologia e Inovação','Avançando nas telecomunicações angolanas','http://localhost:8000/storage/uploads/ZFkY5XeNoJCI0UBKD4YhACIe9EwXh9C8LVeFczec.png',NULL,1,1,'2026-01-28 10:55:39','2026-01-28 11:04:09'),
(2,'Membros da ANPERE','Unidos pela profissão','http://localhost:8000/storage/uploads/sR6i1vCKPe6tjxqiMN6Isa4qT8ro5OwsypdrQ7g3.jpg',NULL,2,1,'2026-01-28 10:55:39','2026-01-28 11:03:30'),
(3,'Assembleia de Constituição da ANPERE','Unidade e determinação dos profissionais','http://localhost:8000/storage/uploads/STl4OfoluJfAmUvUi5izn7Em5OIfxbtyBCtNxDnv.png',NULL,3,1,'2026-01-28 10:55:39','2026-01-28 11:04:48');
/*!40000 ALTER TABLE "slideshows" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "social_orgaos"
--

LOCK TABLES "social_orgaos" WRITE;
/*!40000 ALTER TABLE "social_orgaos" DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE "social_orgaos" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "timeline_events"
--

LOCK TABLES "timeline_events" WRITE;
/*!40000 ALTER TABLE "timeline_events" DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE "timeline_events" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "users"
--

LOCK TABLES "users" WRITE;
/*!40000 ALTER TABLE "users" DISABLE KEYS */;
set autocommit=0;
INSERT INTO "users" ("id", "name", "email", "email_verified_at", "password", "remember_token", "created_at", "updated_at", "username", "role", "is_active", "last_login_at") VALUES (1,'Administrador','admin@anpere.ao',NULL,'$2y$12$Ok5dsFQO.NFWRtwlFPe3N..D7eHKA1k02/r4KUReEDkpbyLhqV6qK',NULL,'2026-01-28 10:59:11','2026-01-28 10:59:11','admin','admin',1,NULL);
/*!40000 ALTER TABLE "users" ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping data for table "personal_access_tokens"
--

LOCK TABLES "personal_access_tokens" WRITE;
/*!40000 ALTER TABLE "personal_access_tokens" DISABLE KEYS */;
set autocommit=0;
INSERT INTO "personal_access_tokens" ("id", "tokenable_type", "tokenable_id", "name", "token", "abilities", "last_used_at", "expires_at", "created_at", "updated_at") VALUES (1,'App\\Models\\User',1,'admin-token','4806b49f5640551bf070486de31340fe31b7200119bfb5a79c10b52e9a913fc0','[\"*\"]',NULL,NULL,'2026-01-28 11:00:51','2026-01-28 11:00:51'),
(2,'App\\Models\\User',1,'admin-token','65ed9427aaa476a646b76ef74eb858197f138a72f3e0b742c74d885416e3eabf','[\"*\"]','2026-02-02 11:25:37',NULL,'2026-02-02 11:22:05','2026-02-02 11:25:37');
/*!40000 ALTER TABLE "personal_access_tokens" ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-02-02 14:14:53
