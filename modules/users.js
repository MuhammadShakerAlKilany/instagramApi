const {Schema ,model}= require("mongoose")

const usersSchema = new Schema({
    userName:String,
    email:String,
    password:String,
    photoPath:String,
  follows:{
        
    type:[Schema.Types.ObjectId],
        default:[]
}

})

module.exports = model("users",usersSchema)