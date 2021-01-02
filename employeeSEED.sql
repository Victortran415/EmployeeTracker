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
VALUES ("Marketing Specialist", 80000, 2);
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
VALUES ("Rabia", "Buckley", 1, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leonardo", "Darby", 4, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Vince", "Bradford", 7, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kay", "McBride", 10, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Clyde", "Jarvis", 13, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andreea", "Schwartz", 6, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gerorgina", "Burks", 8, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paulina", "Stafford", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Will", "Ball", 5, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christine", "Thorne", 3, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Conner", "Shaw", 9, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Angie", "Lopez", 12, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tyrese", "Archer", 11, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Maxie", "Gus", 14, 5);


SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;

-- search by department --
SELECT department.name, roles.title, roles.salary, employee.first_name, employee.last_name 
from department 
LEFT JOIN roles ON roles.department_id = department.id 
LEFT JOIN employee ON employee.role_id = roles.id 
WHERE department.name = 'Sales';

-- search by roles --
SELECT employee.first_name, employee.last_name, roles.title
AS title FROM employee 
JOIN roles ON employee.role_id = roles.id;

--search all employees --
SELECT employee.first_name, employee.last_name, roles.title, department.name AS department_name, CONCAT('$', roles.salary), CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN employee manager on manager.id = employee.manager_id
INNER JOIN roles ON (roles.id = employee.role_id)
INNER JOIN department ON (department.id = roles.department_id)
ORDER BY employee.id;