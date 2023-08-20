const { body , validationResult} = require("express-validator");
const User = require("./../../Models/UserModel");

exports.UserValidPOST = [
  body('firstName').isString().withMessage('First name should be a letters'),
  body('firstName_ar').isString().withMessage('الاسم الاول يجب ان يتكون من حروف'),
  body('lastName_ar').isString().withMessage('الاسم الثاني يجب ان يتكون من حروف'),
  body('lastName').isString().withMessage('Last name should be a letters'),
  body('email')
    .isEmail().withMessage('Should be a valid email format')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject('Email already in use - هذا الايميل مستخدم');
      }
    }),
  body('image').optional().isString().withMessage('Image should be a string'),
  body('phoneNumber')
    .isString().withMessage('The phone should be in email format ')
    .custom(async (value) => {
      const user = await User.findOne({ where: { 'multilingualData.en.phoneNumber': value } });
      if (user) {
        return Promise.reject('Phone number already in use - هذا الرقم مستخدم');
      }
    }),
  body('phoneNumber_ar').isString().withMessage('ادخل رقم الهاتف بالعربي'),
  body('role').isString().withMessage('Role should be a string'),
  body("role_ar").isString().withMessage("يجب عليك ادخال النص بالعربي"),
  body('password').isString().withMessage('Password should be a string') 

];

exports.UserValidPATCH = [
  body("firstName").isString().optional().withMessage("fisrt name should be in english letters"),
  body("firstName_ar").isString().optional().withMessage("يجب عليك ادخال الاسم الاول بالعربي"),
  body("lastName_ar").isString().optional().withMessage("يجب عليك ادخال الاسم الثاني بالعربي"),
  body("lastName").isString().optional().withMessage("last name should be in english letters"),
  body('email')
    .isEmail().optional().withMessage('Should be a valid email format')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject('Email already in use - هذا الايميل مستخدم');
      }
    }),  
  body("image").optional().isString().withMessage("image should string"),
  body('phoneNumber')
    .isString().optional().withMessage('The phone should be in email format ')
    .custom(async (value) => {
      const user = await User.findOne({ where: { 'multilingualData.en.phoneNumber': value } });
      if (user) {
        return Promise.reject('Phone number already in use - هذا الرقم مستخدم');
      }
    }),  body("phoneNumber_ar").isString().optional().withMessage("ادخل رقم الهاتف بالعربي"),
  body("role").isString().optional().withMessage("Role should be in english letters"),
  body("role_ar").isString().optional().withMessage("يجب عليك ادخال النص بالعربي"),
  body("password").isString().optional().withMessage("password should string")
];
