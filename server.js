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
//get a single candidate
db.query(`SELECT * FROM candidates WHERE id =1`,(err,row)=>{
    if(err){
        console.log(err);
    }
    console.log(row)
})

// Delete a candidate -- commented out
// db.query(`DELETE FROM candidates WHERE id=?`,1,(err,result)=>{
//     if(err){
//         console.log(err)
//     }
//     console.log(result)
// })

//Create a candidate
const sql = `INSERT INTO candidates(id, first_name, last_name,industry_connected) VALUE (?,?,?,?)`
const params =[1,'Ronald','Firbank',1]
db.query(sql,params,(err,result)=>{
    if(err){
        console.log(err)
    }
    console.log(result)
})

//default response for any other request(Not Found)
app.use((req,res)=>{
    res.status(404).end();
})
//start express.js server on port 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})