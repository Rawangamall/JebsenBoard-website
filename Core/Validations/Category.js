const { body, param } = require("express-validator");
const Category = require("../../Models/CategoryModel");
const { Op } = require('sequelize');

async function checkIfCategoryNameExists(name, lang, id) {
  const whereClause = {
    [lang === "ar" ? "multilingualData.ar.name" : "multilingualData.en.name"]: name,
  };
  
  // Exclude the current category
  if (id) {
    whereClause.id = { [Op.ne]: id };
  }

  const categoryExists = await Category.findAll({ where: whereClause });
  return categoryExists.length > 0;
}

exports.CategoryValidPOST = [
  body("name_ar")
    .notEmpty().withMessage("اسم المنتج مطلوب")
    .isString().withMessage("يجب أن يكون اسم المنتج نصًا")
    .custom(async (value, { req }) => {
      const categoryNameExists = await checkIfCategoryNameExists(value, "ar");
      if (categoryNameExists) {
        throw new Error("اسم الفئة موجود بالفعل");
      }
      return true;
    }),

  body("name_en")
    .notEmpty().withMessage("اسم المنتج مطلوب")
    .isString().withMessage("يجب أن يكون اسم المنتج نصًا")
    .custom(async (value, { req }) => {
      const categoryNameExists = await checkIfCategoryNameExists(value, "en");
      if (categoryNameExists) {
        throw new Error("اسم الفئة موجود بالفعل");
      }
      return true;
    }),
];

exports.CategoryValidPUT = [
  body("name_ar")
    .optional()
    .isString().withMessage("يجب أن يكون اسم المنتج نصًا")
    .custom(async (value, { req }) => {
      const categoryNameExists = await checkIfCategoryNameExists(value, "ar", req.params.id);
      if (categoryNameExists) {
        throw new Error("اسم الفئة موجود بالفعل");
      }
      return true;
    }),

  body("name_en")
    .optional()
    .isString().withMessage("يجب أن يكون اسم المنتج نصًا")
    .custom(async (value, { req }) => {
      const categoryNameExists = await checkIfCategoryNameExists(value, "en", req.params.id);
      if (categoryNameExists) {
        throw new Error("اسم الفئة موجود بالفعل");
      }
      return true;
    }),
];
