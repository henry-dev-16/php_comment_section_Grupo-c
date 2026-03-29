CREATE DATABASE IF NOT EXISTS sistema_comentarios
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sistema_comentarios;

CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  creado_en   DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

