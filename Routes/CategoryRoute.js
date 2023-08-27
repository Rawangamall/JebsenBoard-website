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
        .post(auth,authorize("ادمن","موظف") ,categoryImageUpload ,CategoryValidPOST,validationMW ,CategoryController.addCategory)

router.route("/category/:id")
        .get(CategoryController.getCategory)
        .patch(auth,authorize("ادمن") , categoryImageUpload ,CategoryValidPUT,validationMW, CategoryController.updateCategory)
        .delete(auth,authorize("ادمن") ,removeCategoryIMG, CategoryController.deleteCategory)

router.route("/dashboard/category/:id/")
        .get(auth,authorize("ادمن","موظف"),CategoryController.getCategory)


module.exports=router;