DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE department (
	id INT auto_increment,
	name VARCHAR(30) NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE roles (
	id INT auto_increment,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL auto_increment,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    role_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- DEPARTMENTS --
INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Marketing");

INSERT INTO department (name)
VALUES ("Engineer");

INSERT INTO department (name)
VALUES ("Human Resource");

INSERT INTO department (name)
VALUES ("Finance");



-- ROLES --
INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Operation Manager", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Rep", 60000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Salesperson", 40000, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Marketing Manager", 100000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Marketing Specialit", 80000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Brand Ambassador", 40000, 2);

INSERT INTO roles (title, salary, department_id)
VALUES ("Engineering Project Manager", 110000, 3);
INSERT INTO roles (title, salary, department_id)
VALUES ("Software Engineer", 120000, 3);
INSERT INTO roles (title, salary, department_id)
VALUES ("Senior Developer", 140000, 3);

INSERT INTO roles (title, salary, department_id)
VALUES ("Human Resource Manager", 90000, 4);
INSERT INTO roles (title, salary, department_id)
VALUES ("Recruiter", 60000, 4);
INSERT INTO roles (title, salary, department_id)
VALUES ("Relations Specialist", 45000, 4);

INSERT INTO roles (title, salary, department_id)
VALUES ("Finance Manager", 120000, 5);
INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 78000, 5);

-- EMPLOYEES --

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rabia", "Buckley", 2, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paulina", "Stafford", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christine", "Thorne", 3, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leonardo", "Darby", 4, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Will", "Ball", 5, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andreea", "Schwartz", 6, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Vince", "Bradford", 7, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gerorgina", "Burks", 8, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Conner", "Shaw", 9, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kay", "McBride", 10, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tyrese", "Archer", 11, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Angie", "Lopez", 12, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Clyde", "Jarvis", 13, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Maxie", "Gus", 14, null);

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;


SELECT department.name AS department, employee.first_name, employee.last_name, employee.id
FROM employee
LEFT JOIN roles ON (roles.id = employee.role_id)
LEFT JOIN department ON (department.id = roles.department_id)
ORDER BY department.name;

SELECT employee.first_name, employee.last_name, roles.title
AS title FROM employee 
JOIN roles ON employee.role_id = roles.id;