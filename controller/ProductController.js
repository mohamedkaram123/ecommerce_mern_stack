const Product = require("../models/Product")
const asyncHandller = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const validateMongoDbId = require("../utils/validateMongoDb");
const { cloudUploadImg } = require("../config/cloudDinary");
var fs = require('fs');

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


const addToWishlist = asyncHandller(async (req,res)=>{
   try {
        const {_id} = req.user
        const {prodId} = req.body
        validateMongoDbId(prodId)

        let user = await User.findById(_id);
        const prod = await Product.findById(prodId);
        const checkAddWishlist =  user.wishlist.find((prod_id)=>{
          return prod_id?.toString() === prodId
        })
     
        
        if(checkAddWishlist){
            user = await User.findByIdAndUpdate(_id,{
            $pull:{wishlist:prodId}
           },{new:true})
     
        }else{
           user = await User.findByIdAndUpdate(_id,{
            $push:{wishlist:prodId}
           },{new:true})
        }

        res.json({
          msg:"success",
          data:user
        })
     } catch (error) {
       throw new Error(error)
      }
})

const rating = asyncHandller(async (req,res)=>{
   try {
       const {id} = req.user
       const {star,prodId,comment} = req.body
       let prod = await Product.findById(prodId)
      
       let aleardyRate = prod.ratings.find((userId)=>userId.posted_by?.toString() === id)
       if(aleardyRate){
    
        prod = await Product.updateOne({ratings:{$elemMatch:aleardyRate}},{
          $set:{"ratings.$[elem].star":star,"ratings.$[elem].comment":comment}
          // $ projection operator when array index position is unknown
          // [or]
          // $ positional operator for update operations,
          // set examples https://www.mongodb.com/docs/manual/reference/operator/update/set/
        },{
          arrayFilters: [
            {
              "elem.posted_by": id
            }
          ]
          // this code make filter on ratings on $set
          // filter examples https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/#mongodb-update-up.---identifier--

          ,
          new:true
        })
       }else{
        prod = await Product.findByIdAndUpdate(prodId,{
          $push:{
            ratings:{
              star,
              comment,
              posted_by:id
            }
          }
        })
       }

       let getAllRatings = await Product.findById(prodId);
       let totalRatings = getAllRatings.ratings.length;
       let ratingsStarArr = getAllRatings.ratings.map(item=>item.star)
       let ratingSum = ratingsStarArr.reduce((prev,current)=>prev + current,0);
       let actualRating = Math.round(ratingSum / totalRatings)
       let finalProduct = await Product.findByIdAndUpdate(prodId,{
        total_rating:actualRating
       },{
        new:true
       })
       res.json({
        msg:"success is updated",
        data:finalProduct
       })
     } catch (error) {
       throw new Error(error)
      }
})

const uploadImg = asyncHandller(async (req,res)=>{
  
   try {
         let {id} = req.params
         validateMongoDbId(id)

          const uploader = (path)=> cloudUploadImg(path,'image')
          let urls = []
          let files = req.files
  
          for (const file of files) {
            let {path,main_file} = file
          
            let newPath = await uploader(path)
            urls = [...urls,{...newPath,main_file}]
            fs.unlinkSync(path);

          }
         
          let prod = await Product.findByIdAndUpdate(id,{
            images:urls
          },{
            new:true
          })
         
          res.json({
            mag:"done",
            data:prod
          })
     } catch (error) {
       throw new Error(error)
      }
})

module.exports = {
  createProduct,
  get_product,
  get_all_products,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImg
}