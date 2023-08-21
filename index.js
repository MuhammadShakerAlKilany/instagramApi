require('dotenv').config()
const path = require("path")
const fs = require("fs").promises
const clc = require("cli-color");
const express = require('express')
var cors = require('cors')
const usersSchema = require("./modules/users")
const app = express()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
  let method
  switch (req.method) {
    case "GET":
      method = clc.green(req.method)
      break;
    case "POST":
      method = clc.yellowBright(req.method)
      break;
    case "PATCH":
      method = clc.magenta(req.method)
      break;
    case "DELETE":
      method = clc.red(req.method)
      break;

    default:
      break;
  }
  console.log(method, clc.yellow(req.url))
  next()
})
app.get('/', function(req, res) {
  res.redirect("/api/v1")

})
app.get('/api/v1', function(req, res) {
  res.json({ ms: 'Hello to instagramapi By Muhammad AlKilany' })

})
app.route("/api/v1/users").post(upload.single('avatar'), async (req, res) => {
  const userFind = await usersSchema.findOne({ email: req.body.email })
  if (userFind) {
    res.status(403).json({ ms: "email not accepted" })
    return
  }
  console.log(req.file?.path)
  console.log({ photoPath: req.file?.path, ...req.body })
  const newUser = await usersSchema.create({ photoPath: req.file?.path, ...req.body })
  res.json(newUser)
  return
}).get(async (req, res) => {

  const allUser = await usersSchema.find()
  res.json(allUser)
  return
})
app.route("/api/v1/users/login").post(upload.single(), async (req, res) => {

  // console.log(req.body)

  const userFind = await usersSchema.findOne({ email: req.body.email })
  if (userFind) {
    if (userFind.password == req.body?.password) {
      res.json(userFind)
      return
    } else {
      res.status(403).json({ ms: "password is rong" })
      return
    }

  } else {
    res.status(404).json({ ms: "not found user" })
    return
  }
})
app.route("/api/v1/users/:id").get(async (req, res) => {
  // const user = await usersSchema.findById(req.params.id)
  const user = await usersSchema.findById(req.params.id)

  res.json(user)

  return
})
app.route("/api/v1/users/photo/:id").get(async (req, res) => {

  const user = await usersSchema.findById(req.params.id)
  if (user.photoPath) {
    const file = path.join(__dirname, user.photoPath)
    if (file) {

      res.sendFile(user.photoPath, {
        root: path.join(__dirname)
      })
    }
  }




  return
})
app.route("/api/v1/users/follows/patch/:userId/:id").post(async (req, res) => {
  console.log(req.params)
  const user = await usersSchema.findByIdAndUpdate(req.params.id, { "$push": { "follows": req.params.userId } }, { new: true })

  res.json(user)
})
app.route("/api/v1/users/follows/delete/:userId/:id").post(async (req, res) => {
  console.log(req.params)
  const user = await usersSchema.findByIdAndUpdate(req.params.id, { "$pull": { "follows": req.params.userId } }, { new: true })

  res.json(user)
})
app.route("/api/v1/users/follows/:userId/:id").get(async (req, res) => {
  const isfollow = await usersSchema.find({ _id: req.params.id, "follows": req.params.userId })
  if (isfollow[0]) {
    console.log({ isfollow: true })
    res.json({ isfollow: true })
  } else {
    console.log({ isfollow: false })
    res.json({ isfollow: false })
  }
})
app.use("/api/v1", require("./routes/postRouts"))
mongoose.connect(process.env.DBURL)
  .then(() => console.log(clc.cyan('Connected!')));
app.listen(process.env.PORT, () => {
  console.log(clc.cyan(process.env.PORT))
})