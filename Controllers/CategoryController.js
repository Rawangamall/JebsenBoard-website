const mongoose = require("mongoose");
require("../Models/CategoryModel");

// const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

const CategorySchema = mongoose.model("category");

 exports.getAll = catchAsync(async (req, res, next) => {
  const categories = await CategorySchema.find();
  if(!categories) return res.status(404).json({ error: "category not found" });
  res.status(200).json({
    status: "success",
    data: {
      categories
    }
  });
});

 exports.addCategory = catchAsync(async (request, response, next) => {
  
      const Category = new CategorySchema({
        'name.en': request.body.name,
        'name.ar': request.body.name_ar,
        
      });
  
      const data = await Category.save();
      response.status(201).json(data);
  }

);

 exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await CategorySchema.findById(req.params.id);
  if(!category) return res.status(404).json({ error: "category not found" });
  res.status(200).json({
    status: "success",
    data: {
      category
    }
  });
}
);

exports.updateCategory = catchAsync(async (req, res, next) => {
 
    const id = req.params.id;
    const updateData = req.body;

   
    const updatedDocument = await CategorySchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if(!updatedDocument) return res.status(404).json({ error: "category not found" });
     
    res.status(200).json(updatedDocument);
     
    
  }
);

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deleted = await CategorySchema.findByIdAndRemove(id);
  if(!deleted) return res.status(404).json({ error: "category not found" });
  
  res.status(200).json(deleted);
}
);


