const {Schema ,model}= require("mongoose")

const usersSchema = new Schema({
    userName:String,
    email:String,
    password:String,
    photoPath:String

})

module.exports = model("users",usersSchema)