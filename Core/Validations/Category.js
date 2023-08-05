
const { body, param } = require("express-validator");

exports.CategoryValidPOST = [
  body("name_ar").isString().withMessage(" name in arabic should string"),
  body("name").notEmpty().isString().withMessage(" name in english should string"),
];

exports.CategoryValidPUT = [
    body("name_ar").isString().withMessage("name in arabic should string"),
    body("name_en").isString().withMessage("string"),

    ];