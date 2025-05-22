CREATE DATABASE irctc;
USE irctc;

CREATE TABLE users (
ID INT auto_increment PRIMARY KEY,
firstName VARCHAR(50),
lastName VARCHAR(50),
email VARCHAR(100) UNIQUE,
password VARCHAR(255),
role ENUM('user', 'admin') DEFAULT 'user'
) ENGINE = InnoDB;

INSERT INTO users(firstName, lastName, email, password, role) 
VALUES ('admin', 'admin', 'admin@gmail.com', '$2b$10$WF7OLbPE34CwTQ47xBePK.1DBKpiea17OfDTR23i6aAEL7GAdHWWW', 'admin');

CREATE TABLE trains (
ID INT auto_increment PRIMARY KEY,
trainNumber INT,
name VARCHAR(70),
source VARCHAR(70),
destination VARCHAR(70),
totalSeats INT,
availableSeats INT,
Fare FLOAT
) ENGINE = InnoDB;

CREATE TABLE bookings(
ID INT auto_increment PRIMARY KEY,
userID INT,
trainID INT,
journeyDate DATE,
numberOfSeats INT,
totalFare FLOAT,
status ENUM('Confirmed', 'Cancelled', 'Pending') DEFAULT 'Confirmed',

FOREIGN KEY(userID) REFERENCES users(ID),
FOREIGN KEY(trainID) REFERENCES trains(ID)
) ENGINE = InnoDB;

SELECT * FROM users;
SELECT * FROM trains;
SELECT * FROM bookings;