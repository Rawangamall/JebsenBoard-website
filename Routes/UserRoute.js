const express=require("express");
const router=express.Router();

const userController=require("./../Controllers/UserController");
const validationData = require("./../Core/Validations/User")
const AuthenticationMW = require("./../Middlewares/authenticationMW")
const AuthorizationMW = require("./../Middlewares/authorizationMW")

router.route("/users")
      .get(AuthenticationMW.auth,userController.getallUsers) 
      .post(AuthenticationMW.auth,AuthorizationMW.authorize("admin"),validationData.UserValidPOST,userController.addUser) 

router.route("/user/:_id")
      .get(AuthenticationMW.auth,AuthorizationMW.authorize("admin"),userController.getUser) 
      .patch(AuthenticationMW.auth,AuthorizationMW.authorize("admin"),validationData.UserValidPATCH,userController.editUser) 
      .delete(AuthenticationMW.auth,AuthorizationMW.authorize("admin"),userController.delUser) 

module.exports=router;