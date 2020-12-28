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

connection.connect((err) => {
    if (err) throw err;
    mainMenu()
    //TODO: create inquirer prompt function below then add here
})

const mainMenu = () => {
    inquirer.prompt({
        type: "list",
        name: "viewQuestions",
        message: "What would you like to view?",
        choices: [
            "View Employees by Departments",
            "View Employees by Roles",
            "View All Employees",
            "Exit"
        ]
    }).then((response) => {
        console.log(response.viewQuestions)

        switch (response.viewQuestions) {
            case "View Employees by Departments":
                searchByDepartments()
                break;
            case "View Employees by Roles":
                searchByRoles()
                break;
            case "View All Employees":
                
                break;
            default:
                connection.end();
                process.exit(0)
                break;
        }
    })
}

const searchByDepartments = () => {
    
    let query = "SELECT department.name AS department, employee.first_name, employee.last_name, employee.id FROM employee "
    query += "LEFT JOIN roles ON (roles.id = employee.role_id) "
    query += "LEFT JOIN department ON (department.id = roles.department_id) ORDER BY department.name"
    
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.log(data);
        mainMenu()
    })

    
}


const searchByRoles = () => {
    let query = "SELECT employee.first_name, employee.last_name, roles.title "
    query += "AS title FROM employee " 
    query += "JOIN roles ON employee.role_id = roles.id"

    connection.query(query, (err, data) => {
        if (err) throw err;
        console.log(data);
        mainMenu()
    })
}