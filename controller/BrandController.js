const Brand = require("../models/Brand")
const asyncHandller = require("express-async-handler");
const { validationResult } = require("express-validator");
const validateMongoDbId = require("../utils/validateMongoDb");

const create_brand = asyncHandller(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      let cat = await Brand.create(req.body)
      res.json({
        msg: "success",
        data: cat
      })
    } catch (error) {
      next(error)
    }
  })
  
const update_brand = asyncHandller(async (req, res, next) => {
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let {id} = req.params
        validateMongoDbId(id)

        let cat = await Brand.findByIdAndUpdate(id,req.body,{new:true})
        res.json({
        msg: "success",
        data: cat
        })
    } catch (error) {
        next(error)
    }
})
  
const get_brand = asyncHandller(async (req, res, next) => {
 
     try {
         let {id} = req.params
         validateMongoDbId(id)

         let cat = await Brand.findById(id)
        

         res.json({
         msg: "success",
         data: cat
         })
     } catch (error) {
         next(error)
     }
 })


 const get_all_brands = asyncHandller(async (req,res)=>{

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
       let query_cat =  Brand.find(query_parse)
 
       if(req.query.sort){
         let sort = req.query.sort.split(",").join(" ");
         query_cat.sort(sort)
       }
 
       if(req.query.fields){
         let fields = req.query.fields.split(",").join(" ");
         query_cat.select(fields)
       }else{
        query_cat.select("-__v")
 
       }
 
       let page = req.query.page
       let limit = req.query.limit
       let skip = (page - 1) * limit
       query_cat =  query_cat.skip(skip).limit(limit)
 
       if(req.query.page){
         let BrandCountDoc = await Brand.countDocuments()
 
         if(skip >= BrandCountDoc) throw new Error("This Page does not exists")
       }
       
 
     let  Brands = await query_cat
     res.json(Brands)
 
      } catch (error) {
        throw new Error(error)
       }
 })

const delete_brand = asyncHandller(async (req,res)=>{
   try {
      let {id} = req.params
      validateMongoDbId(id)

      let cat = await Brand.findByIdAndDelete(id)
      res.json({
        msg:"success",
        data:cat
      })
     } catch (error) {
       throw new Error(error)
      }
})

  


module.exports = {
  create_brand,
  update_brand,
  delete_brand,
  get_brand,
  get_all_brands,
    // delete_Brand,
}