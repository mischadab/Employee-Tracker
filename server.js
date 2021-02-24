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
}
