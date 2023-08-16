require('dotenv').config()
const path = require("path")
const fs = require("fs").promises
const clc = require("cli-color");
const express = require('express')
const usersSchema = require("./modules/users")
const app = express()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
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
app.route("/api/v1/users").post(upload.single('avatar'),async (req, res) => {
console.log(req.file?.path)
console.log({photoPath:req.file?.path,...req.body})
  const newUser = await usersSchema.create({photoPath:req.file?.path,...req.body})
  res.json(newUser)
  return
}).get(async (req, res) => {
  
  const allUser = await usersSchema.find()
  res.json(allUser)
  return
})

app.route("/api/v1/users/:id").get(async(req,res)=>{
  // const user = await usersSchema.findById(req.params.id)
  const user = await usersSchema.findById(req.params.id)
  
  res.json(user)
  
  return
})
app.route("/api/v1/users/photo/:id").get(async(req,res)=>{
  
  const user = await usersSchema.findById(req.params.id)
  res.sendFile(user.photoPath,{
    root: path.join(__dirname)
})
  
  
  return
})


mongoose.connect(process.env.DBURL)
  .then(() => console.log(clc.cyan('Connected!')));
app.listen(process.env.PORT, () => {
  console.log(clc.cyan(process.env.PORT) )
})