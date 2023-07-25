const { body, param } = require("express-validator");

exports.UserValidPOST = [
  body("firstName").isString().withMessage("fisrt name should string"),
  body("firstName_ar").isString().withMessage("fisrt name should string"),
  body("lastName_ar").isString().withMessage("fisrt name should string"),
  body("lastName").isString().withMessage("last name should string"),
  body('email').isEmail().withMessage('Should be a valid email format'),
  body("image").optional().isString().withMessage("image should string"),
  body("phoneNumber").isNumeric().withMessage("The number should be integer"),
  body("role").isString().withMessage("Role should be number"),
  body("password").isString().withMessage("password should string"),

];