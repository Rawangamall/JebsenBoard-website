const express=require("express");
const router=express.Router();

const userController=require("./../Controllers/UserController");
const validationData = require("./../Core/Validations/User")
const AuthenticationMW = require("./../Middlewares/authenticationMW")

router.route("/users")
       .post(AuthenticationMW.auth,validationData.UserValidPOST,userController.addUser) 

module.exports=router;