const express=require("express");
const router=express.Router();

const userController=require("./../Controllers/UserController");
const validationData = require("./../Core/Validations/User")
const AuthenticationMW = require("./../Middlewares/authenticationMW")

router.route("/users")
      .get(AuthenticationMW.auth,userController.getallUsers) 
      .post(AuthenticationMW.auth,validationData.UserValidPOST,userController.addUser) 

router.route("/user/:_id")
      .get(AuthenticationMW.auth,userController.getUser) 
      .patch(AuthenticationMW.auth,validationData.UserValidPATCH,userController.editUser) 
      .delete(AuthenticationMW.auth,userController.delUser) 

module.exports=router;