const express=require("express");
const router=express.Router();
const multer = require('multer');
const upload = multer();

const userController=require("./../Controllers/UserController");
const validationData = require("./../Core/Validations/User")
const imageData = require("./../Core/Validations/imageValidations")
const validationMW = require("./../Core/Validations/validateMW")

 const {auth} = require("./../Middlewares/authenticationMW")
const {authorize} = require("./../Middlewares/authorizationMW")

router.route("/users")
      .get(auth,authorize("ادمن"),userController.getAllUsers) //AuthenticationMW.auth,
      .post(auth,authorize("ادمن"),upload.none(),validationData.UserValidPOST,validationMW,userController.addUser) //AuthenticationMW.auth,AuthorizationMW.authorize("admin"),

router.route("/user/:_id")
      .get(auth,authorize("ادمن","موظف"),userController.getUser)  
      .patch(auth,authorize("ادمن","موظف"),validationData.UserValidPATCH,validationMW,imageData.addIMG,userController.editUser) //AuthorizationMW.authorize("admin"),
      .delete(auth,authorize("ادمن"),imageData.removeUserIMG,userController.delUser) //AuthorizationMW.authorize("admin"),

module.exports=router;