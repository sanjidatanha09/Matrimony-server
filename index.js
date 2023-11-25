const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lxaloof.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        const dataCollection = client.db('MatrimonyDB').collection('data');
        const reviewCollection = client.db('MatrimonyDB').collection('reviews');
        const detailsCollection = client.db('MatrimonyDB').collection('details');


        //data related api

        app.get('/datas', async (req, res) => {
        
            const result = await dataCollection.find().toArray();
            res.send(result);
        })

        app.post('/postdatas', async (req, res) => {
            const newdata = req.body;
            console.log(newdata);
            const result = await dataCollection.insertOne(newdata);
            res.send(result);
        })

        //review related 

        app.get('/clientreview', async (req, res) => {

            const result = await reviewCollection.find().toArray();
            res.send(result);
        })

        //details related
        
        app.get('/profiledetails', async (req, res) => {
            const email = req.query.email;
            const query = {email : email};
            const result = await detailsCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/profiledetails', async (req, res) => {

            const profiledetails = req.body;

            const result = await detailsCollection.insertOne(profiledetails);
            res.send(result);
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Assignment 12 is running')
})

app.listen(port, () => {
    console.log(`Assignment-12 server is running on port: ${port}`);
})
