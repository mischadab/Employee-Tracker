// requirements
const inquirer = require('inquirer')
const mysql = require('mysql')
const consoleTable = require('console.table')
const { title } = require('process')
const db = require( './app/connection' )('employees','mischadab')


// function for question prompt
async function startPrompt(){
    const answer = await inquirer.prompt([
        { type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: [ 
            'View all Employees', 
            'View all Employees by Department',
            'View all Employees by Manager',
            'Add Employee',
            'Remove Employee',
            'Edit Employee Role',
            'Edit Employee Manager',
            'Remove Manager',
            'View all Roles',
            'Add Role',
            'Remove Role',
            'View all Departments',
            'Add Department',
            'Remove Department',
        ],
        }
    ])

    // function to prompt user and to run assigned functions using switch case
    switch (answer.action) {
        case 'View all Employees':
            viewEmployees();
            break;
        case 'View all Employees by Department':
            viewByDept();
            break;
        case 'View all Employees by Manager':
            viewByManager();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Remove Employee':
            removeEmployee();
            break;
        case 'Edit Employee Role':
            editRole();
            break;
        case 'Edit Employee Manager':
            editEmpManager();
            break;
        case 'Remove Manager':
            removeManager();
            break;
        case 'View all Roles':
            viewRoles();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Remove Role':
            removeRole();
            break;
        case 'View all Departments':
            viewDepts();
            break;
        case 'Add Department':
            addDept();
            break;
        case 'Remove Department':
            removeDept();
            break;
        default:
            console.log('Error')
        
    }
}

// view employees prompt, join databases
async function viewEmployees(){
    const employeeData = await db.query(`SELECT e.id, e.first_name, e.last_name, r.title,d.department, r.salary, m.manager FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id LEFT JOIN manager AS m ON e.manager_id = m.id`)
    if (employeeData.length == 0) {
        startPrompt()
    } else {
        console.table(employeeData)
        startPrompt()
    }
}

// view depts prompt, grab from db
async function viewByDept(){
    const deptArr = []
    const data = await db.query('SELECT * FROM department')
    data.map(({department, id}) => {
        deptArr.push({name: department, value: id})
    })
    if ( deptArr.length == 0 ) {
        console.log(`Error, no department found`)
        startPrompt()
    } else {
        const answer = await inquirer.prompt([
            {
                message: 'Choose a department to view',
                type: 'list',
                choices: deptArr,
                name: 'department'
            }
        ])
        const deptData = await db.query(`SELECT e.first_name, e.last_name FROM employee AS e LEFT JOIN role AS r ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id WHERE d.id = ${answer.department}`)
        if (deptData.length == 0){
            console.log(`No employees in this department`)
            startPrompt()
        } else {
            console.table(deptData)
            startPrompt()
        }
    }
}

// view employees by manager, grab from db
async function viewByManager(){
    const managerArr = []
    const data = await db.query(`SELECT * FROM manager`)
    data.map(({manager, id}) => {
        managerArr.push({name: manager, value: id})
    })
    if (managerArr.length == 0){
        console.log(`No managers found`)
        startPrompt()
    } else {
        const answer = await inquirer.prompt([
            {
            message: 'Select a manager list to view',
            type: 'list',
            choices: managerArr,
            name: 'manager'
            }
        ])
        const managerData = await db.query(`SELECT e.first_name,e.last_name FROM employee AS e WHERE e.manager_id = ${answer.manager}`)
        if (managerData.length == 0) {
            console.log( `No employees assigned to this manager`)
            startPrompt()
        } else {
            console.table(managerData)
            startPrompt()
        }
    }
}

// add employee function 
async function addEmployee() {
    // let employeeArr = []
    // let managerArr = []
    const roleArr = await db.query(`SELECT * FROM role`)
   
   const roles= roleArr.map(({title,id}) => 
        ({name:title, value:id})
    )
    const managerArr = await db.query(`Select * FROM employee`)
    
    const managers=managerArr.map(({first_name,id}) => 
        ({name:first_name, value:id})
    )
    // if ( employeeArr.length == 0 ) {
    //     console.log(`Error, list of roles required`)
    //     startPrompt()
    // } else if (managerArr.length == 0) {
    //     console.log(`Error list of managers required`)
    //     startPrompt()
    // } else {
        const questions = await inquirer.prompt([
            {
                message: "What is the Employee's first name?",
                type: 'input',
                name: 'first_name'
            },
            {
                message: "What is the Employee's last name?",
                type: 'input',
                name: 'last_name'
            },
            {
                message: "What is the Employee's role?",
                type: 'list',
                name: 'role_id',
                choices: roles
            },
            {
                message: "Who is the Employee's Manager?",
                type: 'list',
                name: 'manager_id',
                choices: managers
            }
        ])
        console.log(questions)
        await db.query('INSERT INTO employee SET ?', [questions])
        viewEmployees()
    }
// }

// remove employee function
async function removeEmployee(){
    // const employeeArr = []
    const employeeData = await db.query('SELECT * FROM employee')
     const employees =  employeeData.map(({first_name,last_name,id}) => 
        ({name:first_name, last_name, value:id})
    )
    
    console.log(employeeData)
    // if(employeeArr.length == 0){
    //     console.log(`Error, list of employees required!`)
    //     startPrompt()
    // } else {
        const answer = await inquirer.prompt([
            {
                message: 'Choose an Employee to remove',
                type: 'list',
                name: 'id',
                choices: employees
            }
        ])
        await db.query(`DELETE FROM employee WHERE id = ${answer.id}`)
        viewEmployees()
    }
// }

// update employee role function
async function editRole() {
    // const employeeArr = []
    const employeeData = await db.query('SELECT * FROM employee')
        const employees = employeeData.map(({first_name,last_name,id}) =>
        ({name:`${first_name} ${last_name}`,value:id})
        )
    // const roleArr = []
    const roleData = await db.query('SELECT * FROM role')
    const roles = roleData.map(({title, id}) => 
     ({name:title,value:id})
    )
    // if ( employeeArr.length == 0 ) {
    //     console.log(`Error, list of employees is required`)
    //     startPrompt()
    // } else {
        const answer = await inquirer.prompt([
            {
                message: 'Choose an Employee to update',
                type: 'list',
                name: 'employee',
                choices: employees
            },
            {
                message: 'Choose a role to assign',
                type: 'list',
                name: 'updatedRole',
                choices: roles
            }
        ])
        await db.query(`UPDATE employee SET role_id = ${answer.updatedRole} WHERE id = ${answer.employee}`)
        viewEmployees()
    }
// }

// function to update manager of employee
async function editEmpManager() {
    // const employeeArr = []
    const employeeData = await db.query('SELECT * FROM employee')
        const employees = employeeData.map(({first_name, last_name, id}) =>
            ({name: `${first_name} ${last_name}`, value:id})
            )
    // const managerArr = []
    const managerData = await db.query('SELECT * FROM manager')
        const managers = managerData.map(({manager, id}) => 
           ({name:manager, value:id})
        )
    // if ( employeeArr.length == 0 ) {
    //     console.log(`Error, list of employees is required!`)
    //     startPrompt()
    // } else if ( managerArr.length == 0 ) {
    //     console.log(`Error, list of managers is required!`)
    //     startPrompt()
    // } else {
        const answer = await inquirer.prompt([
            {
                message: 'Choose the employee you want to update',
                type: 'list',
                name: 'employee',
                choices: employees
            },
            {
                message: 'Choose a Manager to assign this Employee to',
                type: 'list',
                name: 'newManager',
                choices: managers
            }
        ])
        await db.query(`UPDATE employee SET manager_id = ${answer.newManager} WHERE id = ${answer.employee}`)
        viewEmployees()
    }
// }

async function removeManager() {
    const managerData = await db.query('SELECT * FROM manager')
        const managers = managerData.map( ({manager, id}) =>
        ({name: manager, value: id})
        )
    const answer = await inquirer.prompt([
        {
            message: 'Choose a Manager to remove',
            type: 'list',
            name: 'id',
            choices: managers
        }
    ])
    await db.query(`DELETE FROM manager WHERE id = ${answer.id}`)
    startPrompt();
}


// function to view roles of employees
async function viewRoles() {
    const roleData = await db.query('SELECT * FROM role')
    if ( roleData.length == 0 ) {
        console.log( `Error: The list of roles is empty`)
        startPrompt()
    } else {
        console.table(roleData)
        startPrompt()
    }
}

// function to add a role
async function addRole() {
    // const deptArr = []
    const deptData = await db.query('SELECT * FROM department')
    console.log(deptData)
        const departments = deptData.map(({department, id}) => 
      ({name:department, value:id})
      )
    // if (deptArr.length == 0) {
    //     console.log( `Error: list of departments is required` )
    //     startPrompt()
    // } else {
        const answer = await inquirer.prompt([
            {
                message: 'What role do you wish to add?',
                type: 'input',
                name: 'title'
            },
            {
                message: 'Please input the salary for this role',
                type: 'input',
                name: 'salary'
            },
            {
                message: 'Choose a Department to assign this role to',
                type: 'list',
                name: 'department_id',
                choices: departments
            }
        ])
        await db.query('INSERT INTO role SET ?', [answer])
        viewEmployees()
    }
// }

// function to remove a role
async function removeRole() {
    // const roleArr = []
    const roleData = await db.query('SELECT * FROM role')
    const roles = roleData.map(({title, id}) => 
     ({name: title, value:id})
    )
    // if ( roleArr.length == 0 ) {
    //     console.log(`Error, list of roles is required`)
    //     startPrompt()
    // } else {
        const answer = await inquirer.prompt([
            {
                message: 'Choose a role to remove',
                type: 'list',
                name: 'id',
                choices: roles
            }
        ])
        await db.query(`DELETE FROM role WHERE id = '${answer.id}'`)
        viewEmployees()
    }
// }

// function to view all departments
async function viewDepts() {
    const deptData = await db.query(`SELECT * FROM department`)
    if (deptData.length == 0) {
        console.log(`Error, the list of departments is empty`)
        startPrompt()
    } else {
        console.table(deptData)
        startPrompt()
    }
}

// function to add department
async function addDept() {
    const answer = await inquirer.prompt([
        {
            message: 'Enter the name of the Department',
            type: 'input',
            name: 'department'
        }
    ])
    await db.query('INSERT INTO department SET ?', [answer] )
    startPrompt()
}

// function to remove department
async function removeDept() {
    // const deptArr = []
    const deptData = await db.query(`SELECT * FROM department`)
        const departments = deptData.map(({department, id}) => 
            ({name:department, value:id})
        )
    // if (deptArr.length == 0) {
    //     console.log(`Error: List of Departments is required!`)
    //     startPrompt()
    // } else {
        const answer = await inquirer.prompt([
            {
                message: 'Select a department to remove',
                type: 'list',
                name: 'id',
                choices: departments
            }
        ])
        await db.query(`DELETE FROM department WHERE id = '${answer.id}'`)
        await db.query(`DELETE FROM role WHERE department_id = '${answer.id}'`)
        viewEmployees();
    }
// }

startPrompt();