const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var prodSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    quantity: {
        type:Number,
        required:true,
    },
    sold:{
        type:Number,
        default:0,
    },
    images:[
        {
            url:String,
            secure_url:String,
            main_file:String

        }
    ],
    color:{
        type:String,
        required:true,
    },
    ratings:[
        {
            star:Number,
            comment:String,
            posted_by:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            }
        }
    ],
    total_rating:{
        type:String,
        default:0
    }
},
{
    timestamps:true
});


  
//Export the model
module.exports = mongoose.model('Product', prodSchema);