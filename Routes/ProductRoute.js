const express=require("express");
const router=express.Router();

const ProductController=require("./../Controllers/ProductController");
const {ProductValidPOST , ProductValidPatch} = require("./../Core/Validations/Product")
const {auth} = require("./../Middlewares/authenticationMW")
const {authorize} = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")

const {removeProductIMG ,productImageUpload} = require("./../Core/Validations/imageValidations")

router.route("/products")
        .get(ProductController.getAll)
       .post(auth,authorize("ادمن","موظف"),productImageUpload,ProductValidPOST,validationMW ,ProductController.addProduct)

router.route("/product/category")
      .get(ProductController.getProductsCategory)

router.route("/product/search")
      .get(ProductController.searchProducts)

router.route("/product/:id")
      .get( ProductController.getProduct)
      .patch(auth,authorize("ادمن","موظف"),productImageUpload ,ProductValidPatch, validationMW, ProductController.updateProduct)
      .delete(auth,authorize("ادمن"),validationMW ,removeProductIMG,ProductController.deleteProduct)

router.route("/dashboard/product/:id")
      .get(auth ,authorize("ادمن","موظف"),ProductController.getProduct)

router.route("/dashboard/products")
      .get(auth ,authorize("ادمن","موظف"),ProductController.getAll)
module.exports=router;