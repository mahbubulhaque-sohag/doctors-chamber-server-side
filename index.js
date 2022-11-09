const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())

// const uri = 'mongodb://localhost:27017';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lezxbrx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('doctorsChamber').collection('services');
        const reviewCollection = client.db('doctorsChamber').collection('reviews');
        // get services api
        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            // console.log(id)
            const services = await serviceCollection.findOne(query)
            res.send(services)
        })

        //  get limit services api
        app.get('/servicesThree', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services)
        })
        // post services api
        app.post('/services', async(req, res)=>{
            const services = req.body;
            // console.log(services)
            const result = await serviceCollection.insertOne(services);
            res.send(result)
        })

        // post reviews api
        app.post('/reviews', async(req, res)=>{
            const reviews = req.body;
            // console.log(reviews)
            const result = await reviewCollection.insertOne(reviews);
            res.send(result);
        })
        
        // get reviews api
        app.get('/reviews/:serviceName', async(req, res)=>{
            const name = req.params.serviceName;
            const query = {serviceName: name};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        // get reviews api by username
        app.get('/review/:user', async(req, res)=>{
            const user = req.params.user;
            // console.log(user)
            const query = {name:user};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        // delete review api with id
        app.delete('/review/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const reviews = reviewCollection.deleteOne(query);
            console.log(reviews)
          
            res.send(reviews)
        })
    }
    finally{
       
    }

}

run().catch(err=> console.log(err));


app.get('/', (req, res) => {
  res.send(`doctor server is running on ${port}`)
})

app.listen(port, () => {
  console.log(`doctor chamber listening on port ${port}`)
})