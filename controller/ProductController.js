const Product = require("../models/Product")
const asyncHandller = require("express-async-handler");
const { validationResult } = require("express-validator");

const createProduct = asyncHandller(async (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

   try {
      const product = await  Product.create(req.body);
       res.json({product})
     } catch (error) {
       throw new Error(error)
      }
})

const updateProduct = asyncHandller(async (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

   try {
    let {id} = req.params
      const product = await  Product.findOneAndUpdate({id},req.body,{new:true});
       res.json({product})
     } catch (error) {
       throw new Error(error)
      }
})

const deleteProduct = asyncHandller(async (req,res)=>{

   try {
    let {id} = req.params
      const product = await  Product.findByIdAndDelete(id);
       res.json({product})
     } catch (error) {
       throw new Error(error)
      }
})


const get_product = asyncHandller(async (req,res)=>{

  const {id} = req.params
   try {
    let prod = await Product.findById(id)
    res.json(prod)

     } catch (error) {
       throw new Error(error)
      }
})

const get_all_products = asyncHandller(async (req,res)=>{

   try {
   const query = {...req.query};
   const exludeFields = ['page','sort','limit','fields']
   const _query = {}
  
      for (const [key, value] of Object.entries(query)) {
        if(!exludeFields.includes(key)){
            _query[key] = value
        }
      }

      let query_str= JSON.stringify(_query)
      query_str = query_str.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`)
      query_parse = JSON.parse(query_str)
      let query_prod =  Product.find(query_parse)

      if(req.query.sort){
        let sort = req.query.sort.split(",").join(" ");
        query_prod.sort(sort)
      }

      if(req.query.fields){
        let fields = req.query.fields.split(",").join(" ");
        query_prod.select(fields)
      }else{
        query_prod.select("-__v")

      }

      let page = req.query.page
      let limit = req.query.limit
      let skip = (page - 1) * limit
      query_prod =  query_prod.skip(skip).limit(limit)

      if(req.query.page){
        let prodCountDoc = await Product.countDocuments()

        if(skip >= prodCountDoc) throw new Error("This Page does not exists")
      }
      

    let  Products = await query_prod
    res.json(Products)

     } catch (error) {
       throw new Error(error)
      }
})

module.exports = {
  createProduct,
  get_product,
  get_all_products,
  updateProduct,
  deleteProduct
}