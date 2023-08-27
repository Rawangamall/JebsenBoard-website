const express=require("express");
const router=express.Router();
const multer = require('multer');
const upload = multer();

const userController=require("./../Controllers/UserController");
const validationData = require("./../Core/Validations/User")
const imageData = require("./../Core/Validations/imageValidations")
const validationMW = require("./../Core/Validations/validateMW")

 const AuthenticationMW = require("./../Middlewares/authenticationMW")
// const AuthorizationMW = require("./../Middlewares/authorizationMW")

router.route("/users")
      .get(AuthenticationMW.auth,userController.getAllUsers) //AuthenticationMW.auth,
      .post(AuthenticationMW.auth,upload.none(),validationData.UserValidPOST,validationMW,userController.addUser) //AuthenticationMW.auth,AuthorizationMW.authorize("admin"),

router.route("/user/:_id")
      .get(AuthenticationMW.auth,userController.getUser)  
      .patch(AuthenticationMW.auth,validationData.UserValidPATCH,validationMW,imageData.addIMG,userController.editUser) //AuthorizationMW.authorize("admin"),
      .delete(AuthenticationMW.auth,imageData.removeUserIMG,userController.delUser) //AuthorizationMW.authorize("admin"),

module.exports=router;