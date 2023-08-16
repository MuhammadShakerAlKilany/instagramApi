require('dotenv').config()
const clc = require("cli-color");
const express = require('express')
const usersSchema = require("./modules/users")
const app = express()
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req,res,next)=>{
  let method  
  switch (req.method) {
    case "GET":
      method= clc.green(req.method)
      break;
    case "POST":
      method= clc.yellowBright(req.method)
      break;
    case "PATCH":
      method= clc.magenta(req.method)
      break;
    case "DELETE":
      method= clc.red(req.method)
      break;
  
    default:
      break;
  }
 console.log(method,clc.yellow(req.url))
 next() 
})
app.get('/api/v1', function (req, res) {
  res.send('Hello World')

})
app.route("/api/v1/users").post(async (req, res) => {

  const newUser = await usersSchema.create(req.body)
  res.json(newUser)
  return
}).get(async (req, res) => {

  const allUser = await usersSchema.find()
  res.json(allUser)
  return
})

app.route("/api/v1/users/:id").get(async(req,res)=>{
  
    const user = await usersSchema.findById(req.params.id)
  res.json(user)
  return
})


mongoose.connect(process.env.DBURL)
  .then(() => console.log(clc.cyan('Connected!')));
app.listen(process.env.PORT, () => {
  console.log(clc.cyan(process.env.PORT) )
})