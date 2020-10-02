const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yf6o8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(cors())
app.use(bodyParser.json())

// mongodb
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");

    // post or create database
    app.post('/addProduct', (req, res) => {
        const products = req.body;

        productsCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount)
                console.log(result.insertedCount);

            })
    })

    // read or get all products from database
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // read single product for product details
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    // cart products
    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        productsCollection.find({ key: { $in: productsKeys } })
            .toArray((err, documents) => {
                res.send(documents);

            })

    })

    // order place details collection
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount>0)
                console.log(result);

            })
    })

    console.log("database connected");

});


const port = 5000;
app.listen(port, console.log(`Example app listening at http://localhost:${port}`))