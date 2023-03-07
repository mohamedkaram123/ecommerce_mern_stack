const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require("crypto")
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    f_name:{
        type:String,
        required:true,
    },
    l_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    cart:{
        type:Array,
        default:[]
    },
    address:{
        type:String
    },
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    refreshToken:{
        type:String
    },
    passwordChangeAt:Date,
    PasswordResetToken:String,
    PasswordResetExpires:Date
},
{
    timestamps:true
});

userSchema.methods.isPassword = async function(enterPass){
    return await bcrypt.compare(enterPass,this.password)
}

userSchema.methods.createPasswordResetToken = async function(){
   const resetToken = crypto.randomBytes(32).toString("hex")
   this.PasswordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
   this.PasswordResetExpires = Date.now() + 30 * 60 * 1000
   return resetToken
}

userSchema.pre('save', async function(next) {
 //   const user = this;
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (error) {
      next(error);
    }
  });
  
//Export the model
module.exports = mongoose.model('User', userSchema);