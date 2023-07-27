const express=require("express");
const router=express.Router();

const CategoryController=require("./../Controllers/CategoryController");
const validationData = require("./../Core/Validations/Category")
const AuthenticationMW = require("./../Middlewares/authenticationMW")
// const AuthorizationMW = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")


router.route("/categories")
        .get(CategoryController.getAll)
       .post(AuthenticationMW.auth,validationData.CategoryValidPOST,validationMW ,CategoryController.addCategory) 

router.route("/categories/:id")
        .get(CategoryController.getCategory)
        .patch(AuthenticationMW.auth,validationMW, CategoryController.updateCategory)
        .delete(AuthenticationMW.auth,validationMW ,CategoryController.deleteCategory)


module.exports=router;