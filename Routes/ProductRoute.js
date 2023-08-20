const express=require("express");
const router=express.Router();

const ProductController=require("./../Controllers/ProductController");
const validationData = require("./../Core/Validations/Product")
const AuthenticationMW = require("./../Middlewares/authenticationMW")
const AuthorizationMW = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")

const {removeProductIMG ,productImageUpload} = require("./../Core/Validations/imageValidations")

router.route("/products")
      //   .get(AuthenticationMW.auth ,AuthorizationMW.authorize("admin") ,validationMW,ProductController.getAll)
       .post(productImageUpload,validationMW ,ProductController.addProduct) //,validationData.ProductValidPOST
//AuthenticationMW.auth,AuthorizationMW.authorize("admin"),
// router.route("/product/category")
//       .get(ProductController.getProductsCategory)

// router.route("/product/search")
//       .get(ProductController.searchProducts)

router.route("/product/:id")
      .get(ProductController.getProduct)//AuthenticationMW.auth ,AuthorizationMW.authorize("admin"),
      .patch(validationMW,productImageUpload, ProductController.updateProduct)//AuthenticationMW.auth ,AuthorizationMW.authorize("admin"),
      .delete(validationMW ,removeProductIMG,ProductController.deleteProduct)//AuthenticationMW.auth,AuthorizationMW.authorize("admin"),


module.exports=router;