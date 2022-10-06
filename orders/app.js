const  axios = require('axios');
const express = require('express');
const app = express();
const mongoose = require('mongoose')
require('dotenv').config();
const username = process.env.USER;
const password = process.env.PASSWORD;
const Order = require('./Order')

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.mbxky.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected !'))
  .catch(() => console.log('MongoDB not connected !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.get('/', (req, res) => {
    res.send('Hello my orders!')
})

app.post('/api/order', (req, res, next) => {
    const {CustomerID, BookID, initialDate, deliveryDate} = req.body;

    const order = new Order({
        CustomerID: CustomerID,
        BookID: BookID,
        initialDate: initialDate,
        deliveryDate: deliveryDate
    })

    order.save()
    .then(() => res.status(201).json({message: 'Order created with success!'}))
    .catch(error => res.status(500).json({error}))
})

app.get('/api/order', (req, res, next) => {
  Order.find()
  .then((books) => res.status(200).json(books))
  .catch(error => res.status(500).json({error}))
})

app.get('/api/order/:id', (req, res, next) => {
  Order.findById(req.params.id)
  .then(order => {
    if(order){
      axios.get(`http://localhost:5500/api/order/${order.CustomerID}`)
      .then(customer => console.log(customer.data))
      .catch(error => res.status(400).json({error}))
    }
    else{
      res.send('Invalid ID!')
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({error})
  })
})

  module.exports = app;