const express=require("express");
const router=express.Router();
const FooterController=require("../Controllers/FooterController");
const {uploadMultiple , removeSliderIMG} = require("./../Core/Validations/imageValidations")

const validationData = require("./../Core/Validations/Footer")
const validationMW = require("./../Core/Validations/validateMW")

router.route("/generalSetting")
       .get(FooterController.getAll)
       .patch(uploadMultiple,validationData.FooterPatch,validationMW,FooterController.Update);
     
router.route("/generalSetting/:id/:index")
       .delete(removeSliderIMG,FooterController.Delete)
  
module.exports=router; 