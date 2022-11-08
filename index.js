const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lezxbrx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('doctorsChamber').collection('services');

        app.post('/services', async(req, res)=>{
            const services = req.body;
            console.log(services)
            const result = await serviceCollection.insertOne(services);
            res.send(result)
        })
    }
    finally{}

}

run().catch(err=> console.log(err));


app.get('/', (req, res) => {
  res.send(`doctor server is running on ${port}`)
})

app.listen(port, () => {
  console.log(`doctor chamber listening on port ${port}`)
})