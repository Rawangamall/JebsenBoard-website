
const { body, param } = require("express-validator");
const Category = require("../../Models/CategoryModel");
const { Op } = require('sequelize');

async function checkIfCategoryNameExists(name, lang , id) {
  // Implement your actual database query or logic here
  // Return true if category name exists, false otherwise
  const whereClause = lang === "ar"
    ? { "multilingualData.ar.name": name }
    : { "multilingualData.en.name": name };
//exclude the current category
  if (id) {
    whereClause.id = { [Op.ne]: id };
  }

  const category = await Category.findAll({
    where: whereClause

  });

  return category.length > 0;
}

exports.CategoryValidPOST = [
  body("name_ar").notEmpty().withMessage("اسم المنتج مطلوب")
  .isString().withMessage("يجب أن يكون اسم المنتج نصًا")
  .custom(async (value, { req }) => {
        console.log(value , "valuee")

    const productNameExists = await checkIfCategoryNameExists(value, "ar" );
    if (productNameExists) {
      throw new Error("اسم المنتج موجود بالفعل");
    }
    return true;
  }),

  body("name_en").notEmpty().withMessage("اسم المنتج مطلوب")
.isString().withMessage("يجب أن يكون اسم المنتج نصًا")
  .custom(async (value, { req }) => {
    console.log(value)
    const productNameExists = await checkIfCategoryNameExists(value, "en");
    if (productNameExists) {
      throw new Error("اسم المنتج موجود بالفعل");
    }
    return true;
  }),


];

exports.CategoryValidPUT = [
  body("name_ar").optional()
  .isString().withMessage("يجب أن يكون اسم المنتج نصًا")
  .custom(async (value, { req }) => {
    const productNameExists = await checkIfCategoryNameExists(value, "ar" , req.params.id);
    if (productNameExists) {
      throw new Error("اسم المنتج موجود بالفعل");
    }
    return true;
  }),

  body("name_en").optional()
  .isString().withMessage("يجب أن يكون اسم المنتج نصًا")
  .custom(async (value, { req }) => {
    const productNameExists = await checkIfCategoryNameExists(value, "en", req.params.id);
    if (productNameExists) {
      throw new Error("اسم المنتج موجود بالفعل");
    }
    return true;
  }),


    ];