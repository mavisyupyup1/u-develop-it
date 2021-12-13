//import express
const express = require ('express');
//import mysql2 package
const mysql=require('mysql2')
// add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();
//express middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
//connect to database
const db =mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'Ox58807246',
        database:'election'
    },
    console.log('Connected to the election database')
)
//querying database to test the connection
db.query(`SELECT * FROM candidates`, (err,rows)=>{
    console.log(rows)
})
//default response for any other request(Not Found)
app.use((req,res)=>{
    res.status(404).end();
})
//start express.js server on port 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})