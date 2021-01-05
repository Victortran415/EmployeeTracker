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
            "Update Employee Role",
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
            case "Add Employee":
                addingEmployee()
                break;
            case "Add Roles":
                addingRole()
                break;
            case "Update Employee Role":
                updateEmployeeRole()
                break;
            default:
                connection.end();
                process.exit(0)
                break;
        }
    })
}

const searchByDepartments = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        inquirer.prompt({
            type: "list",
            name: "searchDept",
            message: "What department would you like to view?",
            choices: function() {
                let searchByDept = []
                for (let i = 0; i < data.length; i++) {
                    searchByDept.push(data[i].name) 
                }
                return searchByDept
            }
        }).then((answer) => {
            console.log(answer.searchDept)
            let query = "SELECT department.name, roles.title, CONCAT('$', roles.salary) AS salary, employee.first_name, employee.last_name FROM department "
            query += "LEFT JOIN roles ON roles.department_id = department.id "
            query += "LEFT JOIN employee ON employee.role_id = roles.id "
            query += "WHERE ?"

            connection.query(query, {name: answer.searchDept}, (err, data) => {
                if (err) throw err;
                console.table(data);
                mainMenu()
            })
        })
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
    let query = "SELECT employee.first_name, employee.last_name, department.name AS department_name, "
    query += "roles.title, CONCAT('$', roles.salary) AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee "
    query += "LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN roles ON (roles.id = employee.role_id) "
    query += "INNER JOIN department ON (department.id = roles.department_id) ORDER BY employee.id"
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        mainMenu()
    })
}

const addingDepartment = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "input",
                name: "addDepartment",
                message: "What is the name of the Department you'll wish to add?"
            }
        ]).then((res) => {
            console.log(res)
            connection.query("INSERT INTO department SET ?", {
                name: res.addDepartment,
            }, (err, data) => {
                if (err) throw err;
                console.table(data)
                console.log("Successfully added Department")
                mainMenu()
            })
        })
    })
}


const addingEmployee = () => {
    connection.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;

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
            },
            {
                type: "list",
                name: "whatRole",
                message: "What is the role of the employee?",
                choices: function() {
                    let roleArray = []
                    for (let i = 0; i < data.length; i++) {
                        roleArray.push(data[i].title)
                    }
                    return roleArray;
                }
            },
        ]).then((res) => {
            for (let i = 0; i < data.length; i ++) {
                if (data[i].title === res.whatRole) {
                    res.role_id = data[i].id;
                }
            }
            connection.query("INSERT INTO employee SET ?", {
                first_name: res.firstName,
                last_name: res.lastName,
                role_id: res.role_id
            }, (err, data) => {
                if (err) throw err;
                console.table(data)
                mainMenu()
            })
        })
    })
}

const addingRole = () => {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "input",
                name: "addRole",
                message: "What role would you wish to add?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of this role?",
            },
            {
                type: "list",
                name: "whatDept",
                message: "Which department will this role be added to?",
                choices: function() {
                    let departmentArr = [];
                    for (let i = 0; i < res.length; i++) {
                        departmentArr.push(res[i].name)
                    }
                    return departmentArr
                }
            },
        ]).then((answer) => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].name === answer.whatDept) {
                    answer.department_id = res[i].id;
                }
            }
            connection.query("INSERT INTO roles SET ?", {
                title: answer.addRole,
                salary: answer.salary,
                department_id: answer.department_id
            }, (err, data) => {
                if (err) throw err;
                console.table(data)
                mainMenu()
            })
        })
    })
}


//FIXME: THIS NEEDS WORK
const updateEmployeeRole = () => {
    connection.query("SELECT * FROM roles", (err, data) => {
        connection.query("SELECT * FROM department", (err, res) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "list",
                    name: "updateRole",
                    message: "What would Role would you like to update?",
                    choices: function() {
                        let roleEle = [];
                        for (let i = 0; i < data.length; i++) {
                            roleEle.push(data[i].title)
                        }
                        return roleEle;
                    },
                },
                {
                    type: "input",
                    name: "updateSalary",
                    message: "What is the salary of this new role thats being updated?",
                },
                {
                    type: "list",
                    name: "dept",
                    message: "What department does this role fall into?",
                    choices: function() {
                        let deptEle = [];
                        for (let i = 0; i < res.length; i++) {
                            deptEle.push(res[i].name)
                        }
                        return deptEle
                    },
                },
            ]).then((answer) => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].name === answer.dept) {
                        answer.department_id = res[i].id
                    }
                }
                
            })
        })
    })
}
