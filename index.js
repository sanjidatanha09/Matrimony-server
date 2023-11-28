const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const favouriteCollection = client.db('MatrimonyDB').collection('favourite');
        
        const userCollection = client.db('MatrimonyDB').collection('users');
        const premiumCollection = client.db('MatrimonyDB').collection('Premium');
        const paymentCollection = client.db('MatrimonyDB').collection('payments');

        //payment related
        app.post('/postpayment', async (req, res) => {

            const newdata = req.body;
            const result = await paymentCollection.insertOne(newdata);
            res.send(result);
        })

        app.get('/getmoney', async (req, res) => {

            const result = await paymentCollection.find().toArray();
            res.send(result);
        })

        // jswt related api
        app.post('/jwt',async(req,res)=>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
            res.send({token});
        })

        //verify admin
        const verifyAdmin = async (req,res,next) =>{
            const email = req.decoded.email;
            const query = {email:email};
            const user = await userCollection.findOne(query);
            if(!isAdmin){
                return res.status(403).send({message: 'forbidden access'});
            }
            next();
        }

        //middlewares
        const verifyToken = (req,res,next) =>{
            console.log('inside verify token',req.headers.authorization);
            if(req.headers.authorization){
                return res.status(401).send({message: 'forbidden access'});
            }
            const token = req.headers.authorization;
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded) =>{
                if(err){
                    return res.status(401).send({message: 'forbidden access'})
                }
                req.decoded = decoded
                next();
            })
            
            // next();


        }



        //users related api

        app.get('/user',async (req,res) =>{
            
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.get('/adminverifyuser/admin/:email', async (req, res) => {
            const email = req.params.email;

            // if(email !== req.decoded.email){
            //     return res.status(403).send({message: 'unathorized access'})
            // }
            const query = {email: email};

            const user = await userCollection.findOne(query);
            let admin = false;
            if(user){
                admin = user?.role == 'admin';
            }
            res.send({admin});
        })
        app.get('/premiumverifyuser/premium/:email', async (req, res) => {
            const email = req.params.email;

            // if(email !== req.decoded.email){
            //     return res.status(403).send({message: 'unathorized access'})
            // }
            const query = { email: email };

            const user = await userCollection.findOne(query);
            let premium = false;
            if (user) {
                premium = user?.action == 'premium';
            }
            res.send({ premium });
        })



        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        app.patch('/patchuser/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };

            const updateDoc ={
                $set:{
                    role:'admin',
                    action:'premium'
                }
            } 
            const result = await userCollection.updateOne(filter,updateDoc)
            res.send(result);
            

        })

        app.patch('/patchuser/premium/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };

            const updateDoc2 = {
                $set: {
                   
                    action: 'premium'
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc2)
            res.send(result);


        })




        app.post('/users', async(req,res) =>{
            const user = req.body;
            const query = {email: user.email}
        
            const exitingUser = await userCollection.findOne(query);
            if(exitingUser){
                return res.send({message: 'user already exists', insertedId: null});
            }

            const result = await userCollection.insertOne(user)
            res.send(result)
        })


        //permium related api
        app.post('/postpremium', async (req, res) => {

            const profiledetails = req.body;
            const result = await premiumCollection.insertOne(profiledetails);
            res.send(result);
        })



        //data related api

        app.get('/datas', async (req, res) => {
        
            const result = await dataCollection.find().toArray();
            res.send(result);
        })

        app.get('/checkout/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await dataCollection.findOne(query);
            res.send(result);
        });

        app.get('/datasemail', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await dataCollection.find(query).toArray();
            res.send(result);
        })
        

        app.patch('/patchpremium/premium/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };

            const updateDoc3 = {
                $set: {

                    action: 'premium'
                }
            }
            const result = await dataCollection.updateOne(filter, updateDoc3)
            res.send(result);


        })

        

        app.post('/postdatas', async (req, res) => {
            const newdata = req.body;
            console.log(newdata);
            const result = await dataCollection.insertOne(newdata);
            res.send(result);
        })

        //review related 

        app.post('/clientstorypost', async (req, res) => {
            const newdata = req.body;
            console.log(newdata);
            const result = await reviewCollection.insertOne(newdata);
            res.send(result);
        })

        app.get('/clientreview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollection.findOne(query);
            res.send(result);
        });


        app.get('/clientreview', async (req, res) => {

            const result = await reviewCollection.find().toArray();
            res.send(result);
        })

        //favourite related

        app.get('/favget', async (req, res) => {

            const result = await favouriteCollection.find().toArray();
            res.send(result);
        })

        app.get('/favget/:email', async (req, res) => {
            const query = { email: req.params.email }
            const result = await favouriteCollection.find(query).toArray();
            res.send(result);

        })
        
        app.get('/profiledetails', async (req, res) => {
            const email = req.query.email;
            const query = {email : email};
            const result = await favouriteCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/profiledetails', async (req, res) => {

            const profiledetails = req.body;
            const result = await favouriteCollection.insertOne(profiledetails);
            res.send(result);
        })


        //payment intent

        app.post('/create-payment-intent',async(req,res) =>{
            const {addfee} = req.body;
            const amount = parseInt(addfee * 100);
            console.log(amount,'amoount inside')
        

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            })
            res.send({
                clientSecret: paymentIntent.client_secret
            })
        })

        app.post('/payments', async (req, res) => {
            const payment = req.body;
            const paymentResult = await paymentCollection.insertOne(payment);

            console.log('payment info',payment);
            

            res.send(paymentResult)
        })
        app.get('/getpayments/:email', async (req, res) => {
            const query = {email: req.params.email}
            const result = await paymentCollection.find(query).toArray();
            res.send(result);

        })
        app.get('/getpayments', async (req, res) => {
           
            const result = await paymentCollection.find().toArray();
            res.send(result);

        })

        app.patch('/patchcontact/request/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };

            const updateDoc3 = {
                $set: {

                    action: 'approve'
                }
            }
            const result = await paymentCollection.updateOne(filter, updateDoc3)
            res.send(result);


        })



        //admin stat
        app.get('/admin-stat', async (req, res) => {
            const biodata = await dataCollection.estimatedDocumentCount();
            // const premium = await userCollection.estimatedDocumentCount();
            // const users = await userCollection.estimatedDocumentCount();

            // const payments = await paymentCollection.find().toArray();
            // const revenue = payments.reduce((total, payment) =>total + payment.addfee,0)

            const result = await paymentCollection.aggregate([
                {
                    $group:{
                        _id:null,
                        totalRevenue:{
                            $sum:'$addfee'
                        }
                    }
                }
            ]).toArray();
            const revenue = result.length >0 ? result[0].totalRevenue : 0;

            res.send({
                biodata,
                revenue
            })
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
