DROP DATABSE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
department VARCHAR(30)
);

CREATE TABLE role (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
title VARCHAR(30),
salary DECIMAL(10, 4),
department_id INTEGER
);

CREATE TABLE manager (
id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
manager VARCHAR(30)
);