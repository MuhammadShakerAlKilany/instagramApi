const {Router} = require("express") 
const path = require("path")
const router = Router()
const postSchema = require("../modules/posts")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


router.route("/posts").get(async(req,res)=>{
    const posres = await postSchema.find()
    return res.json(posres)
}).post(upload.single("imgPost"),async(req,res)=>{
    
    const newPost =  await postSchema.create({img:req.file.path,...req.body})
    return res.json(newPost)
})
router.route("/posts/loves/patch/:id/:userId").post(async(req,res)=>{
  console.log(req.params)
    const post = await postSchema.findByIdAndUpdate(req.params.id,{"$push":{"loves":req.params.userId}},{new:true})
  
    res.json(post)
})
  router.route("/posts/loves/delete/:id/:userId").post(async(req,res)=>{
    console.log(req.params)
 const post =   await postSchema.findByIdAndUpdate(req.params.id,{"$pull":{"loves":req.params.userId}},{new:true})

    res.json(post)
})
    router.route("/posts/loves/:id/:userId").get(async(req,res)=>{
    const isLove = await postSchema.find({_id:req.params.id,"loves":req.params.userId})
    if(isLove[0]){
            console.log({isLove:true})
        res.json({isLove:true})
    }else{
      console.log({isLove:false})
        res.json({isLove:false})
    }
})
router.route("/posts/photo/:id").get(async(req,res)=>{
  try {
     console.log(req.params.id)
    const post = await postSchema.findById(req.params?.id)
    console.log(post.img)
  const file = post.img
  console.log(path.join(__dirname, "..",`${file}`))
  if (path.join(__dirname, "..",`${file}`)) {
    res.sendFile(path.join(__dirname, "..",file))
  } else{
    res.end()
  }
  } catch (error) {
    console.log(error)
  }
   
  
//   res.json(post)
    
    
    
    
})

module.exports = router