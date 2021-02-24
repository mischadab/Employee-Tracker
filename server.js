// requirements
const inquirer = require('inquirer')
const mysql = require('mysql')
const cTable = require('console.table')
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
            'Update Employee Role',
            'Update Employee Manager',
            'View all Managers',
            'Add Manager',
            'View all Roles',
            'Remove Role',
            'View all Departments',
            'Add Department',
            'Remove Department',
        ]
        }
    ])

    // function to prompt user and to run assigned functions using switch case
    switch (answer) {
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
        case 'Update Employee Role':
            updateRole();
            break;
        case 'Update Employee Manager':
            updateManager();
            break;
        case 'View all Managers':
            viewManagers();
            break;
        case 'Add Manager':
            addManager();
            break;
        case 'Remove Manager':
            removeManager();
            break;
        case 'View all Roles':
            viewRoles();
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
    const d = await db.query(``)
    if (d.length == 0) {
        startPrompt()
    } else {
        console.table(d)
        startPrompt()
    }
}

// view depts prompt, grab from db
async function viewByDept(){
    const deptArr = []
    const data = await db.query(``)
    data.map(({department, id}) => {
        deptArr.push({name: department, value: id})
    })
    if ( arr.length == 0 ) {
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
        const d = await db.query(``)
        if (d.length == 0){
            console.log(`No employees in this department`)
            startPrompt()
        } else {
            console.table(d)
            startPrompt()
        }
    }
}

// view employees by manager, grab from db
async function viewByManager(){
    const managerArr = []
    const data = await db.query(``)
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
        const d = await db.query(``)
        if (d.length == 0) {
            console.log( `No employees assigned to this manager`)
            startPrompt()
        } else {
            console.table(d)
            startPrompt()
        }
    }
}

// add employee function 
async function addEmployee() {
    let employeeArr = []
    let managerArr = []
    const data = await db.query(``)
    data.map(({title,id}) => {
        employeeArr.push({name:title, value:id})
    })
    const d = await db.query(``)
    d.map(({manager,id}) => {
        managerArr.push({name:manager, value:id})
    })
    if ( employeeArr.length == 0 ) {
        console.log(`Error, list of roles required`)
        startPrompt()
    } else if (managerArr.length == 0) {
        console.log(`Error list of managers required`)
        startPrompt()
    } else {
        const questions = await inquirer.prompt([
            {
                message: "What is the Employee's first name?",
                type: 'input',
                name: 'firstName'
            },
            {
                message: "What is the Employee's last name?",
                type: 'input',
                name: 'lastName'
            },
            {
                message: "What is the Employee's role?",
                type: 'list',
                name: 'role',
                choices: employeeArr
            },
            {
                message: "Who is the Employee's Manager?",
                type: 'list',
                name: 'manager',
                choices: managerArr
            }
        ])
        await db.query(``)
        viewEmployees()
    }
}

// remove employee function
async function removeEmployee(){
    const employeeArr []
    const EmployeeData = await db.query(``)
        employeeData.map(({first_name,last_name,id}) => {
        employeeArr.push({name:`${first_name} ${last_name}`, value:id})
    })
    if(employeeArr.length == 0){
        console.log(`Error, list of employees required!`)
        startPrompt()
    } else {
        const answer = await inquirer.prompt([
            {
                message: 'Choose an Employee to remove',
                type: 'list',
                name: 'id',
                choices: employeeArr
            }
        ])
        await db.query(``)
        viewEmployees()
    }
}

// update employee role function
async function updateRole() {
    const employeeArr = []
    const employeeData = await db.query(``)
        employeeData.map(({first_name,last_name,id}) =>
        employeeArr.push({name:`${first_name} ${last_name}`}))
    const roleArr = []
    const roleData = await db.query(``)
    roleData.map(({title, id}) => {
        roleArr.push({name:title,value:id})
    })
    if ( employeeArr.length == 0 ) {
        console.log(`Error, list of employees is required`)
        startPrompt()
    } else {
        const answer = await inquirer.prompt([
            {
                message: 'Choose an Employee to update',
                type: 'list',
                name: 'employee',
                choices: employeeArr
            },
            {
                message: 'Choose a role to assign',
                type: 'list',
                name: 'updatedRole',
                choices: roleArr
            }
        ])
        await db.query(``)
        viewEmployees()
    }
}

async function updateManager() {
    const employeeArr = []
    const employeeData = await db.query(``)
        employeeData.map(({first_name, last_name, id}) =>
            employeeArr.push({name: `${first_name} ${last_name}`, value:id}))
    const managerArr = []
    const managerData = await db.query(``)
        managerData.map(({manager, id}) => {
            managerArr.push({name:manager, value:id})
        })
    if ( employeeArr.length == 0 ) {
        console.log(`Error, list of employees is required!`)
        startPrompt()
    } else if ( managerArr.length == 0 ) {
        console.log(`Error, list of managers is required!`)
        startPrompt()
    } else {
        const answer = await inquirer.prompt([
            {
                message: 'Choose the employee you want to update',
                type: 'list',
                name: 'employee',
                choices: 'employeeArr'
            },
            {
                message: 'Choose a Manager to assign this Employee to',
                type: 'list',
                name: 'newManager',
                choices: managerArr
            }
        ])
        await db.query(``)
        viewEmployees()
    }
}