const express = require("express");
const { create_category, update_category, delete_category, get_category, get_all_categories } = require("../controller/CategoryController");
const { IsAdmin, AuthMiddleware } = require("../middlewares/Auth");
const { validate_category, validate_unique_title_cat, validate_unique_title_cat_update } = require("../middlewares/Validate");
const router = express.Router();

router.post("/create",AuthMiddleware,IsAdmin,validate_category(),validate_unique_title_cat,create_category)
 router.put("/update/:id",AuthMiddleware,IsAdmin,validate_category(),validate_unique_title_cat_update,update_category)
 router.get("/single-cat/:id",get_category)
 router.get("/categories",get_all_categories)
router.delete("/:id",AuthMiddleware,IsAdmin,delete_category)
// router.put("/likes",AuthMiddleware,likeBlog)
// router.put("/dislikes",AuthMiddleware,disLikeBlog)




module.exports = router