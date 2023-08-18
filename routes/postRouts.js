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
router.route("/posts/loves/:id/:userId").patch(async(req,res)=>{
    const post = await postSchema.findByIdAndUpdate(req.params.id,{"$push":{"loves":req.params.userId}},{new:true})
    res.json(post)
}).delete(async(req,res)=>{
 const post =   await postSchema.findByIdAndUpdate(req.params.id,{"$pull":{"loves":req.params.userId}},{new:true})

    res.json(post)
}).get(async(req,res)=>{
    const isLove = await postSchema.find({_id:req.params.id,"loves":req.params.userId})
    if(isLove[0]){

        res.json({isLove:true})
    }else{
        res.json({isLove:false})
    }
})
router.route("/posts/photo/:id").get(async(req,res)=>{
    const user = await postSchema.findById(req.params.id)
    res.sendFile(user.photoPath,{
      root: path.join(__dirname, "../")
  })
    
    
    return
})

module.exports = router