const express=require("express");
const router=express.Router();
const FooterController=require("../Controllers/FooterController");
const multer = require('multer');
const upload = multer();

router.route("/generalSetting")
       .get(FooterController.getAll)
       .patch(upload.none(),FooterController.Update);
   
module.exports=router;