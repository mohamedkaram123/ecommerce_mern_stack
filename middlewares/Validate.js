
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');
const slugify = require("slugify")

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

module.exports={
  validate_update_user,
  validate_create_prod,
  validate_unique_slug,
  validate_unique_slug_update,
  validate_forget_pass
}

