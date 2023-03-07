const express = require("express");
const { createProduct, get_product, get_all_products, updateProduct, deleteProduct, addToWishlist, rating, uploadImg } = require("../controller/ProductController");
const { IsAdmin, AuthMiddleware } = require("../middlewares/Auth");
const { uploadPhoto, prodImgResize } = require("../middlewares/uploadImg");
const { validate_create_prod, validate_unique_slug, validate_unique_slug_update } = require("../middlewares/Validate");
const router = express.Router();


router.post("/create",AuthMiddleware,IsAdmin,validate_create_prod(),validate_unique_slug,createProduct)
router.get("/single-prod/:id",get_product)
router.get("/all",get_all_products)



router.put("/update-prod/:id",AuthMiddleware,IsAdmin,validate_create_prod(),validate_unique_slug_update,updateProduct)
router.delete("/delete/:id",AuthMiddleware,IsAdmin,deleteProduct)

router.put("/addToWishlist",AuthMiddleware,addToWishlist)
router.put("/rating",AuthMiddleware,rating)
router.put("/upload/:id",AuthMiddleware,IsAdmin,uploadPhoto.array('images',10),prodImgResize,uploadImg)


module.exports = router