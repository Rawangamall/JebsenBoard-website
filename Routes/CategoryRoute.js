const express=require("express");
const router=express.Router();

const CategoryController=require("./../Controllers/CategoryController");
const {CategoryValidPOST} = require("./../Core/Validations/Category")
const AuthenticationMW = require("./../Middlewares/authenticationMW")
// const AuthorizationMW = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")
const {addIMG,removeCategoryIMG ,categoryImageUpload} = require("./../Core/Validations/imageValidations")



router.route("/category")
        .get(CategoryController.getAll)
       .post(CategoryController.addCategory)//AuthenticationMW.auth, validationData.CategoryValidPOST validationMW,categoryImageUpload ,

router.route("/category/:id")
        .get(CategoryController.getCategory)
//         .patch(AuthenticationMW.auth,validationMW,categoryImageUpload, CategoryController.updateCategory)
//         .delete(AuthenticationMW.auth,validationMW ,removeCategoryIMG,CategoryController.deleteCategory)


module.exports=router;