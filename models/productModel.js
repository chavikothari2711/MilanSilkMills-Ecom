import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:'Category',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    color:{
        type:String,
        required:true
    },
    keywords:{
        type:String,
        default:"saree,Milan Silk Mills,indian wear, traditional"
    },
    colouravailable:{
        type:String,
        required:true
    },
    shipping:{
        type:String,
        default:"0"
    }
},{timeStamps:true})

export default mongoose.model("product",productSchema);