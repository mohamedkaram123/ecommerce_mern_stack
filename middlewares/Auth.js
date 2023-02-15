const User = require("../models/User")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const AuthMiddleware = asyncHandler(async (req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        try {
            let token = req?.headers?.authorization?.split(" ")[1];

            if(token){
                const decode = jwt.verify(token,process.env.JWT_SECRET)
                const user = await User.findById(decode?.id)
                req.user = user
                next()
            }
        } catch (error) {
            throw new Error("Not Authorized token expired, please login again")

        }
    }else{
        throw new Error("there is not token attached to header")
    }

})

const IsAdmin = asyncHandler(async (req,res,next)=>{
    let id = req.user._id.toString();
    const user = await User.findById(id)
    
    if(user.role != "admin"){
        throw new Error("You Are Not Admin")
    }else{
        next()
    }
})

module.exports={AuthMiddleware,IsAdmin}