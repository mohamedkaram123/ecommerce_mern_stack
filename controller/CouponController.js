const Coupon = require("../models/Coupon")
const asyncHandller = require("express-async-handler");
const { validationResult } = require("express-validator");
const validateMongoDbId = require("../utils/validateMongoDb");

const createCoupon = asyncHandller(async (req,res)=>{
   try {
            const newCoupon = await Coupon.create(req.body)
            res.json(newCoupon)
     } catch (error) {
       throw new Error(error)
      }
})

const getAllCoupons = asyncHandller(async (req,res)=>{
        
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
         let query_coupon =  Coupon.find(query_parse)
   
         if(req.query.sort){
           let sort = req.query.sort.split(",").join(" ");
           query_coupon.sort(sort)
         }
   
         if(req.query.fields){
           let fields = req.query.fields.split(",").join(" ");
           query_coupon.select(fields)
         }else{
          query_coupon.select("-__v")
   
         }
   
         let page = req.query.page
         let limit = req.query.limit
         let skip = (page - 1) * limit
         query_coupon =  query_coupon.skip(skip).limit(limit)
   
         if(req.query.page){
           let couponCountDoc = await Coupon.countDocuments()
   
           if(skip >= couponCountDoc) throw new Error("This Page does not exists")
         }
         
   
       let  coupons = await query_coupon
       res.json(coupons)
   
     } catch (error) {
       throw new Error(error)
      }
})

const update_coupon = asyncHandller(async (req, res, next) => {


   try {
       let {id} = req.params
       validateMongoDbId(id)

       let coupon = await Coupon.findByIdAndUpdate(id,req.body,{new:true})
       res.json({
       msg: "success",
       data: coupon
       })
   } catch (error) {
       next(error)
   }
})
  
const delete_coupon = asyncHandller(async (req,res)=>{
  try {
     let {id} = req.params
     validateMongoDbId(id)

     let coupon = await Coupon.findByIdAndDelete(id)
     res.json({
       msg:"success",
       data:coupon
     })
    } catch (error) {
      throw new Error(error)
     }
})

module.exports = {
  createCoupon,
  getAllCoupons,
  update_coupon,
  delete_coupon
}