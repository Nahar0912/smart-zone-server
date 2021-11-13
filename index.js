const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpdva.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('smart-zone');
        const productsCollection = database.collection('products');

        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // GET Single Service
        app.get('/products/:id', async (req, res) => {
            const id = req.params._id;
            console.log('getting specific service', _id);
            const query = { _id: ObjectId(_id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        })

        // POST API
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product);

            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result)
        });

        // DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(_id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Samrt-Zone');
});

app.get('/hello', (req, res) => {
    res.send('hello updated here')
})

app.listen(port, () => {
    console.log('Running Smart-Zone Server on port', port);
})

