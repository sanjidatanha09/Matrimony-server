var express = require('express')
const createcokietoken = require('../../api/authntication/createcokietoken')
var router = express.Router()

router.post('/jwt',createcokietoken)

module.exports = router;