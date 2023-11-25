const express = require('express');
const applyMiddleWare = require('./Middleware/ApplyMiddleware');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


applyMiddleWare(app)

app.get('/health', (req, res) => {
    res.send('Assignment 12 is running')
})

app.all("*",(req,res,next) =>{
    // console.log(req.url)

    const error = new Error(`the requested url is invalid : [${req.url}]`)
    error.status = 404
    next(error)
})

app.use((err,req,res,next) =>{
    res.status(err.status || 500).json({
        message:err.message
    })
})

app.listen(port, () => {
    console.log(`Assignment-12 server is running on port: ${port}`);
})
