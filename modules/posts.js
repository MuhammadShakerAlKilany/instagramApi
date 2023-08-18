const {Schema,model} = require("mongoose")

const postSchema = new Schema({
    userId: Schema.Types.ObjectId,
    img:String,
    caption:String,
    loves:{
        
    type:[Schema.Types.ObjectId],
        default:[]
}
})

module.exports = model("postS",postSchema)