const User = require("../models/User")
const asyncHandller = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { check, validationResult } = require('express-validator');
const validateMongoDbId = require("../utils/validateMongoDb");
const {generateRefreshToken} = require("../config/refreshToken");
const jwt  = require("jsonwebtoken");
const mailSend = require("../config/mailer");
const crypto = require("crypto")

//require("../mails/mail.html")

const createUser = asyncHandller(async (req,res)=>{
    const email = req.body.email;
    const mobile = req.body.mobile;

    const findUser = await User.find({
        $or:[
            { email },
            { mobile }
        ]
    }).then(users=>{
        if(users.length < 1){
            const newUser = User.create(req.body,(err,user)=>{
                res.json({
                    "msg":"success",
                    "user":user
                })
            })
        }else{
            throw new Error("User Aleardy Exist")
        }
    })
   
})

const loginUser = asyncHandller(async (req,res)=>{
    
    const {email,password} = req.body
    const findUser = await User.findOne({email})
    const user_pass = await findUser.isPassword(password)
    const refreshToken = await generateRefreshToken(findUser._id)

    const user = await User.findByIdAndUpdate(findUser._id,{
        refreshToken:refreshToken,
    },{new:true})

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge:72 * 60 * 60 * 1000
    })

    if(user_pass){
        res.json({
            "msg":"success",
            "user":{
                ...user._doc,
                token:generateToken(findUser._id)
            }
        })
    }else{
        throw new Error("Invalid Credentials")
    }
})


const loginAdmin = asyncHandller(async (req,res)=>{
    
    const {email,password} = req.body
    const findAdmin = await User.findOne({email})
    if(findAdmin.role !== "admin") throw new Error("the user not authrized")
    const user_pass = await findAdmin.isPassword(password)
    const refreshToken = await generateRefreshToken(findAdmin._id)

    const user = await User.findByIdAndUpdate(findAdmin._id,{
        refreshToken:refreshToken,
    },{new:true})

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge:72 * 60 * 60 * 1000
    })

    if(user_pass){
        res.json({
            "msg":"success",
            "user":{
                ...user._doc,
                token:generateToken(findAdmin._id)
            }
        })
    }else{
        throw new Error("Invalid Credentials")
    }
})


const get_all_users = asyncHandller(async (req,res)=>{
    const users = await User.find();
    
    res.json({
        msg:users.length < 1?"users not found":"users is success",
        users
    })

})

const get_user = asyncHandller(async (req,res)=>{
    try {
        let reqs = req?.params
        let {id} = reqs
        validateMongoDbId(id)
        const user = await User.findById(id)
        res.json({
            msg:"the data is success",
            user
        })
    } catch (error) {
        throw new Error(error)
    }
})


const delete_user = asyncHandller(async (req,res)=>{
    try {
        let reqs = req?.params
        let {id} = reqs
        validateMongoDbId(id)

        const user = await User.findByIdAndDelete(id)
        res.json({
            msg:"the user is deleted",
            user
        })
    } catch (error) {
        throw new Error(error)
    }
  
    
})

const test_login = asyncHandller(async (req,res)=>{
    
    res.json({
        msg:"hello world"
    })
    
})

const update_user = asyncHandller(async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

        let reqs = req?.body
        let id = req.user._id.toString();
        validateMongoDbId(id)

        const user = await User.findByIdAndUpdate(id,{
            f_name:reqs.f_name,
            l_name:reqs.l_name,
            email:reqs.email,
            mobile:reqs.mobile
        },{new:true})
        res.json({
            msg:"the user is updated",
            user
        })
    } catch (error) {
        throw new Error(error)
    }
  
    
})


const block_user = asyncHandller(async (req,res)=>{


    try {

        let reqs = req?.params
        let {id} = reqs
        validateMongoDbId(id)

        const user = await User.findByIdAndUpdate(id,{
            isBlocked:true
        },{new:true})
        res.json({
            msg:"the user is is blocked",
            user
        })
    } catch (error) {
        throw new Error(error)
    }
  
    
})

const unblock_user = asyncHandller(async (req,res)=>{
    try {

    } catch (error) {
        throw new Error(error)
    }
  
    
})

const handleRefreshToken = asyncHandller(async (req,res)=>{
   try {
    let cookie = req.cookies
   
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookie")
    let refreshToken = cookie.refreshToken
    const findUser = await User.findOne({refreshToken})
    if(!findUser) throw new Error("No User has refresh token in database asccess")
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decode )=>{
      
        if(err || findUser.id !== decode.id){
            throw new Error("There is something wrong in refresh token")
        }

        res.json({
            ...findUser._doc,
            token:generateToken(findUser._id)
        })
    })
    
     } catch (error) {
       throw new Error(error)
      }
})


const logout = asyncHandller(async (req,res)=>{
   try {

            let cookie = req.cookies
        
            if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookie")
            let refreshToken = cookie.refreshToken
            const findUser = await User.findOne({refreshToken})
            if(!findUser){
       
                res.clearCookie('refreshToken',{
                    httpOnly:true,
                    secure:true
                })

                 res.sendStatus(204)
            }
            
            await User.findOneAndUpdate({
                refreshToken:""
            })
            res.clearCookie('refreshToken',{
                httpOnly:true,
                secure:true
            })
             res.sendStatus(204)

     } catch (error) {
       throw new Error(error)
      }
})

const update_password = asyncHandller(async (req,res)=>{
   try {
            const {_id} = req.user
            const password = req.body.password
        
            validateMongoDbId(_id)
            const user = await User.findById(_id)
            if(password){
                user.password = password
                const update_password = await user.save()
                res.json(update_password)
            }else{
                res.json(user)
            }

     } catch (error) {
       throw new Error(error)
      }
})

const test_send_mail = asyncHandller(async (req,res)=>{
   let resp = mailSend({to:['momokaram223@gmail.com'],withobj:{title:"test"}})   
   res.json(resp)
})

const forget_pass = asyncHandller(async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
   try {
        let {email} = req.body
        let user = await User.findOne({email})
        if(!user) throw new Error("User Not Found With Email")

        let token = await user.createPasswordResetToken();
        await user.save()

        const host = req.headers.host;

        let link = `http://${host}/api/user/reset-password/${token}`
        
        let info = mailSend({to:[user.email],withobj:{disc:"you can reset password from this link ",link_mail:link}})   
        res.json({
            "msg":"send",
            "status":info?1:0
        })

     } catch (error) {
       throw new Error(error)
      }
})

const reset_password = asyncHandller(async (req,res)=>{
   try {
     const {token} = req.params
     const {password} = req.body

     const reset_token = crypto.createHash("sha256").update(token).digest("hex")
     let user = await User.findOne({
        PasswordResetToken:reset_token,
        PasswordResetExpires:{$gt:Date.now()}
     })
     if(!user) throw new Error("the token invalid")
     
     res.json(user)

     } catch (error) {
       throw new Error(error)
      }
})


const reset_password_update = asyncHandller(async (req,res)=>{
    try {
      const {password,token} = req.body
 
      const reset_token = crypto.createHash("sha256").update(token).digest("hex")
      let user = await User.findOne({
         PasswordResetToken:reset_token
      })
      if(!user) throw new Error("the token invalid")
      user.password = password
      user.PasswordResetToken = undefined
      user.PasswordResetExpires = undefined
      await user.save()
      res.json(user)
      
      } catch (error) {
        throw new Error(error)
       }
 })

const getUserWishlist = asyncHandller(async (req,res)=>{
    let {_id} = req.user
    validateMongoDbId(_id)

   try {
        let user = await User.findById(_id)
                    .populate('wishlist') // Populate the wishlist array with the actual product objects
        res.json({wishlist:user.wishlist})
     } catch (error) {
       throw new Error(error)
      }
})

const saveAddress = asyncHandller(async (req,res)=>{
    let {_id} = req.user
    validateMongoDbId(_id)
   try {
    let {address} = req.body
      let user = await User.findByIdAndUpdate(_id,{
        address
      },{
        new :true
      })
      res.json(user)
    } catch (error) {
       throw new Error(error)
      }
})
 
module.exports = {
    createUser,
    handleRefreshToken,
    loginUser,get_all_users,
    get_user,
    delete_user,
    update_user,
    test_login,
    block_user,
    unblock_user,
    logout,
    update_password,
    test_send_mail,
    forget_pass,
    reset_password,
    reset_password_update,
    loginAdmin,
    getUserWishlist,
    saveAddress
}