const express = require("express");
const { createUser,loginUser,get_all_users, get_user, delete_user, update_user, test_login, block_user, unblock_user, handleRefreshToken, logout, update_password, test_send_mail, forget_pass, reset_password, reset_password_update } = require("../controller/UserController");
const { AuthMiddleware, IsAdmin } = require("../middlewares/Auth");
const { validate_update_user, validate_forget_pass } = require("../middlewares/Validate");
const router = express.Router();

router.post("/register",createUser)
router.post("/login",loginUser)
router.get("/users",AuthMiddleware,IsAdmin,get_all_users)
router.get("/single-user/:id",AuthMiddleware,IsAdmin,get_user)
router.delete("/delete-user/:id",AuthMiddleware,IsAdmin,delete_user)
router.put("/update",AuthMiddleware,validate_update_user(),update_user)
router.put("/block/:id",AuthMiddleware,IsAdmin,block_user)
router.put("/unblock/:id",AuthMiddleware,IsAdmin,unblock_user)
router.get("/refresh",handleRefreshToken)
router.get("/logout",logout)
router.put("/password",AuthMiddleware,update_password)

router.post("/forget_pass",validate_forget_pass(),forget_pass)
router.get("/reset-password/:token",reset_password)
router.put("/reset-password",reset_password_update)

router.get("/test_send_mail",test_send_mail)


module.exports = router