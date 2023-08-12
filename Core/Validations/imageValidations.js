const multer=require("multer");
const path=require("path");
const fs = require('fs');

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
        filename:async (request, file, cb)=>{
           try{
           
            var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
            var imageName;


          if(fullUrl.includes("user")){
                userId = request.params._id;
                imageName = userId + "." + "jpg";
                request.imageName = imageName
          }
       
        cb(null, imageName);
        }catch(err){
            console.log(err); 
            }
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
           
        })
    }
    next();
    })
}

exports.removeCategoryIMG=function(req,res,next){
    CategorySchema.findOne({_id:req.params.id}).then((data)=>{
        if(data != null && data.image != "default.jpg"){
        imageName = data.image;
        fs.unlink(path.join(__dirname,"..","images","Category",imageName), function (err) {
            if (err)
                next(new Error("Category not found"));
        })
    }
    next();
    })
}
exports.removeProductIMG=function(req,res,next){
    ProductSchema.findOne({_id:req.params.id}).then((data)=>{
        if(data != null && data.image != "default.jpg"){
        imageName = data.image;
        fs.unlink(path.join(__dirname,"..","images","Product",imageName), function (err) {
            if (err)
                next(new Error("product not found"));
        })
    }
    next();
    })
}


exports.categoryImageUpload = multer({
    fileFilter: function (req, file, cb) {
      if (
        file.mimetype != "image/png" &&
        file.mimetype != "image/jpg" &&
        file.mimetype != "image/jpeg"
      ) {
        return cb(new Error("Only images are allowed"));
      }
      cb(null, true);
    },
    limits: { fileSize: 10000 * 10000 },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "images", "Category"));
      },
      filename: async (request, file, cb) => {
        try {
          const categoryId = request.params.id;
          var imageName ;
          var changeName = request.body.name; 
          

          const category = await CategorySchema.findById(categoryId);
          if (!category) {
            imageName = request.body.name + "." + "jpg";
          }
          else{
            const existingImage = category.image;
          
          if(! changeName && file){
            imageName = category.name.en + "." + "jpg";
            }
          // Remove the existing image if it's not the default image
          if (changeName && existingImage && existingImage !== "default.jpg") {
            fs.unlink(path.join(__dirname, "..", "images", "Category", existingImage), (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log("Existing file deleted successfully");
              }
            });
            imageName = request.body.name + "." + "jpg";
          }
        }
        //   const imageName = categoryName ;
          console.log("newimageName", imageName);
          cb(null, imageName);
        } catch (err) {
          console.error(err);
          cb(err);
        }
      },
    }),
  }).single("image");

  
exports.productImageUpload = multer({
    fileFilter: function (req, file, cb) {
      if (
        file.mimetype != "image/png" &&
        file.mimetype != "image/jpg" &&
        file.mimetype != "image/jpeg"
      ) {
        return cb(new Error("Only images are allowed"));
      }
      cb(null, true);
    },
    limits: { fileSize: 10000 * 10000 },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "images", "Product"));
      },
      filename: async (request, file, cb) => {
        try {
          const productId = request.params.id;
          var imageName ;
          var changeName = request.body.name; 
          

          const product = await ProductSchema.findById(productId);
          if (!product) {
            imageName = request.body.name + "." + "jpg";
          }
          else{
            const existingImage = product.image;
          
          if(! changeName && file){
            imageName = product.name.en + "." + "jpg";
            }
          // Remove the existing image if it's not the default image
          if (changeName && existingImage && existingImage !== "default.jpg") {
            fs.unlink(path.join(__dirname, "..", "images", "Product", existingImage), (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log("Existing file deleted successfully");
              }
            });
            imageName = request.body.name + "." + "jpg";
          }
        }
        //   const imageName = categoryName ;
          console.log("newimageName", imageName);
          cb(null, imageName);
        } catch (err) {
          console.error(err);
          cb(err);
        }
      },
    }),
  }).single("image");