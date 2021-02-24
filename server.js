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