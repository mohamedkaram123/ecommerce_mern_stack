
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');
const slugify = require("slugify")
const Category = require("../models/Category")
const BlogCat = require("../models/BlogCat")
const Brand = require("../models/Brand")
const User =  require("../models/User")
const Coupon =  require("../models/Coupon")


const validate_update_user = ()=>{
   return [
    check('f_name','your frist name must be valid').notEmpty(),
    check('email').isEmail().withMessage('the email mus be email').notEmpty().withMessage("'the email must be valid'"),
  ]
}


const validate_create_prod = ()=>{
  return [
   check('title','the title is valid').notEmpty(),
   check('quantity','the quantity is valid').notEmpty(),
   check('color','the color is valid').notEmpty(),
   check('brand','the brand is valid').notEmpty(),
   check('category','the category is valid').notEmpty(),

   check('description','the description is valid').notEmpty(),
   check('price').notEmpty().withMessage('the price is valid'),

 ]
}

const validate_forget_pass = ()=>{
  return [
   check('email','the email is valid').notEmpty(),
 ]
}

const validate_unique_slug = async (req,res,next)=>{
 
  let slug;
  if(req.body.title){
     slug = slugify(req.body.title)
    req.body.slug = slug
  }

  let prod = await Product.findOne({slug})
  if(prod){
   return res.status(500).json({
      "msg":"the slug is unique"
    })
  }
  next()
}

const validate_unique_slug_update = async (req,res,next)=>{

  let slug;
  if(req.body.title){
     slug = slugify(req.body.title)
    req.body.slug = slug
  }else{
     slug =  req.body.slug 

  }
  let prod = await Product.findOne({slug})
  let {id} = req.params
  if(prod && prod.id !== id ){
   return res.status(500).json({
      "msg":"the slug is unique"
    })
  }
  next()
}



const validate_blog = ()=>{
  return [
   check('title','the title is valid').notEmpty(),
   check('description','the description is valid').notEmpty(),
   check('category','the category is valid').notEmpty(),

 ]
}

const validate_category = ()=>{
  return [
   check('title','the title is valid').notEmpty(),

 ]
}


const validate_unique_title_cat_update = async (req,res,next)=>{
 
 let {title} = req.body

  let cat = await Category.findOne({title})
  let {id} = req.params
  if(cat && cat.id !== id ){
   return res.status(500).json({
      "msg":"the cat is unique"
    })
  }
  next()
}


const validate_unique_title_cat = async (req,res,next)=>{
 
  let {title} = req.body
 
   let cat = await Category.findOne({title})
   if(cat){
    return res.status(500).json({
       "msg":"the cat is unique"
     })
   }
   next()
 }


 const validate_unique_title_Blogcat_update = async (req,res,next)=>{
 
  let {title} = req.body
 
   let Blogcat = await Blogcat.findOne({title})
   let {id} = req.params
   if(Blogcat && Blogcat.id !== id ){
    return res.status(500).json({
       "msg":"the blog category is unique"
     })
   }
   next()
 }
 
 
 const validate_unique_title_Blogcat = async (req,res,next)=>{
  
   let {title} = req.body
  
    let blogCat = await BlogCat.findOne({title})
    if(blogCat){
     return res.status(500).json({
        "msg":"the blog category is unique"
      })
    }
    next()
  }

  const validate_unique_title_Brand_update = async (req,res,next)=>{
 
    let {title} = req.body
   
     let Brands = await Brand.findOne({title})
     let {id} = req.params
     if(Brands && Brands.id !== id ){
      return res.status(500).json({
         "msg":"the Brand is unique"
       })
     }
     next()
   }
   
   
   const validate_unique_title_Brand = async (req,res,next)=>{
    
     let {title} = req.body
    
      let Brands = await Brand.findOne({title})
      if(Brands){
       return res.status(500).json({
          "msg":"the brand is unique"
        })
      }
      next()
    }
 
    const validate_check_user_exist = async (req,res,next)=>{
    
      let {email} = req.body
     
       let user = await User.findOne({email})
       if(!user){
        return res.status(500).json({
           "msg":"the user is not exist"
         })
       }
       next()
     }

     const validate_check_coupon_exist = async (req,res,next)=>{
    
      let {name} = req.body
     
       let coupon = await Coupon.findOne({name})
       if(coupon){
        return res.status(500).json({
           "msg":"the coupon is exist please enter unique name"
         })
       }
       next()
     }

     const validate_check_coupon_exist_update = async (req,res,next)=>{
 
      let {name} = req.body
     
       let coupon = await Coupon.findOne({name})
       let {id} = req.params
       if(coupon && coupon.id?.toString() !== id ){
   
        return res.status(500).json({
           "msg":"the Coupon is exist please enter unique name"
         })
       }
       next()
     }
     
  
module.exports={
  validate_update_user,
  validate_create_prod,
  validate_unique_slug,
  validate_unique_slug_update,
  validate_forget_pass,
  validate_blog,
  validate_category,
  validate_unique_title_cat_update,
  validate_unique_title_cat,
  validate_unique_title_Blogcat_update,
  validate_unique_title_Blogcat,
  validate_unique_title_Brand_update,
  validate_unique_title_Brand,
  validate_check_user_exist,
  validate_check_coupon_exist,
  validate_check_coupon_exist_update
}

