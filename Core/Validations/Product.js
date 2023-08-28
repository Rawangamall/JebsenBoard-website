const { body, param } = require("express-validator");
const Product = require("../../Models/ProductModel");
const { Op } = require('sequelize');

async function checkIfProductNameExists(productName, id) {
  // Implement your actual database query or logic here
  // Return true if product name exists, false otherwise
  // Exclude the current product
  const queryOptions = {
    where: {
      name: productName,
    }
  };

  if (id !== null && id !== undefined) {
    queryOptions.where.id = {
      [Op.ne]: id,
    };
  }

  const product = await Product.findAll(queryOptions);
  console.log("product",product);

  return product;
}

exports.ProductValidPOST = [
  body("name")
    .optional()
    .isString().withMessage("يرجى إدخال اسم المنتج")
    .isLength({ min: 3, max: 100 }).withMessage("اسم المنتج يجب أن يكون بين 3 و 100 حرف")
    .custom(async (value, { req }) => {
      const productNameExists = await checkIfProductNameExists(value);
      if (productNameExists.length > 0) {
        throw new Error("اسم المنتج موجود بالفعل");
      }
      return true;
    }),
  body("description_ar").isString().withMessage("يرجى إدخال الوصف بالعربي"),
  body("description").notEmpty().isString().withMessage("يرجى إدخال الوصف"),
  body("price_ar").isString().withMessage("السعر يجب أن يكون رقمًا صحيحًا"),
  body("price").notEmpty().isFloat().withMessage("يرجى إدخال السعر"),
  body("category_id").notEmpty().isInt().withMessage("يرجى إدخال رقم الفئة"),
  body("style").optional().isString().withMessage("يرجى إدخال النمط"),
  body("style_ar").optional().isString().withMessage("يرجى إدخال النمط بالعربي"),
  body("material").optional().isString().withMessage("يرجى إدخال المواد"),
  body("material_ar").optional().isString().withMessage("يرجى إدخال المواد بالعربي"),
  body("depth").optional().isNumeric().withMessage("العمق يجب أن يكون رقمًا صحيحًا"),
  body("depth_ar").optional().isString().withMessage("يرجى إدخال العمق بالعربي"),
  body("height").optional().isNumeric().withMessage("الارتفاع يجب أن يكون رقمًا صحيحًا"),
  body("height_ar").optional().isString().withMessage("يرجى إدخال الارتفاع بالعربي"),
];

exports.ProductValidPatch = [
  body("name").
    optional().
    isString().withMessage("يرجى إدخال اسم المنتج")
    .custom(async (value, { req }) => {
      const productNameExists = await checkIfProductNameExists(value, req.params.id);
      if (productNameExists.length > 0) {
        throw new Error("اسم المنتج موجود بالفعل");
      }
      return true;
    }),
  body("description_ar").optional().isString().withMessage("يرجى إدخال الوصف بالعربي"),
  body("description").optional().isString().withMessage("يرجى إدخال الوصف"),
  body("price_ar").optional().isNumeric().withMessage("السعر يجب أن يكون رقمًا صحيحًا"),
  body("price").optional().isNumeric().withMessage("السعر يجب أن يكون رقمًا صحيحًا"),
  body("category_id").optional().isInt().withMessage("رقم الفئة يجب أن يكون رقمًا صحيحًا")
];
