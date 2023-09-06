const express=require("express");
const router=express.Router();
const FooterController=require("../Controllers/FooterController");
const {uploadMultiple , removeSliderIMG} = require("./../Core/Validations/imageValidations")

const validationData = require("./../Core/Validations/Footer")
const validationMW = require("./../Core/Validations/validateMW")
const {auth} = require("./../Middlewares/authenticationMW")
const {authorize} = require("./../Middlewares/authorizationMW")

router.route("/generalSetting")
       .get(auth,authorize("ادمن"),FooterController.getAll)
       .patch(auth,authorize("ادمن"),uploadMultiple,validationData.FooterPatch,validationMW,FooterController.Update);
     
router.route("/generalSetting/:id/:index")
       .delete(auth,authorize("ادمن"),removeSliderIMG,FooterController.Delete)
  
module.exports=router; 