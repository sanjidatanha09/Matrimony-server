const express = require('express');
const Data = require('../../modules/Services');
var router = express.Router();



//data related api

router.get('/datas', async (req, res) => {

    const result = await Data.find();
    res.send(result);
})

router.get('/checkout/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await Data.findOne(query);
    res.send(result);
});

router.get('/datasemail', async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const result = await Data.find(query).toArray();
    res.send(result);
})


router.patch('/patchpremium/premium/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };

    const updateDoc3 = {
        $set: {

            action: 'premium'
        }
    }
    const result = await Data.updateOne(filter, updateDoc3)
    res.send(result);


})

router.post('/postdatas', async (req, res) => {
    const newdata = req.body;
    console.log(newdata);
    const result = await Data.insertOne(newdata);
    res.send(result);
})



module.exports = router