const { body, param } = require("express-validator");
const Product = require("../../Models/ProductModel");
const { Op } = require('sequelize');
const validProductExecute_ar = ['تم التنفيذ بمقاس من قبل', 'لم يتم التنفيذ بمقاس من قبل'];

const validProductExecute_en = ['Not executed with a previous measurement', 'Executed with a measurement'];
// Validation error messages
const errorMessages = {
  required: "يرجى إدخال {{field}}",
  length: "{{field}} يجب أن يكون بين {{min}} و {{max}} حرف",
  arabic: "{{field}} يجب أن يحتوي على أحرف عربية فقط",
  english: "{{field}} يجب أن يحتوي على أحرف إنجليزية فقط",
  numeric: "{{field}} يجب أن يكون رقمًا صحيحًا",
};

// Define validation rules
const validationRules = {
  name: [
    body("name")
      .optional()
      .isString().withMessage(errorMessages.required)
      .isLength({ min: 2, max: 100 }).withMessage(errorMessages.length)
      .custom(async (value, { req }) => {
        const productNameExists = await checkIfProductNameExists(value);
        if (productNameExists.length > 0) {
          throw new Error("اسم المنتج موجود بالفعل");
        }
        return true;
      }),
  ],
  description: [
    body("description_ar")
      .optional()
      .isString().withMessage(errorMessages.arabic),
    body("description")
      .optional()
      .isString().withMessage(errorMessages.english),
  ],
  style: [
    body("style_ar")
      .optional()
      .isString().withMessage(errorMessages.arabic),
    body("style")
      .optional()
      .isString().withMessage(errorMessages.english),
  ],
  material: [
    body("material_ar")
      .optional()
      .isString().withMessage(errorMessages.arabic),
    body("material")
      .optional()
      .isString().withMessage(errorMessages.english),
  ],
  depth: [
    body("depth_ar")
      .optional()
      .isString().withMessage(errorMessages.arabic),
    body("depth")
      .optional()
      .isNumeric().withMessage(errorMessages.numeric),
  ],
  height: [
    body("height_ar")
      .optional()
      .isString().withMessage(errorMessages.arabic),
    body("height")
      .optional()
      .isNumeric().withMessage(errorMessages.numeric),
  ],
  price: [
    body("price_ar")
      .optional()
      .isString().withMessage(errorMessages.arabic),
    body("price")
      .optional()
      .isFloat().withMessage(errorMessages.numeric),
  ],
  category_id: [
    body("category_id")
      .optional()
      .isInt().withMessage(errorMessages.numeric),
  ],

  
  
};

async function checkIfProductNameExists(productName, id) {
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
  return product;
}

exports.ProductValidPOST = [
  body("name")
    .optional()
    .isString().withMessage("يرجى إدخال اسم المنتج")
    .isLength({ min: 2, max: 100 }).withMessage("اسم المنتج يجب أن يكون بين 3 و 100 حرف")
    .custom(async (value, { req }) => {

      const productNameExists = await checkIfProductNameExists(value);
      if (productNameExists.length > 0) {
        throw new Error("اسم المنتج موجود بالفعل");
      }
      return true;
    }),
    body("execute_ar")
    .notEmpty().withMessage("يرجى إدخال النص بالعربي")
    .custom(async (value, { req }) => {
      if (!validProductExecute_ar.includes(value)) {
    throw new Error("تم التنفيذ بمقاس من قبل', 'لم يتم التنفيذ بمقاس من قبل");
      }
      return true;
    }),
    body("execute")
    .notEmpty().withMessage("يرجى إدخال النص بالإنجليزي")
    .custom(async (value, { req }) => {
      if (!validProductExecute_en.includes(value)) {
      throw new Error("يجب أن تكون إحدى القيم: 'Not executed with a previous measurement' أو 'Executed with a measurement'");
      }
      return true;
    }),


  ...validationRules.description,
  ...validationRules.style,
  ...validationRules.material,
  ...validationRules.depth,
  ...validationRules.height,
  ...validationRules.price,
  body("category_id").notEmpty().isInt().withMessage("يرجى إدخال رقم الفئة")
];

exports.ProductValidPatch = [

  ...validationRules.name,
  ...validationRules.description,
  ...validationRules.style,
  ...validationRules.material,
  ...validationRules.depth,
  ...validationRules.height,
  ...validationRules.price,
  ...validationRules.category_id,
  body("execute_ar")
  .optional()
  .custom(async (value, { req }) => {
    if (!validProductExecute_ar.includes(value)) {
      throw new Error("تم التنفيذ بمقاس من قبل', 'لم يتم التنفيذ بمقاس من قبل");
    }
    return true;
  }),
  body("execute")
  .optional()  
  .custom(async (value, { req }) => {
    if (!validProductExecute_en.includes(value)) {
    throw new Error("يجب أن تكون إحدى القيم: 'Not executed with a previous measurement' أو 'Executed with a measurement'");
    }
    return true;
  }),
];
