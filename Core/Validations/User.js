const { body} = require("express-validator");
const User = require("./../../Models/UserModel");
const validRoles = ['ادمن', 'موظف'];
const arabicLettersRegex = /^[\u0600-\u06FF\s]+$/;

exports.UserValidPOST = [
  body('firstName').isString().withMessage('الاسم الأول يجب أن يتكون من حروف عربية فقط'),
  body('lastName').isString().withMessage('الاسم الثاني يجب أن يتكون من حروف عربية فقط'),  
  body('email')
  .isEmail().withMessage('يجب ادخال الايميل الصحيح')
  .custom(async (value) => {

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
    body("role").isString().withMessage("يجب عليك ادخال النص بالعربي")
    .custom((value) => {
      console.log(value,"valueeee")
      if (!validRoles.includes(value)) {
        return Promise.reject('Invalid role - دور غير صحيح');
      }
      return true;
    }),
      body('password').isStrongPassword().withMessage('يجب أن تكون كلمة المرور قوية. يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.')


];

exports.UserValidPATCH = [
  body('firstName').optional().isString().withMessage('الاسم الأول يجب أن يتكون من حروف عربية فقط'),
  body('lastName').optional().isString().withMessage('الاسم الثاني يجب أن يتكون من حروف عربية فقط'),  
  body('email')
    .isEmail().optional().withMessage('يجب ادخال الايميل الصحيح')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject('Email already in use - هذا الايميل مستخدم');
      }
    }),  
  body("image").optional().isString().withMessage("يجب ادخال صوره مناسبه"),
  body('phoneNumber')
    .isString().optional().withMessage('ادخل رقم الهاتف بالعربي')
    .custom(async (value) => {
      const user = await User.findOne({ where: { phoneNumber: value } });
      if (user) {
        return Promise.reject('Phone number already in use - هذا الرقم مستخدم');
      }
    }),
    body("role").isString().optional().withMessage("يجب عليك ادخال النص بالعربي")
    .custom((value) => {

      if (!validRoles.includes(value)) {
        return Promise.reject('Invalid role - دور غير صحيح');
      }
      return true;
    }),
    body('password').isStrongPassword().optional().withMessage('يجب أن تكون كلمة المرور قوية. يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.')
  ];
