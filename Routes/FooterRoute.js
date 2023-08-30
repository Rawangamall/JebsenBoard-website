const express=require("express");
const router=express.Router();
const FooterController=require("../Controllers/FooterController");
const multer = require('multer');
const upload = multer();

const validationData = require("./../Core/Validations/Footer")
const validationMW = require("./../Core/Validations/validateMW")

router.route("/generalSetting")
       .get(FooterController.getAll)
       .patch(upload.none(),validationData.FooterPatch,validationMW,FooterController.Update);
   
module.exports=router;