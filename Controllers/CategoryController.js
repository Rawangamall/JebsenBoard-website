const mongoose = require("mongoose");
require("../Models/CategoryModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

const CategorySchema = mongoose.model("category");
const ProductSchema = mongoose.model("product");
const path=require("path");
const fs = require('fs');


exports.getAll = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const options = {
    page,
    limit
  };

  // Aggregate to get categories and their product counts in a single query
  const categoriesWithCounts = await CategorySchema.aggregate([
    {
      $lookup: {
        from: 'product', // Replace 'products' with the name of your products collection
        localField: 'id',
        foreignField: 'category_id',
        as: 'products'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        // Add other fields from your CategorySchema that you want to include
        productCount: { $size: '$products' }
      }
    },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ]);

  if (categoriesWithCounts.length === 0) {
    return next(new AppError('No category found', 404));
  }

  res.status(200).json(categoriesWithCounts);
});


exports.addCategory = catchAsync(async (request, response, next) => {
  let isDuplicateLetter = false;
  let randomLetter;

  do {

    randomLetter = generateRandomLetter();

    const existingCategory = await CategorySchema.findOne({
      $or: [
        { 'letter.en': randomLetter.englishLetter },
        { 'letter.ar': randomLetter.arabicLetter }
      ]

    });

    if (existingCategory) {
      isDuplicateLetter = true;
      randomLetter = generateRandomLetter();

    } else {
      isDuplicateLetter = false;
    }

  } while (isDuplicateLetter);

  const Category = new CategorySchema({
    'name.en': request.body.name,
    'name.ar': request.body.name_ar,
    'letter.en': randomLetter.englishLetter,
    'letter.ar': randomLetter.arabicLetter,
    image: request.body.name + ".jpg"
  });

  const data = await Category.save();
  response.status(201).json(data);
  
});


 exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await CategorySchema.findById(req.params.id);
  
  if(!category) return next(new AppError('No category found', 404))
  const ProductsCategory = await ProductSchema.find({categoryId: req.params.id}).countDocuments();
  res.status(200).json({
    status: "success",
    data: {
      category ,ProductsCategory
    }
  });
}
);

exports.updateCategory = catchAsync(async (req, res, next) => {
 
    const id = req.params.id;
    const category = await CategorySchema.findById(id);
    if(!category) return next(new AppError('No category found', 404))
    console.log("category",category);
    const imageExist = req.file || "undefined";
    if(req.body.name && imageExist == "undefined")
    {
      const previousFileName =  category.image;
      const newFileName = req.body.name+".jpg";
      const directoryPath = path.join(__dirname,"..","Core","images","Category"); // Change this to your image upload directory

      const previousFilePath = path.join(directoryPath, previousFileName);
      const newFilePath = path.join(directoryPath, newFileName);

       fs.rename(previousFilePath, newFilePath, (err) => {    
         if (err) {
                console.error('Error renaming the image:', err);
          } else {
                console.log('Image file renamed successfully!');
                }});
    }

    if(req.body.name)
    {
      category.name.en = req.body.name;
      category.image = req.body.name+".jpg";
    }
    if(req.body.name_ar)
    {
      category.name.ar = req.body.name_ar;
    }
    if(req.file)
    {
      console.log(req.body.name || category.name.en);
      image= req.body.name || category.name.en;
      category.image =image+".jpg";
    }


    const updatedDocument = await category.save();

     
    res.status(200).json(updatedDocument);
     
    
  }
);

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const deleted = await CategorySchema.findByIdAndRemove(id);
  console.log(deleted);
  if(!deleted) return next(new AppError('No category found', 404))
  
  res.status(200).json("deleted");
}
);

function generateRandomLetter() {
  const englishAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomIndex = Math.floor(Math.random() * englishAlphabet.length);
  const englishLetter = englishAlphabet[randomIndex];
  const arabicLetter = String.fromCharCode(englishLetter.charCodeAt(0) + 0x0626 - 0x0041); 
  return { englishLetter, arabicLetter };
}