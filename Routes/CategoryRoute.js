const express=require("express");
const router=express.Router();

const CategoryController=require("./../Controllers/CategoryController");
const {CategoryValidPOST,CategoryValidPUT} = require("./../Core/Validations/Category")
const {auth} = require("./../Middlewares/authenticationMW")
const {authorize} = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")
const {removeCategoryIMG ,categoryImageUpload} = require("./../Core/Validations/imageValidations")



router.route("/category")
        .get(CategoryController.getAll)
        .post(auth,authorize("ادمن"), categoryImageUpload,(req, res, next) => {
                console.log(req.body , "body");
                next(); 
              }, CategoryValidPOST ,validationMW ,CategoryController.addCategory)

router.route("/category/:id")
        .get(CategoryController.getCategory)
        .patch(CategoryValidPUT,validationMW,categoryImageUpload, CategoryController.updateCategory)//AuthenticationMW.auth,
        .delete(removeCategoryIMG, CategoryController.deleteCategory)//AuthenticationMW.auth,validationMW ,


module.exports=router;