DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
	id INT AUTO_INCREMENT NOT NULL,
    
    name VARCHAR(30),
    
    PRIMARY KEY (id)
);

CREATE TABLE role(
	id INT auto_increment NOT NULL,
    
    title VARCHAR(30),
    
    salary DEC,
    
    department_id INT,
    
    PRIMARY KEY (id),
    
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
	id INT NOT NULL AUTO_INCREMENT,
    
    first_name VARCHAR(30),
    
    last_name VARCHAR(30),
    
    role_id INT,
    
    manager_id INT,
    
    PRIMARY KEY (id),
    
    FOREIGN KEY (role_id) REFERENCES role(id),
    
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name) VALUES 
('Marketing'),
('Software Engineering'),
('Human Resources');

INSERT INTO role (title, salary, department_id) VALUES 
('Engineer Manager',130000,2),
('Senior Engineer',90000,2),
('Software Engineer',75000,2),
('Marketing Manager',90000,1),
('Senior Marketing',90000,1),
('Marketing Specialist',60000,1),
('HR Manager',90000,3),
('Senior HR',70000,3),
('HR Specialist',60000,3);

INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('Georgi','Facello',1,NULL),
('Bezalel','Simmel',2,1),
('Parto','Bamford',2,1),
('Chirstian','Koblick',3,1),
('Kyoichi','Maliniak',3,1),
('Anneke','Preusig',3,1),
('Tzvetan','Zielinski',4,NULL),
('Saniya','Kalloufi',5,7),
('Sumant','Peac',5,7),
('Duangkaew','Piveteau',6,7),
('Mary','Sluis',6,7),
('Patricio','Bridgland',6,7),
('Eberhardt','Terkki',7,NULL),
('Berni','Genin',8,13),
('Guoxiang','Nooteboom',8,13),
('Kazuhito','Cappelletti',9,13),
('Cristinel','Bouloucos',9,13),
('Kazuhide','Peha',9,13);