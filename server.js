//import express
const express = require ('express');
const inputCheck= require('./utils/inputCheck')
require('dotenv').config()
console.log(process.env)
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
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        database: process.env.DB_NAME
    },
    console.log('Connected to the election database')
)
//querying database to test the connection
app.get('/api/candidates',(req,res)=>{
    const sql=`SELECT * FROM candidates`;
    db.query(sql, (err,rows)=>{
        if(err){
            res.status(500).json({error:err.message});
            return;
        }
        res.json({
            message:'success',
            data:rows
        });
    });
});
//get a single candidate
app.get('/api/candidate/:id',(req,res)=>{
    const sql = `SELECT * FROM candidates WHERE id =?`;
    const params = [req.params.id];
    db.query(sql,params,(err,row)=>{
        if(err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message:'success',
            data:row
        })
        console.log(row)
    })

})
// Delete a candidate 
app.delete('/api/candidate/:id',(req,res)=>{
    const sql =`DELETE FROM candidates WHERE id = ?`;
    const params =[req.params.id];
    db.query(sql,params,(err,result)=>{
        if(err){
            res.statusMessage(400).json({error:res.message});
        }else if(!result.affectedRows){
            res.json({
                message:'Candidate not found'
            });
        } else {
            res.json({
                message:'deleted',
                changes:result.affectedRows,
                id:req.params.id
            });
        }
    });
});




 
//Create a candidate
app.post('/api/candidate',({body},res)=>{
    const errors = inputCheck(body,'first_name','last_name','industry_connected');
    if(errors){
        res.status(400).json({error:errors});
        return;
    }
    const sql =`INSERT INTO candidates(first_name,last_name, industry_connected) VALUE (?,?,?)`;
    const params = [body.first_name,body.last_name,body.industry_connected];
    db.query(sql,params,(err,result)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        }
        res.json({
            message:'success',
            data:body
        })
    })
})

//default response for any other request(Not Found)
app.use((req,res)=>{
    res.status(404).end();
})
//start express.js server on port 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})