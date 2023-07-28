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

exports.getProductsCategory = catchAsync(async (request, response, next) => {

  const categoryID = request.query.categoryID;
  const lang = request.headers.lang || "en";

  //sort
  const sort = request.query.sort || "newest";

  //range of category
  //const maxHeightRange = await ProductSchema.findOne().sort({'height.en':-1}).select('height.en')

  //filters in eng only
  const minDepth = request.query.minDepth || 0;
  const maxDepth = request.query.maxDepth || Number.MAX_SAFE_INT;
  const minHeight = request.query.minHeight || 0;
  const maxHeight = request.query.maxHeight || Number.MAX_SAFE_INT;

  let query = {
    category_id: categoryID,
    [`height.en`]: { $regex: /^[0-9]+/, $gte: parseInt(minHeight), $lte: parseInt(maxHeight) } , 
    [`depth.en`]: { $regex: /^[0-9]+/, $gte: parseInt(minDepth), $lte: parseInt(maxDepth) }
  };

  let projection = {
    "main_image": 1,
    "slideshow_images": 1,
  };
  
  if (lang === "en") {
    projection["price.en"] = 1;
    projection["description.en"] = 1;
    projection["name.en"] = 1;
    projection["material.en"] = 1;
    projection["height.en"] = 1;
    projection["depth.en"] = 1;
  } else {
    projection["price.ar"] = 1;
    projection["description.ar"] = 1;
    projection["name.ar"] = 1;
    projection["material.ar"] = 1;
    projection["height.ar"] = 1;
    projection["depth.ar"] = 1;
  }

  let sortObj = {};
  switch (sort) {
    case "newest":
      sortObj = { createdAt: -1 };
      break;
    case "earliest":
      sortObj = { createdAt: 1 };
      break;
    case "price_dsec":
      sortObj = { [`price.${lang}`]: -1 };
      break;
    case "price_asec":
      sortObj = { [`price.${lang}`]: 1 };
      break;
    default:
      sortObj = { createdAt: -1 };
  }

  const options = {
    page: parseInt(request.query.page) || 1,
    limit: parseInt(request.query.limit) || 10,
    sort: sortObj , 
    select: projection 
  };

  const data = await ProductSchema.paginate(query, options);  
  response.status(200).json({data,maxHeightRange});
});
 





