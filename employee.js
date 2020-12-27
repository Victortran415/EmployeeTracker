const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Password",
    database: "employeeDB",
});

