const { body, param } = require("express-validator");

exports.UserValidPOST = [
  body("firstName").isString().withMessage("fisrt name should string"),
  body("firstName_ar").isString().withMessage("fisrt name should string"),
  body("lastName_ar").isString().withMessage("fisrt name should string"),
  body("lastName").isString().withMessage("last name should string"),
  body('email').isEmail().withMessage('Should be a valid email format'),
  body("image").optional().isString().withMessage("image should string"),
  body("phoneNumber").isString().withMessage("The phone should be in english and unique"),
  body("phoneNumber_ar").isString().withMessage("ادخل رقم الهاتف بالعربي"),
  body("role").isString().withMessage("Role should be number"),
  body("password").isString().withMessage("password should string"),

];

exports.UserValidPATCH = [
  body("firstName").isString().optional().withMessage("fisrt name should be in english letters"),
  body("firstName_ar").isString().optional().withMessage("يجب عليك ادخال الاسم الاول بالعربي"),
  body("lastName_ar").isString().optional().withMessage("يجب عليك ادخال الاسم الثاني بالعربي"),
  body("lastName").isString().optional().withMessage("last name should be in english letters"),
  body('email').isEmail().optional().withMessage('Should be a valid email format'),
  body("image").optional().isString().withMessage("image should string"),
  body("phoneNumber").isString().optional().withMessage("The phone should be in english and unique"),
  body("phoneNumber_ar").isString().optional().withMessage("ادخل رقم الهاتف بالعربي"),
  body("role").isString().optional().withMessage("Role should be in english letters"),
  body("role_ar").isString().optional().withMessage("يجب عليك ادخال النص بالعربي"),
  body("password").isString().optional().withMessage("password should string"),
];
