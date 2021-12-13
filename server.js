//import express
const express = require ('express');
// add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();
//express middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/',(req,res)=>{
    res.json({
        message:'Hello World'
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