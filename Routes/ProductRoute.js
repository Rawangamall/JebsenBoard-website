const express=require("express");
const router=express.Router();
const multer = require("multer");
const Upload = multer();

const ProductController=require("./../Controllers/ProductController");
const {ProductValidPOST , ProductValidPatch} = require("./../Core/Validations/Product")
const {auth} = require("./../Middlewares/authenticationMW")
const {authorize} = require("./../Middlewares/authorizationMW")
const validationMW = require("./../Core/Validations/validateMW")

const {removeProductIMG ,productImageUpload} = require("./../Core/Validations/imageValidations")

router.route("/products")
        .get(ProductController.getAll)
       .post(auth,authorize(["ادمن","موظف"]),productImageUpload,ProductValidPOST,validationMW ,ProductController.addProduct)

router.route("/product/category")
      .get(ProductController.getProductsCategory)

router.route("/product/search")
      .get(ProductController.searchProducts)

router.route("/product/:id")
      .get( ProductController.getProduct)
      .put(auth,authorize(["ادمن","موظف"]),productImageUpload ,ProductValidPatch, validationMW, ProductController.updateProduct)
      .delete(auth,authorize("ادمن"),validationMW ,removeProductIMG,ProductController.deleteProduct)

router.route("/dashboard/product/:id")
      .get(auth ,authorize(["ادمن","موظف"]),ProductController.getProduct)

router.route("/dashboard/products")
      .get(auth ,authorize(["ادمن","موظف"]),ProductController.getAll)


router.route("/products/offer")
      .get(auth ,authorize(["ادمن","موظف"]),ProductController.getallOffers)
      .put(auth ,authorize(["ادمن","موظف"]),ProductController.addOffer) 
      .delete(auth ,authorize(["ادمن","موظف"]),ProductController.deleteOffer)    

      module.exports=router;

 router.route("/products/offer/:value")
      .get(auth ,authorize(["ادمن","موظف"]),ProductController.getOfferProducts)
 
router.route("/dashboard/productsIncPrice")
      .patch(auth ,authorize(["ادمن","موظف"]),Upload.none(),ProductController.PriceIncrease)


module.exports=router;
