const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const db = mongoose.connection
require('dotenv').config()

mongoose.set('useCreateIndex', true)

// const DB_URL = process.env.DB_TEST
const DB_URL = process.env.DB_DEVELOPMENT
mongoose.connect(DB_URL, { useNewUrlParser: true })

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('> DB Connected')
})

const app = express();
  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
  
const transactionIndex = require('./routes/transaction')

app.use('/trx', transactionIndex)

module.exports = app;
