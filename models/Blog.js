const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },

    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        defualt:0,
    },
    isLiked: {
        type:Boolean,
        defualt:false,
    },
    isDisliked:{
        type:Boolean,
        defualt:false,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    images:[
        {
            url:String,
            secure_url:String,
            main_file:String

        }
    ],
    author:{
        type:String,
        defualt:"Admin"
    }
},
{
    toJSON:{},
    toObject:{},
});


  
//Export the model
module.exports = mongoose.model('Blog', blogSchema);