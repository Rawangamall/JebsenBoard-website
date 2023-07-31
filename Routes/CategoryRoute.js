const express=require("express");
const router=express.Router();

const CategoryController=require("./../Controllers/CategoryController");
const validationData = require("./../Core/Validations/Category")
const AuthenticationMW = require("./../Middlewares/authenticationMW")
// const AuthorizationMW = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")
const imageValidation = require("./../Core/Validations/imageValidations")



router.route("/category")
        .get(CategoryController.getAll)
       .post(AuthenticationMW.auth,validationMW,imageValidation.addIMG ,CategoryController.addCategory)// validationData.CategoryValidPOST

router.route("/category/:id")
        .get(CategoryController.getCategory)
        .patch(AuthenticationMW.auth,validationMW, CategoryController.updateCategory)
        .delete(AuthenticationMW.auth,validationMW ,imageValidation.removeCategoryIMG,CategoryController.deleteCategory)


module.exports=router;