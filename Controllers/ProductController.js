const mongoose = require("mongoose");
require("../Models/ProductModel");
require("../Models/CategoryModel");

// const AppError = require("./../utils/appError");
// const catchAsync = require("./../utils/CatchAsync");

const ProductSchema = mongoose.model("product");
const CategorySchema = mongoose.model("category");

const getAll = catchAsync(async (req, res, next) => {
  const products = await ProductSchema.find();
  res.status(200).json({
    status: "success",
    data: {
      products
    }
  });
});



