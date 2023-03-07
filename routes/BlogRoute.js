const express = require("express");
const { create_blog, update_blog, get_blog, get_all_blogs, delete_blog, likeBlog, disLikeBlog, uploadImg } = require("../controller/BlogController");
const { IsAdmin, AuthMiddleware } = require("../middlewares/Auth");
const { uploadPhoto, prodImgResize } = require("../middlewares/uploadImg");
const { validate_blog } = require("../middlewares/Validate");
const router = express.Router();

router.post("/create",AuthMiddleware,IsAdmin,validate_blog(),create_blog)
router.put("/update/:id",AuthMiddleware,IsAdmin,update_blog)
router.get("/single-blog/:id",get_blog)
router.get("/blogs",get_all_blogs)
router.delete("/:id",AuthMiddleware,IsAdmin,delete_blog)
router.put("/likes",AuthMiddleware,likeBlog)
router.put("/dislikes",AuthMiddleware,disLikeBlog)

router.put("/upload/:id",AuthMiddleware,IsAdmin,uploadPhoto.array('images',2),prodImgResize,uploadImg)



module.exports = router