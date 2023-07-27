const express=require("express");
const router=express.Router();

const ProductController=require("./../Controllers/ProductController");
const validationData = require("./../Core/Validations/Product")
const AuthenticationMW = require("./../Middlewares/authenticationMW")
const AuthorizationMW = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")


router.route("/products")
        .get(AuthenticationMW.auth ,AuthorizationMW.authorize("admin") ,validationMW,ProductController.getAll)
       .post(AuthenticationMW.auth,AuthorizationMW.authorize("admin"),validationData.ProductValidPOST,validationMW ,ProductController.addProduct) 

router.route("/products/:id")
        .get(AuthenticationMW.auth ,AuthorizationMW.authorize("admin"),ProductController.getProduct)
        .patch(AuthenticationMW.auth ,AuthorizationMW.authorize("admin"),validationMW, ProductController.updateProduct)
        .delete(AuthenticationMW.auth,AuthorizationMW.authorize("admin"),validationMW ,ProductController.deleteProduct)

router.route("/product/category")
      .get(AuthenticationMW.auth ,ProductController.getProductsCategory)


module.exports=router;