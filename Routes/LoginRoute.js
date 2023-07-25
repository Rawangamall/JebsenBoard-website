const express=require("express");
const router=express.Router();
const loginController=require("../Controllers/LoginController");
  
router.route("/login")
      .post(loginController.login);

router.route("/forgetpassword")
       .post(loginController.forgetpassword);

router.route("/resetpassword/:code")
      .patch(loginController.resetpassword);

   
module.exports=router;