const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
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
            "Update Role/Salary",
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
                updateEmployee()
                break;
            case "Update Role/Salary":
                updateRole()
                break;
            default:
                connection.end();
                process.exit(0)
                break;
        }
    })
}

//View Employees by Department
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

//View Employees by Roles
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

//View All Employees
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

//Adding Departments
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

//Adding Employees
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

//Adding Roles
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


function updateEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'empFirstName',
            message: 'What is the employee you would like to updates first name?',
        },
        {
            type: 'input',
            name: 'empLastName',
            message: 'What is the employee you would like to updates first last?',
        },
        {
            type: 'input',
            name: 'newRole',
            message: 'What Role would you like them to have? (ID)',
        }
    ])
    .then((answer) => {
        connection.query(
            'UPDATE employee SET ? WHERE ?',
            [
                {
                    first_name: answer.empFirstName
                },
                {
                    last_name: answer.empLastName
                },
                {
                    role_id: answer.newRole,
                },
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`${answer.empFirstName} ${answer.empLastName}'s role updated \n`)
                mainMenu()
            }
        )
    })
};

const updateRole = () => {
    connection.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        inquirer.prompt([
            {
            type: "list",
            name: "updateRole",
            message: "Which would Role would you like to update?",
            choices: function () {
                    let roleEle = [];
                    for (let i = 0; i < data.length; i++){
                        roleEle.push(data[i].title)
                    }
                    return roleEle
                }
            },
            {
                type: "input",
                name: "updateSalary",
                message: "What is the salary of this new role thats being updated?",
            },
        ]).then((answer) => {
            connection.query("UPDATE roles SET ? WHERE ?", [
                {title: answer.updateRole},
                {salary: answer.updateSalary}
            ],(err, data) => {
                if (err) throw err;
                console.log(`${answer.updateRole}'s salary has been updated to $${answer.updateSalary}`)
                mainMenu()
            })
        })
    })
}

