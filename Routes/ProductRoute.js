const express=require("express");
const router=express.Router();

const ProductController=require("./../Controllers/ProductController");
const {ProductValidPOST , ProductValidPatch} = require("./../Core/Validations/Product")
const {auth} = require("./../Middlewares/authenticationMW")
const {authorize} = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")

const {removeProductIMG ,productImageUpload} = require("./../Core/Validations/imageValidations")

router.route("/products")
        .get(ProductController.getAll)//AuthenticationMW.auth ,AuthorizationMW.authorize("admin") ,validationMW
       .post(auth,authorize("ادمن","موظف"),productImageUpload,ProductValidPOST,validationMW ,ProductController.addProduct)//validationData.ProductValidPOST,
//AuthenticationMW.auth,AuthorizationMW.authorize("admin"),
router.route("/product/category")
      .get(ProductController.getProductsCategory)

router.route("/product/search")
      .get(ProductController.searchProducts)

router.route("/product/:id")
      .get(ProductController.getProduct)//AuthenticationMW.auth ,AuthorizationMW.authorize("admin"),
      .patch(auth,authorize("ادمن","موظف"),productImageUpload ,ProductValidPatch, validationMW, ProductController.updateProduct)//AuthenticationMW.auth ,AuthorizationMW.authorize("admin"),
      .delete(validationMW ,removeProductIMG,ProductController.deleteProduct)//AuthenticationMW.auth,AuthorizationMW.authorize("admin"),

router.route("/website/product/:id")
      .get(ProductController.getProduct)

module.exports=router;