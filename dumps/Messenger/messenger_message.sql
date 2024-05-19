-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: messenger
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_channel_id` int DEFAULT NULL,
  `receiver_user_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `text` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_content` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `Sender_fk_idx` (`sender_id`),
  KEY `Receiver_channel_fk_idx` (`receiver_channel_id`),
  KEY `Receiver_user_fk_idx` (`receiver_user_id`),
  CONSTRAINT `Receiver_channel_fk` FOREIGN KEY (`receiver_channel_id`) REFERENCES `channel` (`id`),
  CONSTRAINT `Receiver_user_fk` FOREIGN KEY (`receiver_user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `Sender_fk` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,1,NULL,1,'2024-05-18 17:26:01',NULL,'TESTMESSAGE',NULL,NULL),(2,1,NULL,NULL,'2024-05-18 18:58:13',NULL,'hello',NULL,NULL),(3,1,NULL,NULL,'2024-05-18 19:10:28',NULL,'hello',NULL,NULL),(4,1,NULL,1,'2024-05-18 19:18:24',NULL,'hi',NULL,NULL),(5,1,NULL,1,'2024-05-18 19:21:11',NULL,'HELLO',NULL,NULL),(8,1,NULL,1,'2024-05-18 19:24:32',NULL,'me',NULL,NULL),(9,1,NULL,1,'2024-05-18 19:26:03','2024-05-19 12:06:23','BBBBBBBBBBBBB',NULL,NULL),(10,1,NULL,1,'2024-05-18 19:26:12',NULL,'НИШТЯК',NULL,NULL),(11,1,NULL,2,'2024-05-18 19:26:22',NULL,'Привет',NULL,NULL),(12,1,NULL,2,'2024-05-18 19:26:27',NULL,'',NULL,NULL),(13,1,NULL,2,'2024-05-18 19:26:28',NULL,'',NULL,NULL),(14,1,NULL,2,'2024-05-18 19:26:28',NULL,'',NULL,NULL),(15,1,NULL,2,'2024-05-18 19:26:39',NULL,'Привет',NULL,NULL),(16,1,NULL,2,'2024-05-18 19:26:42',NULL,'Это ',NULL,NULL),(17,1,1,NULL,'2024-05-18 19:31:59',NULL,'HELLO',NULL,NULL),(18,1,1,NULL,'2024-05-18 19:34:46',NULL,'dude',NULL,NULL),(19,1,1,NULL,'2024-05-18 19:41:24',NULL,'aaaaaaaa',NULL,NULL),(20,1,1,NULL,'2024-05-18 19:44:00',NULL,'AAAAAAAAAAAAAAAAAAAAAA',NULL,NULL),(21,1,1,NULL,'2024-05-18 19:44:07',NULL,'EEEEEE BOYYYYYYYYYY',NULL,NULL),(22,1,NULL,1,'2024-05-19 10:49:39',NULL,'dawdawdawd',NULL,NULL),(23,1,NULL,1,'2024-05-19 10:54:00',NULL,'dawdawdawd',NULL,NULL),(24,1,NULL,1,'2024-05-19 11:00:23',NULL,'dawdawd',NULL,NULL),(25,1,NULL,1,'2024-05-19 12:53:34',NULL,'dawdwad',NULL,NULL),(26,1,NULL,1,'2024-05-19 12:53:38',NULL,'dddddd',NULL,NULL),(27,1,NULL,1,'2024-05-19 13:46:34',NULL,'hello','addchannel.png','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'),(28,1,NULL,1,'2024-05-19 14:38:01',NULL,'dawdawd',NULL,NULL),(29,17,NULL,1,'2024-05-19 15:24:13',NULL,'Привет',NULL,NULL),(30,17,NULL,1,'2024-05-19 15:27:05',NULL,'Как ты,',NULL,NULL),(31,17,NULL,1,'2024-05-19 15:27:09',NULL,'Жетско',NULL,NULL),(32,1,NULL,17,'2024-05-19 15:27:13',NULL,'Супер',NULL,NULL),(33,1,NULL,17,'2024-05-19 15:27:25',NULL,'на держи','camera.png','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');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-19 20:32:42
