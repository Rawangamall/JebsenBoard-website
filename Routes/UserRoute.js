const express=require("express");
const router=express.Router();

const userController=require("./../Controllers/UserController");
const validationData = require("./../Core/Validations/User")
const imageData = require("./../Core/Validations/imageValidations")

// const AuthenticationMW = require("./../Middlewares/authenticationMW")
// const AuthorizationMW = require("./../Middlewares/authorizationMW")

router.route("/users")
      .get(userController.getAllUsers) //AuthenticationMW.auth,
      .post(validationData.UserValidPOST,userController.addUser) //AuthenticationMW.auth,AuthorizationMW.authorize("admin"),

router.route("/user/:_id")
      .get(userController.getUser)  //AuthenticationMW.auth,AuthorizationMW.authorize("admin"),
      .patch(validationData.UserValidPATCH,imageData.addIMG,userController.editUser) //AuthenticationMW.auth,AuthorizationMW.authorize("admin"),
      .delete(userController.delUser) //AuthenticationMW.auth,AuthorizationMW.authorize("admin"),

module.exports=router;