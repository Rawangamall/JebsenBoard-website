const mongoose = require("mongoose");
require("../Models/ProductModel");
require("../Models/CategoryModel");

 const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");
const { paginateSubDocs } = require("mongoose-paginate-v2");

const ProductSchema = mongoose.model("product");
const CategorySchema = mongoose.model("category");

 exports.getAll = catchAsync(async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const options = {
    page,
    limit
  };

  const products = await ProductSchema.paginate({}, options);

  if(products.docs == "") 
  {return next(new AppError('There\'s no product', 404));}
  
  res.status(200).json(products);

});

exports.addProduct = catchAsync(async (request, response, next) => {

    const category_id = request.body.category_id;
    const category = await CategorySchema.findById(category_id);

		if (!category) {
			return response.status(404).json({ error: "category not found" });
		}

  
    const Product = new ProductSchema({
      _id: request.body.id,
      'name.en': request.body.name,
      'name.ar': request.body.name_ar,
      'description.en': request.body.description,
      'description.ar': request.body.description_ar,
      'height.en': request.body.height,
      'height.ar': request.body.height_ar,
      'depth.en': request.body.depth,
      'depth.ar': request.body.depth_ar,
      'material.en': request.body.material,
      'material.ar': request.body.material_ar,
      'price.en': request.body.price,
      'price.ar': request.body.price_ar,
      category_id: request.body.category_id,
      main_image: request.body.main_image,
      slideshow_images: request.body.slideshow_images
    });

    console.log(Product);
    const data = await Product.save();
    response.status(200).json(data);
  
});


exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await ProductSchema.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      product
    }
  });
}
);

exports.updateProduct = catchAsync(async (req, res, next) => {
 
    const id = req.params.id;
    const updateData = req.body;

    const category_id = request.body.category_id;
    if(category_id)
    {
       const category = await CategorySchema.findById(category_id);

        if (!category) {
          return response.status(404).json({ error: "category not found" });
        }
    }
  
   
    const updatedDocument = await ProductSchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
     
    res.status(200).json(updatedDocument);
     
    
  }
);

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const ObjectId = Object( req.params.id);

  console.log(ObjectId);
  
  const product = await ProductSchema.findById(ObjectId);
  if (!product) {
    return res.status(404).json({ error: "No record found with that ID" });
  }

  
  await product.remove();
  res.status(204).json(deleted);
}
);


 





