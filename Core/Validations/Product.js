
const { body, param } = require("express-validator");

exports.ProductValidPOST = [
  body("name_ar").isString().withMessage(" name should string"),
  body("name").notEmpty().isString().withMessage(" name should string"),
  body("description_ar").isString().withMessage("description should string"),
  body("description").notEmpty().isString().withMessage("description should string"),
  body("price_ar").isString().withMessage("The number should be integer"),
  body("price").notEmpty().isNumeric().withMessage("The number should be integer"),
  body("category_id").notEmpty().isInt().withMessage("The number should be an integer")

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