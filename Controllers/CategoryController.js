const mongoose = require("mongoose");
require("../Models/CategoryModel");

// const AppError = require("./../utils/appError");
// const catchAsync = require("./../utils/CatchAsync");

const CategorySchema = mongoose.model("category");

const getAll = catchAsync(async (req, res, next) => {
  const category = await CategorySchema.find();
  res.status(200).json({
    status: "success",
    data: {
        category
    }
  });
});



