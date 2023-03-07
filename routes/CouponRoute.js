const express = require("express");
const { createCoupon, getAllCoupons, update_coupon, delete_coupon } = require("../controller/CouponController");
const { IsAdmin, AuthMiddleware } = require("../middlewares/Auth");
const { validate_check_coupon_exist, validate_check_coupon_exist_update } = require("../middlewares/Validate");
const router = express.Router();


router.post("/create",AuthMiddleware,IsAdmin,validate_check_coupon_exist,createCoupon)
router.get("/all",AuthMiddleware,IsAdmin,getAllCoupons)
router.put("/update/:id",AuthMiddleware,IsAdmin,validate_check_coupon_exist_update,update_coupon)
router.delete("/delete/:id",AuthMiddleware,IsAdmin,delete_coupon)


module.exports = router