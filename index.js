// Requiring node modules
const inquirer = require('inquirer');
const mysql = require('mysql');
require('console.table');
require('console.table');
require('dotenv').config();

// Set an array of options for the initial prompt of choices
const choiceOptions = ["View All Employees","View All Employees By Manager","View All Departments","View All Roles","Add Employee","Remove Employee","Update Employee Role","Update Employee Manager","Add Department","Add Role","Remove Department","Remove Role","Exit"];

// Initialize mySql connection - DB_user and DB_pass are accessed from .env
const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT || 3306,
    user: process.env.DB_user,
    password: process.env.DB_pass,
    database: 'employee_db',
});

// Initial function
function init() {
    inquirer
    .prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: choiceOptions
    }])
    .then(function(data) {
        switch(data.action) {
            case 'View All Employees':
                runQuery(`SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id ORDER BY employee.id;`);
                break;
            case 'View All Employees By Manager':
                runManagerQuest();
                break;
            case 'View All Departments':
                runQuery(`SELECT name AS Department FROM employee_db.department;`);
                break;
            case 'View All Roles':
                runQuery(`SELECT title as Title FROM employee_db.role;`);
                break;
            case 'Add Employee':
                addEmp();
                break;
            case 'Remove Employee':
                removeEmp();
                break;
            case 'Update Employee Role':
                updateEmp('Role');
                break;
            case 'Update Employee Manager':
                updateEmp('Manager');
                break;
            case 'Add Department':
                addDept();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Remove Department':
                removeDept();
                break;
            case 'Remove Role':
                removeRole();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                connection.end();
                break;
        }
    })
    .catch((err) => console.error(err))
}

// Basic function to run a simple query and console.table the results
const runQuery = (query) => {
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

// Get the manager names, show them as options, and send a query through runQuery with the specific manager's ID
const runManagerQuest = () => {
    connection.query(`SELECT CONCAT(first_name,' ',last_name) AS name, employee.id FROM employee_db.employee WHERE manager_id IS NULL`, (err, res) => {
        if (err) throw err;
        let manOptions = [];
        res.forEach((res) => {manOptions.push(res.name)});

        inquirer
        .prompt({
            type: 'list',
            message: 'Which manager would you like to view by?',
            name: 'manager',
            choices: manOptions
        })
        .then((ans) => {
            // Get ID of manager chosen
            connection.query(`SELECT id FROM employee WHERE CONCAT(first_name,' ',last_name) = "${ans.manager}"`, (err, res) => {
                if (err) throw err;
                runQuery(`SELECT first_name, last_name, title, salary, name as department FROM employee_db.employee AS emp INNER JOIN employee_db.role AS rol ON emp.role_id = rol.id INNER JOIN employee_db.department AS dept ON department_id = dept.id WHERE manager_id = "${res[0].id}" ORDER BY emp.id;`)
            });
        })
    });
    
};

// Add an employee using INSERT
// Runs query then shows the table with all employees to show it was created
const addEmp = () => {
    connection.query(`SELECT title FROM employee_db.role;`, (err, res) => {
        if (err) throw err;

        // Put all role options in an array to choose from
        let roleOptions = [];
        res.forEach((res) => {roleOptions.push(res.title)});

        inquirer
        .prompt([
            {
                type: 'input',
                message: `What is the employee's first name?`,
                name: 'first_name'
            },
            {
                type: 'input',
                message: `What is the employee's last name?`,
                name: 'last_name'
            },
            {
                type: 'list',
                message: `What is the employee's role?`,
                name: 'role_id',
                choices: roleOptions
            },
            {
                type: 'input',
                message: `What is the manager's employee ID?`,
                name: 'manager_id'
            }
        ])
        .then((ans) => {
            // Get ID of role chosen
            connection.query(`SELECT id FROM employee_db.role WHERE title = "${ans.role_id}"`, (err, res) => {
                if (err) throw err;
                ans.role_id = res[0].id;
                connection.query(`INSERT INTO employee SET ?`,ans, (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee inserted!\n`)
                    runQuery(`SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id ORDER BY employee.id;`);
                });
            });
            
        })
    })
};

// Remove an employee using DELETE
// Did not use runQuery, did not want to console.table the response
const removeEmp = () => {
    connection.query(`SELECT * FROM employee_db.employee;`, (err, res) => {
        if (err) throw err;
        console.table(res);

        inquirer
        .prompt({
            type: 'input',
            message: 'Which employee needs to be removed? Please enter the id.',
            name: 'empId'
        })
        .then((ans) => {
            connection.query(`DELETE FROM employee_db.employee WHERE id = ${ans.empId};`,(err, res) => {
                if (err) throw err;
                console.log("Employee ID " + ans.empId + " has been deleted.");
                init();
            });
        })
    })
    
};

// Update employee using UPDATE SET
// Did not use runQuery, did not want to console.table the response
const updateEmp = (edit) => {
    connection.query(`SELECT * FROM employee_db.employee;`, (err, res) => {
        if (err) throw err;
        console.table(res);

        // If the user wants to edit a Role
        if (edit === 'Role') {
            inquirer
            .prompt([
                {
                    type: 'input',
                    message: `What is the employee's ID?`,
                    name: 'id'
                },
                {
                    type: 'input',
                    message: `What is the employee's new role ID?`,
                    name: 'role_id'
                }])
                .then((ans) => {
                    // Set role_id where employee's id equals the user's input
                    connection.query(`UPDATE employee SET ? WHERE ?`,
                    [
                        {
                            role_id: ans.role_id,
                        },
                        {
                            id: ans.id
                        }
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Employee ID ${ans.id} has been updated.`)
                        init();
                    });
                }
            )
        }
        // If the user wants to edit the Manager
        else if (edit === 'Manager') {
            inquirer
            .prompt([
                {
                    type: 'input',
                    message: `What is the employee's ID?`,
                    name: 'id'
                },
                {
                    type: 'input',
                    message: `What is the employee's new manager ID?`,
                    name: 'manager_id'
                }])
                .then((ans) => {
                    // Supposed to update the manager_id to NULL if the value of manager_id is empty
                    // This throws an error, but still updates
                    if (!ans.manager_id) {
                        connection.query(`UPDATE employee SET manager_id = NULL WHERE ?`,
                        [
                            {
                                id: ans.id
                            }
                        ],
                        (err, res) => {
                            if (err) throw err;
                            console.log(`Employee ID ${ans.id} has been updated.`)
                            init();
                        })
                    }

                    // Set manager_id where employee's id equals the user's input
                    connection.query(`UPDATE employee SET ? WHERE ?`,
                    [
                        {
                            manager_id: ans.manager_id,
                        },
                        {
                            id: ans.id
                        }
                    ],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Employee ID ${ans.id} has been updated.`)
                        init();
                    })
                        
                }
            )
        }
    })
};

// Add a department using INSERT
const addDept = () => {
    inquirer
    .prompt({
        type: 'input',
        message: 'What is the name of the department?',
        name: 'name'
    })
    .then((ans) => {
        connection.query(`INSERT INTO department SET name = "${ans.name}"`, (err, res) => {
            if (err) throw err;
            console.log(`${ans.name} department has been created!`)
            init();
        });
    })
};

// Delete a department using DELETE
const removeDept = () => {
    connection.query(`SELECT * FROM employee_db.department;`, (err, res) => {
        if (err) throw err;
        // Shows all current departments and their ID's
        console.table(res);

        inquirer
        .prompt({
            type: 'input',
            message: 'Which department needs to be removed? Please enter the id.',
            name: 'deptId'
        })
        .then((ans) => {
            connection.query(`DELETE FROM employee_db.department WHERE id = ${ans.deptId};`, (err, res) => {
                if (err) throw err;
                console.log("Department ID " + ans.deptId + " has been deleted.");
                init();
            });
        })
    })
    
};

// Add a role using INSERT
const addRole = () => {
    connection.query(`SELECT name FROM employee_db.department`, (err, res) => {
        if (err) throw err;

        // Put all department options in an array to choose from
        let deptOptions = [];
        res.forEach((res) => {deptOptions.push(res.name)});
        inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the title of the role?',
                name: 'title'
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'What department is the role in?',
                name: 'department',
                choices: deptOptions
            }
        ])
        .then((ans) => {
            // Get id of department chosen
            connection.query(`SELECT id FROM department WHERE name = "${ans.department}"`, (err, res) => {
                if (err) throw (err);
                connection.query(`INSERT INTO role SET ?`,
                {
                    title: ans.title,
                    salary: ans.salary,
                    department_id: res[0].id
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`Role ${ans.title} created!`);
                    init();
                });
            })
            
        })
    })
};

// Delete a role using DELETE
const removeRole = () => {
    connection.query(`SELECT * FROM employee_db.role;`, (err, res) => {
        if (err) throw err;
        // Show all available roles
        console.table(res);

        inquirer
        .prompt({
            type: 'input',
            message: 'Which role needs to be removed? Please enter the id.',
            name: 'roleId'
        })
        .then((ans) => {
            connection.query(`DELETE FROM employee_db.role WHERE id = ${ans.roleId};`, (err, res) => {
                if (err) throw err;
                console.log("Role ID " + ans.roleId + " has been deleted.");
                init();
            });
        })
    })
}

// Connect to server and start initial function
connection.connect((err) => {
    if (err) throw err;
    init();
});