const Blog = require("../models/Blog")
const User = require("../models/User")
const asyncHandller = require("express-async-handler");
const { validationResult } = require("express-validator");
const validateMongoDbId = require("../utils/validateMongoDb");
const { cloudUploadImg } = require("../config/cloudDinary");
var fs = require('fs');

const create_blog = asyncHandller(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      let blog = await Blog.create(req.body)
      res.json({
        msg: "success",
        data: blog
      })
    } catch (error) {
      next(error)
    }
  })
  
const update_blog = asyncHandller(async (req, res, next) => {
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let {id} = req.params
        validateMongoDbId(id)

        let blog = await Blog.findByIdAndUpdate(id,req.body,{new:true})
        res.json({
        msg: "success",
        data: blog
        })
    } catch (error) {
        next(error)
    }
})
  
const get_blog = asyncHandller(async (req, res, next) => {
 
     try {
         let {id} = req.params
         validateMongoDbId(id)

         //let blog = await Blog.findById(id)
         let blog = await Blog.findByIdAndUpdate(id,{
            $inc:{numViews:1}
         },{new:true,populate:["likes","dislikes"]})

         res.json({
         msg: "success",
         data: blog
         })
     } catch (error) {
         next(error)
     }
 })


 const get_all_blogs = asyncHandller(async (req,res)=>{

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
       let query_blog =  Blog.find(query_parse)
 
       if(req.query.sort){
         let sort = req.query.sort.split(",").join(" ");
         query_blog.sort(sort)
       }
 
       if(req.query.fields){
         let fields = req.query.fields.split(",").join(" ");
         query_blog.select(fields)
       }else{
        query_blog.select("-__v")
 
       }
 
       let page = req.query.page
       let limit = req.query.limit
       let skip = (page - 1) * limit
       query_blog =  query_blog.skip(skip).limit(limit)
 
       if(req.query.page){
         let blogCountDoc = await Blog.countDocuments()
 
         if(skip >= blogCountDoc) throw new Error("This Page does not exists")
       }
       
 
     let  blogs = await query_blog
     res.json(blogs)
 
      } catch (error) {
        throw new Error(error)
       }
 })

const delete_blog = asyncHandller(async (req,res)=>{
   try {
      let {id} = req.params
      validateMongoDbId(id)

      let blog = await Blog.findByIdAndDelete(id)
      res.json({
        msg:"success",
        data:blog
      })
     } catch (error) {
       throw new Error(error)
      }
})

const likeBlog = asyncHandller(async (req,res)=>{
   try {
        let {blogId} = req.body
        validateMongoDbId(blogId)
         let blog = await Blog.findById(blogId)
         let user_id = req.user._id
         let isLiked = blog?.isLiked
         let aleardyDisLike =  blog.dislikes.find(
            (userId) => userId?.toString() === user_id?.toString()
         );
        
         if(aleardyDisLike){
            
           let  blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{dislikes:user_id},
                isDisliked:false
             },{new:true})
             
             res.json({
                msg:"success",
                data:blog
              })
         }

         if(isLiked){
          
          let  blog = await Blog.findByIdAndUpdate(blogId,{
               $pull:{likes:user_id},
               isLiked:false
            },{new:true})

            res.json({
                msg:"success",
                data:blog
              })
        }else{
            
          let  blog = await Blog.findByIdAndUpdate(blogId,{
                $push:{likes:user_id},
                isLiked:true
             },{new:true})

             res.json({
                msg:"success",
                data:blog
              })
        }
      
     } catch (error) {
       throw new Error(error)
      }
})
  

const disLikeBlog = asyncHandller(async (req,res)=>{
    try {
         let {blogId} = req.body
         validateMongoDbId(blogId)
          let blog = await Blog.findById(blogId)
          let user_id = req.user._id
          let isDisliked = blog?.isDisliked
          let aleardyLikes =  blog.likes.find(
             (userId) => userId?.toString() === user_id?.toString()
          );
         
          if(aleardyLikes){
             
            let  blog = await Blog.findByIdAndUpdate(blogId,{
                 $pull:{likes:user_id},
                 isLiked:false
              },{new:true})
              
              res.json({
                 msg:"success",
                 data:blog
               })
          }
 
          if(isDisliked){
           
           let  blog = await Blog.findByIdAndUpdate(blogId,{
                $pull:{dislikes:user_id},
                isDisliked:false
             },{new:true})
 
             res.json({
                 msg:"success",
                 data:blog
               })
         }else{
             
           let  blog = await Blog.findByIdAndUpdate(blogId,{
                 $push:{dislikes:user_id},
                 isDisliked:true
              },{new:true})
 
              res.json({
                 msg:"success",
                 data:blog
               })
         }
       
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
           let {path} = file
           let newPath = await uploader(path)
           urls = [...urls,newPath]
           fs.unlinkSync(path);

         }
        
         let prod = await Blog.findByIdAndUpdate(id,{
           images:urls
         },{
           new:true
         })
        
         res.json({
           mag:"done",
           data:prod,
         })
    } catch (error) {
      throw new Error(error)
     }
})
module.exports = {
    create_blog,
    update_blog,
    get_blog,
    get_all_blogs,
    delete_blog,
    likeBlog,
    disLikeBlog,
    uploadImg
}