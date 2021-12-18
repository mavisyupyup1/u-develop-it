require('dotenv').config()
console.log(process.env)
//import mysql2 package
const mysql=require('mysql2')

//connect to database
const db =mysql.createConnection(
    {
        host:'localhost',
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        database: process.env.DB_NAME
    },
    console.log('Connected to the election database')
)

module.exports =db;