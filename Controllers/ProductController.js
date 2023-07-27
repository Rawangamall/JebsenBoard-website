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
			return next(new AppError(`Category not found`, 401));
		}

  
    const Product = new ProductSchema({
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

exports.updateProduct = catchAsync(async (request, res, next) => {
 
    const id = request.params.id;
   

    const category_id = request.body.category_id;
    if(category_id)
    {
       const category = await CategorySchema.findById(category_id);

        if (!category) {
          return next(new AppError("category not found", 404));
        }
    }
  
   
    const product = await ProductSchema.findByIdAndUpdate(id, {
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

    if (!product) {
      return next(new AppError("No record found ", 404));
    }
  
    res.status(200).json(product);
     
    
  }
);

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const ObjectId = Object( req.params.id);
  
  const product = await ProductSchema.findById(ObjectId);
  if (!product) {
    return next(new AppError("No record found ", 404)); 
  }

  
  await product.remove();
  res.status(204).json(deleted);
}
);

//get products of specific category - search - filter - sorting
exports.getProductsCategory = catchAsync(async (request, response, next) => {

  const categoryID = request.query.categoryID;
  const searchKey = request.query.searchkey || "";

  let query = {};
  
	if (searchKey) {
	  const objectId = mongoose.Types.ObjectId.isValid(searchKey)
		? mongoose.Types.ObjectId(searchKey)
		: null;
  
	  const regexSearchKey = new RegExp(searchKey, "i");
  
    query = {
      $and: [
        { category_id: categoryID },
        {
          $or: [
            { _id: objectId },
            { 'name.en': regexSearchKey },
            { 'material.en': regexSearchKey },
            { 'name.ar': regexSearchKey },
            { 'material.ar': regexSearchKey },
          ],
        },
      ],
    };
  } else {
    query = { category_id: categoryID };
  }

  const options = {
    page: parseInt(request.query.page) || 1,
    limit: parseInt(request.query.limit) || 10,
    sort: { createdAt: -1 },
  };
  
  const data = await ProductSchema.paginate(query, options);

   response.status(200).json(data);
});

 





