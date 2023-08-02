const mongoose = require("mongoose");
require("../Models/ProductModel");
require("../Models/CategoryModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");
const { paginateSubDocs } = require("mongoose-paginate-v2");

const ProductSchema = mongoose.model("product");
const CategorySchema = mongoose.model("category");

const path=require("path");
const fs = require('fs');

 exports.getAll = catchAsync(async (req, res, next) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const lang = req.headers.lang || "en";


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
      'style.en': request.body.style,
      'style.ar': request.body.style_ar,
      category_id: request.body.category_id,
      image: request.body.image,
    });

    console.log(Product);
    const data = await Product.save();
    response.status(200).json(data);
  
});


exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await ProductSchema.findById(req.params.id);
  if(!product) return next(new AppError('No product found', 404))
  const ProductsCategory = await CategorySchema.findById(product.category_id).limit(3);
  res.status(200).json({
    status: "success",
    data: {
      product : product,
      ProductsCategory : ProductsCategory
    }
  });
}
);

exports.updateProduct = catchAsync(async (req, res, next) => {
 
    const id = req.params.id;
   

    const category_id = req.body.category_id;
    if(category_id)
    {
       const category = await CategorySchema.findById(category_id);

        if (!category) {
          return next(new AppError("category not found", 404));
        }
    }

    const product = await ProductSchema.findById(id);

    if (!product) return next(new AppError("product not found", 404));
    

    const imageExist = req.file || "undefined";
    console.log(imageExist);
    if(req.body.name && imageExist == "undefined")
    {
      console.log("imageExist == undefined");
      const previousFileName =  product.image;
      const newFileName = req.body.name+".jpg";
      const directoryPath = path.join(__dirname,"..","Core","images","Product"); // Change this to your image upload directory

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
      product.name.en = req.body.name;
      product.image = req.body.name+".jpg";
    }
    if(req.body.name_ar)
    {
      product.name.ar = req.body.name_ar;
    }
    if(req.file)
    {
      console.log(req.body.name || product.name.en);
      image= req.body.name || product.name.en;
      product.image =image+".jpg";
    }
    if(req.body.description)product.description.en = req.body.description;
    if(req.body.description_ar)product.description.ar = req.body.description_ar;
    if(req.body.height) product.height.en = req.body.height;
    if(req.body.height_ar) product.height.ar = req.body.height_ar;
    if(req.body.depth) product.depth.en = req.body.depth;
    if(req.body.depth_ar) product.depth.ar = req.body.depth_ar;
    if(req.body.material) product.material.en = req.body.material;
    if(req.body.material_ar) product.material.ar = req.body.material_ar;
    if(req.body.price) product.price.en = req.body.price;
    if(req.body.price_ar) product.price.ar = req.body.price_ar;
    if(req.body.category_id) product.category_id = req.body.category_id;
    if(req.body.style) product.style.en = req.body.style;
    if(req.body.style_ar) product.style.ar = req.body.style_ar;
    await product.save();

    res.status(200).json(product);
     
    
  }
);

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const ObjectId = req.params.id;

  const product = await ProductSchema.findById(ObjectId);
  if (!product) {
    return next(new AppError("No record found", 404));
  }

  await ProductSchema.deleteOne({ _id: ObjectId }); // Use deleteOne to delete the document from the database
  res.status(200).json({message: "Product deleted successfully" });
});


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
 

exports.searchProducts = catchAsync(async (req, res, next) => {
  const searchQuery = req.query.searchkey || "";
  const lang = req.headers.lang || "en";

  let query = {
    $or: []
  };

  const fieldsToSearch = [
    "name",
    "material",
    "description"
  ];

  fieldsToSearch.forEach(field => {
    const fieldQuery = {};

    if (lang === "en") {
      fieldQuery[`${field}.en`] = { $regex: searchQuery, $options: "i" };
    } else {
      fieldQuery[`${field}.ar`] = { $regex: searchQuery, $options: "i" };
    }

    query.$or.push(fieldQuery);
  });

  const projection = {
    main_image: 1
  };

  if (lang === "en") {
    fieldsToSearch.forEach(field => {
      projection[`${field}.en`] = 1;
    });
  } else {
    fieldsToSearch.forEach(field => {
      projection[`${field}.ar`] = 1;
    });
  }

  const data = await ProductSchema.find(query).select(projection);

  if (data.length === 0) {
    return next(new AppError(`There are no matched results for your search.`, 400));
  }

  res.status(200).json(data);
});

