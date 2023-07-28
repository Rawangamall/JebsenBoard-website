const express=require("express");
const router=express.Router();

const ProductController=require("./../Controllers/ProductController");
const validationData = require("./../Core/Validations/Product")
const AuthenticationMW = require("./../Middlewares/authenticationMW")
// const AuthorizationMW = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")


router.route("/products")
        .get(AuthenticationMW.auth ,validationMW,ProductController.getAll)
       .post(AuthenticationMW.auth,validationData.ProductValidPOST,validationMW ,ProductController.addProduct) 

router.route("/products/:id")
        .get(AuthenticationMW.auth ,ProductController.getProduct)
        .patch(AuthenticationMW.auth,validationMW, ProductController.updateProduct)
        .delete(AuthenticationMW.auth,validationMW ,ProductController.deleteProduct)

router.route("/product/category")
      .get(ProductController.getProductsCategory)


module.exports=router;