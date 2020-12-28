const inquirer = require("inquirer");
const mysql = require("mysql");

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
            "Add Department",
            "Add Employee",
            "Add Roles",
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
                searchAllEmployees()
                break;
            case "Add Department":
                addingDepartment()
                break;
            case "Add Role":

                break;
            case "Add Employee":
                addingEmployee()
                break;
            default:
                connection.end();
                process.exit(0)
                break;
        }
    })
}

const searchByDepartments = () => {
    inquirer.prompt({
        type: "list",
        name: "DepartmentName",
        message: "What department do you want to view?",
        choices: [
            "Sales",
            "Marketing",
            "Engineer",
            "Human Resource",
            "Finance"
        ]
    }).then((res) => {
        console.log(res)
        const department = res.DepartmentName
        if (department === "Sales") {
            
            let query = "SELECT department.name, roles.title, roles.salary, employee.first_name, employee.last_name FROM department "
            query += "LEFT JOIN roles ON roles.department_id = department.id "
            query += "LEFT JOIN employee ON employee.role_id = roles.id "
            query += "WHERE department.name = 'Sales' "
            
            employeeDep = connection.query(query, (err, data) => {
                if (err) throw err;
                console.table(data);
                mainMenu()
            })
        }
        if (department === "Marketing") {
            
            let query = "SELECT department.name, roles.title, roles.salary, employee.first_name, employee.last_name FROM department "
            query += "LEFT JOIN roles ON roles.department_id = department.id "
            query += "LEFT JOIN employee ON employee.role_id = roles.id "
            query += "WHERE department.name = 'Marketing' "
            
            employeeDep = connection.query(query, (err, data) => {
                if (err) throw err;
                console.table(data);
                mainMenu()
            })
        }
        if (department === "Engineer") {
            
            let query = "SELECT department.name, roles.title, roles.salary, employee.first_name, employee.last_name FROM department "
            query += "LEFT JOIN roles ON roles.department_id = department.id "
            query += "LEFT JOIN employee ON employee.role_id = roles.id "
            query += "WHERE department.name = 'Engineer' "
            
            employeeDep = connection.query(query, (err, data) => {
                if (err) throw err;
                console.table(data);
                mainMenu()
            })
        }
        if (department === "Human Resource") {
            
            let query = "SELECT department.name, roles.title, roles.salary, employee.first_name, employee.last_name FROM department "
            query += "LEFT JOIN roles ON roles.department_id = department.id "
            query += "LEFT JOIN employee ON employee.role_id = roles.id "
            query += "WHERE department.name = 'Human Resource' "
            
            employeeDep = connection.query(query, (err, data) => {
                if (err) throw err;
                console.table(data);
                mainMenu()
            })
        }
        if (department === "Finance") {
            
            let query = "SELECT department.name, roles.title, roles.salary, employee.first_name, employee.last_name FROM department "
            query += "LEFT JOIN roles ON roles.department_id = department.id "
            query += "LEFT JOIN employee ON employee.role_id = roles.id "
            query += "WHERE department.name = 'Finance' "
            
            employeeDep = connection.query(query, (err, data) => {
                if (err) throw err;
                console.table(data);
                mainMenu()
            })
        }
    })
}

const searchByRoles = () => {
    let query = "SELECT employee.first_name, employee.last_name, roles.title "
    query += "AS title FROM employee " 
    query += "JOIN roles ON employee.role_id = roles.id"

    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        mainMenu()
    })
}

const searchAllEmployees = () => {
    let query = "SELECT first_name, last_name, title, salary FROM employee LEFT JOIN roles ON employee.role_id = roles.id"
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        mainMenu()
    })
}

const addingDepartment = () => {
    inquirer.prompt([
        {
        type: "input",
        name: "addDepartment",
        message: "What is the name of the Department you'll wish to add?"
        }
    ]).then((res) => {
        console.log(res)
        connection.query(`INSERT INTO department (name) VALUES ('${res.appDepartment}')`, (err, data) => {
            if (err) throw err;
            console.log("Successfully added Department")
            mainMenu()
        })
    })
}


//NOTE: Need to complete this 
const addingEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Enter Employee first name"
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter Employee last name"
        }
    ])
}