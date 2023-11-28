const express = require('express');
const applyMiddleWare = require('./Middleware/ApplyMiddleware');
const connectDB = require('./db/connecDB');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const authentication = require("./Routes/Authentication/index")

applyMiddleWare(app)

//jswt related api
app.use(authentication);


app.get('/', (req, res) => {
    res.send('Assignment 12 is running mongoose')
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

const main=async () =>{
    await connectDB();
    app.listen(port, () => {
        console.log(`Assignment-12 server is running on port mongoose: ${port}`);
    })

};
main();