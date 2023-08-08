
const { body, param } = require("express-validator");

exports.ProductValidPOST = [
  body("name_ar").isString().withMessage(" name should string"),
  body("name").notEmpty().isString().withMessage(" name should string"),
  body("description_ar").isString().withMessage("description should string"),
  body("description").notEmpty().isString().withMessage("description should string"),
  body("price_ar").isNumeric().withMessage("The number should be integer"),
  body("price").notEmpty().isNumeric().withMessage("The number should be integer"),
  body("category_id").notEmpty().isInt().withMessage("The number should be an integer"),
  body("style").optional().isString().withMessage("The style should be string"),
  body("style_ar").optional().isString().withMessage("The style should be string"),
  body("material").optional().isString().withMessage("The material should be string"),
  body("material_ar").optional().isString().withMessage("The material should be string"),
  body("depth").optional().isNumeric().withMessage("The depth should be integer"),
  body("depth_ar").optional().isString().withMessage("The depth should be string"),
  body("height").optional().isNumeric().withMessage("The height should be integer"),
  body("height_ar").optional().isString().withMessage("The height should be string"),
  body("image").notEmpty().isString().withMessage("The number should be an integer")

];

exports.ProductValidPatch = [
    body("name_ar").isString().withMessage("fisrt name should string"),
    body("name").isString().withMessage("fisrt name should string"),
    body("description_ar").isString().withMessage("description should string"),
    body("description").isString().withMessage("description should string"),
    body("price_ar").isNumeric().withMessage("The number should be integer"),
    body("price").isNumeric().withMessage("The number should be integer"),
    body("category_id").isInt().withMessage("The number should be an integer")

    ];