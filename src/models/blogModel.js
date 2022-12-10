const { default: mongoose } = require("mongoose");

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    tags:{
        type:Array
    },
    category:{
        type:Array,
        required:true
    },
    subcategory:{
        type:Array
    },
    deletedAt:{
        type:String
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    publishedAt:{
        type:String,
    },
    isPublished:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports=mongoose.model('Blog',blogSchema)