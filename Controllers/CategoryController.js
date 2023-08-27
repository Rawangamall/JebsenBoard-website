const Category = require("../Models/CategoryModel");
const Product = require("../Models/ProductModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

const { Op, literal } = require('sequelize');

const path = require("path");
const fs = require('fs');

exports.getAll = catchAsync(async (req, res, next) => {
  const lang = req.headers.lang || 'en'; // Default to English if no lang header is provided

  const categories = await Category.findAll();
  if (!categories) return next(new AppError('لم يتم العثور على أي فئة', 404));

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const categoriesWithCounts = await Category.findAll({
      attributes: {
        include: [
          'id',
          'multilingualData',
          'image',
          [literal('(SELECT COUNT(*) FROM products WHERE products.category_id = category.id)'), 'productCount']
        ]
      },
      offset: (page - 1) * limit,
      limit: limit
    });

    if (categoriesWithCounts.length === 0) {
      return next(new AppError('لم يتم العثور على أي فئة', 404));
    }

    // Filter categories based on language
    const localizedCategories = categoriesWithCounts.map(category => ({
      id: category.id,
      name: lang === 'ar' ? category.multilingualData.ar.name : category.multilingualData.en.name,
      image: category.image,
      productCount: category.dataValues.productCount || 0
    }));

    res.status(200).json(localizedCategories);
  } catch (error) {
    next(error);
  }
});

exports.addCategory = catchAsync(async (request, response, next) => {
  const originalFileName = request.file.originalname;
  const fileNameWithoutExtension = originalFileName.replace(/\.[^.]*$/, '');
  const Name = request.body.name_en ? request.body.name_en : fileNameWithoutExtension;

  const category = await Category.findAll({
    where: {
      [Op.or]: [
        { "multilingualData.en.name": request.body.name_en },
        { "multilingualData.ar.name": request.body.name_ar }
      ]
    }
  });
  if (category.length > 0) return next(new AppError('الفئة موجودة بالفعل', 400));

  const newCategory = await Category.create({
    multilingualData: {
      en: {
        name: Name
      },
      ar: {
        name: request.body.name_ar
      },
    },
    image: request.file.originalname
  });

  response.status(201).json(newCategory);
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const lang = req.headers.lang || "en";
  const attributes = ['id', 'multilingualData', 'image', 'updatedAt', 'createdAt'];
  const id = req.params.id;

  const category = await Category.findByPk(id, { attributes });
  if (!category) return next(new AppError('لم يتم العثور على أي فئة', 404));

  const { multilingualData, image, updatedAt, createdAt } = category.toJSON();

  const { name, description, height, depth, material, style, price } = lang === 'en' ? multilingualData.en : multilingualData.ar;
  const categoryData = {
    name,
    description,
    height,
    depth,
    material,
    style,
    price,
    image,
    updatedAt,
    createdAt
  };

  const productsCount = await Product.count({
    where: { category_id: id }
  });

  res.status(200).json({
    status: "success",
    data: {
      categoryData,
      productsCount
    }
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return next(new AppError('لم يتم العثور على أي فئة', 404));
    }

    const updatedMultilingualData = { ...category.multilingualData };

    if (req.body.name_en) {
      const categoryExist = await Category.findOne({
        where: {
          "multilingualData.en.name": req.body.name_en
        }
      });
      if (categoryExist && categoryExist.id !== category.id) {
        return next(new AppError('الفئة موجودة بالفعل', 400));
      }
      updatedMultilingualData.en.name = req.body.name_en;
    }

    if (req.body.name_ar) {
      const categoryExist = await Category.findOne({
        where: {
          "multilingualData.ar.name": req.body.name_ar
        }
      });
      if (categoryExist && categoryExist.id !== category.id) {
        return next(new AppError('الفئة موجودة بالفعل', 400));
      }
      updatedMultilingualData.ar.name = req.body.name_ar;
    }

    if (req.file) {
      category.image = req.file.originalname;
    }

    // Create a new category object with the updated data
    const updatedCategory = {
      ...category.toJSON(),
      multilingualData: updatedMultilingualData
    };

    // Update the category in the database
    await Category.update(updatedCategory, {
      where: { id }
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
});



exports.deleteCategory = catchAsync(async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByPk(id);

    if (!category) {
      return next(new AppError('لم يتم العثور على أي فئة', 404));
    }

    await category.destroy(); // Delete the category from the database

    res.status(200).json({ message: 'تم حذف الفئة بنجاح' });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
});
