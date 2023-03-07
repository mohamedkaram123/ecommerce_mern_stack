const express = require("express");
const { create_blogCat, update_blogCat, delete_blogCat, get_blogCat, get_all_categories } = require("../controller/BlogCatController");
const { IsAdmin, AuthMiddleware } = require("../middlewares/Auth");
const { validate_unique_title_cat, validate_unique_title_cat_update, validate_category, validate_unique_title_Blogcat_update, validate_unique_title_Blogcat } = require("../middlewares/Validate");
const router = express.Router();

router.post("/create",AuthMiddleware,IsAdmin,validate_category(),validate_unique_title_Blogcat,create_blogCat)
 router.put("/update/:id",AuthMiddleware,IsAdmin,validate_category(),validate_unique_title_Blogcat_update,update_blogCat)
 router.get("/single-cat/:id",get_blogCat)
 router.get("/Blogcats",get_all_categories)
router.delete("/:id",AuthMiddleware,IsAdmin,delete_blogCat)
// router.put("/likes",AuthMiddleware,likeBlog)
// router.put("/dislikes",AuthMiddleware,disLikeBlog)




module.exports = router