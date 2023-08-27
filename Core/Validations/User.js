const { body , validationResult} = require("express-validator");
const User = require("./../../Models/UserModel");
const validRoles = ['ادمن', 'موظف'];

exports.UserValidPOST = [
  body('firstName').isString().withMessage('الاسم الاول يجب ان يتكون من حروف'),
  body('lastName').isString().withMessage('الاسم الثاني يجب ان يتكون من حروف'),
  body('email')
  .isEmail().withMessage('يجب ادخال الايميل الصحيح')
  .custom(async (value) => {
    console.log(value)
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject('Email already in use - هذا الايميل مستخدم');
      }
    }),
  body('image').optional().isString().withMessage('Image should be a string'),
  body('phoneNumber')
    .isString().withMessage('ادخل رقم الهاتف بالعربي')
    .custom(async (value) => {
      const user = await User.findOne({ where: { phoneNumber: value } });
      if (user) {
        return Promise.reject('Phone number already in use - هذا الرقم مستخدم');
      }
    }),
    body("role")
    .isString().withMessage("يجب عليك ادخال النص بالعربي")
    .custom((value) => {
      if (!validRoles.includes(value)) {
        return Promise.reject('Invalid role - دور غير صحيح');
      }
      return true;
    }),
      body('password').isString().withMessage('يجب ادخال كلمه السر') 

];

exports.UserValidPATCH = [
  body("firstName").isString().optional().withMessage("يجب عليك ادخال الاسم الاول بالعربي") ,
  body("lastName").isString().optional().withMessage("يجب عليك ادخال الاسم الثاني بالعربي"),
  body('email')
    .isEmail().optional().withMessage('يجب ادخال الايميل الصحيح')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject('Email already in use - هذا الايميل مستخدم');
      }
    }),  
  body("image").optional().isString().withMessage("image should string"),
  body('phoneNumber')
    .isString().optional().withMessage('ادخل رقم الهاتف بالعربي')
    .custom(async (value) => {
      const user = await User.findOne({ where: { phoneNumber: value } });
      if (user) {
        return Promise.reject('Phone number already in use - هذا الرقم مستخدم');
      }
    }),
  body("role").isString().optional().withMessage("يجب عليك ادخال النص بالعربي"),
  body("password").isString().optional().withMessage('يجب ادخال كلمه السر')
];
