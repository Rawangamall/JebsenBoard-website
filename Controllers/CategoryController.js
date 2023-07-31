const mongoose = require("mongoose");
require("../Models/CategoryModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

const CategorySchema = mongoose.model("category");
const ProductSchema = mongoose.model("product");

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


      const Category = new CategorySchema({
        'name.en': request.body.name,
        'name.ar': request.body.name_ar,
        image: request.body.name+".jpg"
        
      });
  
      const data = await Category.save();
      response.status(201).json(data);
  }

);

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

   
    const updatedDocument = await CategorySchema.findByIdAndUpdate(
      id,
      
      { 'name.en': req.body.name,
        'name.ar': req.body.name_ar,
        image: req.body.image }
      ,
      { new: true }
    );
    if(!updatedDocument) return next(new AppError('No category found', 404))
     
    res.status(200).json(updatedDocument);
     
    
  }
);

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const deleted = await CategorySchema.findByIdAndRemove(id);
  console.log(deleted);
  if(!deleted) return next(new AppError('No category found', 404))
  
  res.status(200).json(deleted);
}
);


