const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op } = require('sequelize');



const Product = require("./../../Models/ProductModel");
const Category = require("./../../Models/CategoryModel");
// delete require.cache[require.resolve('./../../models/ProductModel')];

const AppError = require("./../../utils/appError");

exports.addIMG = multer({
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype != "image/png" &&
      file.mimetype != "image/jpg" &&
      file.mimetype != "image/jpeg"
    ) {
      return cb(new Error("jpg، png، أو jpeg  يُسمح فقط بالصور بامتدادات "));
    }
    cb(null, true);
  },
  limits: { fileSize: 10000 * 10000 },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

      if (fullUrl.includes("user")) {
        cb(null, path.join(__dirname, "..", "images", "User"));
      } else if (fullUrl.includes("category")) {
        console.log("dest");
        cb(null, path.join(__dirname, "..", "images", "Category"));
      } else if (fullUrl.includes("product")) {
        cb(null, path.join(__dirname, "..", "images", "Product"));
      } else {
        return next(new AppError(`المستخدم غير موجود`, 401));
      }
    },
    filename: async (request, file, cb) => {
      try {
        var fullUrl =
          request.protocol + "://" + request.get("host") + request.originalUrl;
        var imageName;

        if (fullUrl.includes("user")) {
          userId = request.params._id;
          imageName = userId + "." + "jpg";
          request.imageName = imageName;
        }

        cb(null, imageName);
      } catch (err) {
        console.log(err);
      }
    },
  }),
}).single("image");

exports.removeUserIMG = function (req, res, next) {
  UserSchema.findOne({ _id: req.params._id }).then((data) => {
    if (data != null && data.image != "default.jpg") {
      imageName = data._id + "." + "jpg";

      fs.unlink(
        path.join(__dirname, "..", "images", "User", imageName),
        function (err) {
          if (err) next(new Error("المستخدم غير موجود"));
        }
      );
    }
    next();
  });
};

exports.removeCategoryIMG = async function (req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);

    if (category !== null && category.image !== "default.jpg") {
      const imageName = category.image;

      // Check if any other categories are using the same image
      const otherCategories = await Category.findAll({
        where: {
          image: imageName,
          id: { [Op.ne]: category.id } // Exclude the current category
        }
      });

      if (otherCategories.length === 0) {
        // No other categories are using the image, so delete it
        fs.unlink(
          path.join(__dirname, "..", "images", "Category", imageName),
          function (err) {
            if (err) {
              next(new Error("فشل في حذف الصورة"));
            }
          }
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};


exports.removeProductIMG = async function (req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product !== null && product.image !== "default.jpg") {
      const imageName = product.image;

      // Check if image is used by other products
      const otherProducts = await Product.findAll({
        where: {
          image: imageName,
          id: { [Op.ne]: product.id } // Exclude the current product
        }
      });

      if (otherProducts.length === 0) {
        // No other products are using the image, so delete it
        fs.unlink(
          path.join(__dirname, "..", "images", "Product", imageName),
          function (err) {
            if (err) {
              next(new Error("فشل في حذف الصورة"));
            }
          }
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};


exports.categoryImageUpload = multer({
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype != "image/png" &&
      file.mimetype != "image/jpg" &&
      file.mimetype != "image/jpeg"
    ) {
      return cb(new Error(" jpg، png، أو jpeg  يُسمح فقط بالصور بامتدادات "));
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
        const imageName = file.originalname;
        if (request.query.id) {
          const categoryId = request.query.id;
          const category = await Category.findByPk(categoryId);
          console.log("existingImage1", existingImage);

          if (category) {
            const existingImage = category.image;
            console.log("existingImage1", existingImage);
            // Remove the existing image if it's not the default image
            if (existingImage && existingImage !== "default.jpg") {
              console.log("existingImage2", existingImage);
              fs.unlink(
                path.join(__dirname, "..", "images", "Category", existingImage),
                (err) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log("Existing file deleted successfully");
                  }
                }
              );
            }
          }
        }

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
      return cb(new Error("يُسمح فقط بالصور"));
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
        const imageName = file.originalname;
        if (request.query.id) {
          const productId = request.query.id;
          const product = await Product.findByPk(productId);
          if (product) {
            const existingImage = product.image;
            // Remove the existing image if it's not the default image
            if (existingImage && existingImage !== "default.jpg") {
              console.log("existingImage", existingImage);
              fs.unlink(
                path.join(__dirname, "..", "images", "Product", existingImage),
                (err) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log("Existing file deleted successfully");
                  }
                }
              );
            }
          }
        }

        if (request.body.name) {
          const productNameExist = await Product.findAll({
            where: {
              name: request.body.name,
            },
          });
          if (productNameExist.limits > 0) {
            return cb(new Error("اسم المنتج موجود بالفعل"));
          }
        }

        cb(null, imageName);
      } catch (err) {
        console.error(err);
        cb(err);
      }
    },
  }),
}).single("image");
