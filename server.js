//import express
const express = require ('express');
const inputCheck= require('./utils/inputCheck')
// add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();
//requiring the new connection.js db module export by declaring new const
const db = require('./db/connection')
//express middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//querying database to test the connection
app.get('/api/candidates',(req,res)=>{
    const sql=`SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id`;
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
    const sql = `SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id WHERE candidates.id =?`;
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

//create routes to display all parties 
app.get('/api/parties',(req,res)=>{
    const sql = `SELECT * FROM parties`;
    db.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error:err.message});
            return;
        }
        res.json({
            message:'success',
            data:rows
        })
    })
})
// create routes that includes id parameter for a single party
app.get('/api/party/:id',(req,res)=>{
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params =[req.params.id];
    db.query(sql,params,(err,row)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        }
        res.json({
            message:'success',
            data:row
        })
    })
})

//build a delete route
app.delete('/api/party/:id',(req,res)=>{
    const sql =`DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql,params,(err,result)=>{
        if(err){
            res.status(400).json({error:res.message});
            //check if anything was deleted
        } else if(!result.affectedRows){
            res.json({
                message:'Party not found'
            })
        } else {
            res.json({
                message:'delete',
                changes:result.affectedRows,
                id:req.params.id
            })
        }
    })
})

// create route to handle updates
app.put('/api/candidate/:id',(req,res)=>{
    const errors = inputCheck(req.body,'party_id')
    if(errors){
        res.status(400).json({error:errors});
        return;
    }
    const sql = `UPDATE candidates SET party_id =? WHERE id=?`;
    const params =[req.params.party_id, req.params.id];
    db.query(sql,params,(err,result)=>{
        if(err){
            res.status(400).json({error: err.message})
            //check if a record was found.
        } else if (!result.affectedRows) {
            res.json({
                message:'Candidate not found'
            })       
        } else {
            res.json({
                message:'success',
                data:req.body,
                changes: result.affectedRows
            });
        }
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