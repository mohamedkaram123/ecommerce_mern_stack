const express = require("express");
const { create_brand, update_brand, delete_brand, get_brand, get_all_categories, get_all_brands } = require("../controller/BrandController");
const { IsAdmin, AuthMiddleware } = require("../middlewares/Auth");
const { validate_category,validate_unique_title_Brand, validate_unique_title_Brand_update } = require("../middlewares/Validate");
const router = express.Router();

router.post("/create",AuthMiddleware,IsAdmin,validate_category(),validate_unique_title_Brand,create_brand)
 router.put("/update/:id",AuthMiddleware,IsAdmin,validate_category(),validate_unique_title_Brand_update,update_brand)
 router.get("/single-cat/:id",get_brand)
 router.get("/brands",get_all_brands)
router.delete("/:id",AuthMiddleware,IsAdmin,delete_brand)
// router.put("/likes",AuthMiddleware,likeBlog)
// router.put("/dislikes",AuthMiddleware,disLikeBlog)




module.exports = router