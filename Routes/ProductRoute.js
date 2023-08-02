const express=require("express");
const router=express.Router();

const ProductController=require("./../Controllers/ProductController");
const validationData = require("./../Core/Validations/Product")
const AuthenticationMW = require("./../Middlewares/authenticationMW")
const AuthorizationMW = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")

const {removeProductIMG ,productImageUpload} = require("./../Core/Validations/imageValidations")

router.route("/products")
        .get(AuthenticationMW.auth ,AuthorizationMW.authorize("admin") ,validationMW,ProductController.getAll)
       .post(AuthenticationMW.auth,AuthorizationMW.authorize("admin"),productImageUpload,validationMW ,ProductController.addProduct) //,validationData.ProductValidPOST

router.route("/product/:id")
        .get(AuthenticationMW.auth ,AuthorizationMW.authorize("admin"),ProductController.getProduct)
        .patch(AuthenticationMW.auth ,AuthorizationMW.authorize("admin"),validationMW,productImageUpload, ProductController.updateProduct)
        .delete(AuthenticationMW.auth,AuthorizationMW.authorize("admin"),validationMW ,removeProductIMG,ProductController.deleteProduct)

router.route("/product/category")
      .get(ProductController.getProductsCategory)

router.route("/product/search")
      .get(ProductController.searchProducts)


module.exports=router;