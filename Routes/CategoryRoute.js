const express=require("express");
const router=express.Router();

const CategoryController=require("./../Controllers/CategoryController");
const {CategoryValidPOST,CategoryValidPUT} = require("./../Core/Validations/Category")
const AuthenticationMW = require("./../Middlewares/authenticationMW")
// const AuthorizationMW = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")
const {removeCategoryIMG ,categoryImageUpload} = require("./../Core/Validations/imageValidations")



router.route("/category")
        .get(CategoryController.getAll)
        .post( CategoryValidPOST ,categoryImageUpload ,validationMW ,CategoryController.addCategory)//AuthenticationMW.auth,

router.route("/category/:id")
        .get(CategoryController.getCategory)
        .patch(CategoryValidPUT, categoryImageUpload,validationMW, CategoryController.updateCategory)//AuthenticationMW.auth,
        .delete(removeCategoryIMG, CategoryController.deleteCategory)//AuthenticationMW.auth,validationMW ,


module.exports=router;