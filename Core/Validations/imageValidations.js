const multer=require("multer");
const path=require("path");
const fs = require('fs');
const mongoose=require("mongoose");

require("./../../Models/UserModel")

const UserSchema=mongoose.model("user");
const AppError = require("./../../utils/appError");

exports.addIMG = multer({

    fileFilter: function (req, file, cb) {

        if (file.mimetype != "image/png" && file.mimetype != "image/jpg" && file.mimetype != "image/jpeg" ) {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true)
    },
    limits: { fileSize: 10000*10000 },
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
          
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

            if(fullUrl.includes("user")){
                cb(null,path.join(__dirname,"..","images","User"));
            }else{
                return next(new AppError(`Foriegn User`, 401));
            }

        } , 
        filename:(request, file, cb)=>{
          
                userId = request.params._id;
                imageName = userId + "." + "jpg";
                request.image = imageName

                cb(null, imageName);
            
         }
    })
}).single("image")

exports.removeUserIMG=function(req,res,next){
    UserSchema.findOne({_id:req.params._id}).then((data)=>{
        if(data != null && data.image != "default.jpg"){
        imageName = data._id+ "." + "jpg";

        fs.unlink(path.join(__dirname,"..","images","User",imageName), function (err) {
            if (err)
                next(new Error("User not found"));
            else
                next();
        })
    }
    next();
    })
}
