const { default: mongoose } = require("mongoose");

const authorSchema = new mongoose.Schema(
    { fname: {
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    title:{
        type:String,
        enum:["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        required:true,
        unique : true
    },
    password: {
        type:String,
        required:true
    }}
)

module.exports = mongoose.model("Author", authorSchema)