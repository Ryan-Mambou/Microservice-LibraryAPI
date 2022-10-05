const express = require('express');
const app = express();
const mongoose = require('mongoose')
require('dotenv').config();
const username = process.env.USER;
const password = process.env.PASSWORD;
const Customer = require('./Customer')

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
    res.send('Hello my customers!')
})

app.post('/api/customers', (req, res, next) => {
    const {name, age, address} = req.body;

    const customer = new Customer({
        name: name,
        age: age,
        address: address
    })

    customer.save()
    .then(() => res.status(201).json({message: 'User added!'}))
    .catch(error => res.status(404).json({error}))
})

app.get('/api/customers', (req, res, next) => {
    Customer.find()
    .then(customers => res.status(200).json(customers))
    .catch(error => res.status(500).json({error}))
})

app.get('/api/customers/:id', (req, res, next) => {
    Customer.findById(req.params.id)
    .then(customer => res.status(200).json(customer))
    .catch(error => res.status(500).json({error}))
})

app.delete('/api/customers/:id', (req, res, next) => {
    Customer.findOne({_id: req.params.id})
    .then(customer => {
        if(!customer) {
            res.status(404).json({
                error: new Error('No such Book!')
            });
        }
        Customer.findOneAndRemove(req.params.id)
        .then(() => res.status(200).json({message: 'customer deleted!'}))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}))
})


  module.exports = app;