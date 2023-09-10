const express=require("express");
const router=express.Router();
const SettingController=require("../Controllers/SettingController");
const {uploadMultiple , removeSliderIMG} = require("../Core/Validations/imageValidations")

const validationData = require("./../Core/Validations/Setting")
const validationMW = require("../Core/Validations/validateMW")
const {auth} = require("../Middlewares/authenticationMW")
const {authorize} = require("../Middlewares/authorizationMW")

router.route("/generalSetting")
       .get(SettingController.getAll)
       .patch(auth,authorize("ادمن"),uploadMultiple,validationData.SettingPatch,validationMW,SettingController.Update);
     
router.route("/generalSetting/:id/:index")
       .delete(auth,authorize("ادمن"),removeSliderIMG,SettingController.Delete)
  
module.exports=router; 