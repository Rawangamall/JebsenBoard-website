const multer=require("multer");
const path=require("path");
const fs = require('fs');
const mongoose=require("mongoose");

require("./../../Models/UserModel")
require("./../../Models/CategoryModel")

const UserSchema=mongoose.model("user");
const CategorySchema=mongoose.model("category");

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
            }else if(fullUrl.includes("category")){
                console.log("dest")
                cb(null,path.join(__dirname,"..","images","Category"));
            }else if(fullUrl.includes("product")){
                cb(null,path.join(__dirname,"..","images","Product"));
            }
            else{
                return next(new AppError(`Foriegn User`, 401));
            }

        } , 
        filename:(request, file, cb)=>{
           
            var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;

          if(fullUrl.includes("user")){
                userId = request.params._id;
                imageName = userId + "." + "jpg";
          }else if(fullUrl.includes("category")){
                categoryName = request.body.name;
                imageName = categoryName + "." + "jpg";
               
            }else if(fullUrl.includes("product")){
                productName = request.body.category_id + request.body.name;
                request.image = imageName
                imageName = productName + "." + "jpg";
            }
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

exports.removeCategoryIMG=function(req,res,next){
    CategorySchema.findOne({_id:req.params._id}).then((data)=>{
        if(data != null && data.image != "default.jpg"){
        imageName = data.name+ "." + "jpg";
        // imageName = data.image;

        fs.unlink(path.join(__dirname,"..","images","Category",imageName), function (err) {
            if (err)
                next(new Error("Category not found"));
            else
                next();
        })
    }
    next();
    })
}