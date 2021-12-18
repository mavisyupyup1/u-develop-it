//import express
const express = require ('express');
//requiring the new connection.js db module export by declaring new const
const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes')

// add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//use apiRoutes
app.use('/api',apiRoutes)

//default response for any other request(Not Found)
app.use((req,res)=>{
    res.status(404).end();
})
//start express.js server on port 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})