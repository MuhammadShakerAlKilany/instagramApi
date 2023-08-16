const express = require('express')
const usersSchema = require("./schema") 
const app = express()
const mongoose = require('mongoose');
app.get('/', function (req, res) {
  res.send('Hello World')
  
})


mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Connected!'));
app.listen(3000)