const cors = require('cors');
const express = require('express');
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { LOCAL_CLIENT, CLIENT } = require('../config/default');


const applyMiddleWare= (app) =>{


    //middleware


    // "start": "node src/app.js",
    //     "dev": "nodemon src/app.js",


    app.use(cors({
        origin: [
            LOCAL_CLIENT,
            CLIENT
           


        ],
        credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser())
}

module.exports = applyMiddleWare