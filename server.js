// requirements
const inquirer = require('inquirer')
const mysql = require('mysql')
const cTable = require('console.table')
const db = require( './app/connection' )('employees','mischadab')