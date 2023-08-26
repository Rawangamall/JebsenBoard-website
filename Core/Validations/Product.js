
const { body, param } = require("express-validator");
const Product = require("../../Models/ProductModel");
const { Op } = require('sequelize');


async function checkIfProductNameExists(productName ,id) {
  // Implement your actual database query or logic here
  // Return true if product name exists, false otherwise
  //exclude the current product
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
console.log("product",product)

  return product;
}

exports.ProductValidPOST = [
  body("name")
    .optional()
    .isString().withMessage("يجب أن يكون اسم المنتج نصًا")
    .custom(async (value, { req }) => {
      // Check if the product name already exists in the controller
      if(value.length < 3) throw new Error("اسم المنتج قصير جداً");
      if(value.length > 100) throw new Error("اسم المنتج طويل جداً");
      const productNameExists = await checkIfProductNameExists(value );
      if (productNameExists.length > 0) {
        throw new Error("اسم المنتج موجود بالفعل");
      }
      return true;
    }),
  body("description_ar").isString().withMessage("description should string"),
  body("description").notEmpty().isString().withMessage("description should string"),
  body("price_ar").isString().withMessage("The number should be integer"),
  body("price").notEmpty().isNumeric().withMessage("The number is required"),
  body("category_id").notEmpty().isInt().withMessage("The category_id is required"),
  body("style").optional().isString().withMessage("The style should be string"),
  body("style_ar").optional().isString().withMessage("The style should be string"),
  body("material").optional().isString().withMessage("The material should be string"),
  body("material_ar").optional().isString().withMessage("The material should be string"),
  body("depth").optional().isNumeric().withMessage("The depth should be integer"),
  body("depth_ar").optional().isString().withMessage("The depth should be string"),
  body("height").optional().isNumeric().withMessage("The height should be integer"),
  body("height_ar").optional().isString().withMessage("The height should be string"),

];

exports.ProductValidPatch = [
    body("name").
    optional().
    isString().withMessage("يجب أن يكون اسم المنتج نصًا")
    .custom(async (value, { req }) => {
      // Check if the product name already exists in the controller
      const productNameExists = await checkIfProductNameExists(value , req.params.id);
      if (productNameExists.length > 0) {
        throw new Error("اسم المنتج موجود بالفعل");
      }
      return true;
    }),
    body("description_ar").optional().isString().withMessage("description should string"),
    body("description").optional().isString().withMessage("description should string"),
    body("price_ar").optional().isNumeric().withMessage("The number should be integer"),
    body("price").optional().isNumeric().withMessage("The number should be integer"),
    body("category_id").optional().isInt().withMessage("The number should be an integer")

    ];