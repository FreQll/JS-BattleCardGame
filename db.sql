CREATE DATABASE IF NOT EXISTS ucode_card_game;
DROP USER IF EXISTS 'dshchepin'@'localhost';
CREATE USER 'dshchepin'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON ucode_card_game.* TO 'dshchepin'@'localhost';
USE ucode_card_game;

CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    login VARCHAR(255) NOT NULL UNIQUE,
    password TINYTEXT NOT NULL
);
