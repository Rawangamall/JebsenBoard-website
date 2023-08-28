// const Product = require("../Models/ProductModel");
// const Category = require("../Models/CategoryModel");
const { Op , sequelize} = require('sequelize');
const { Category, Product } = require('./../Models/associateModel');


const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");
// const { paginateSubDocs } = require("mongoose-paginate-v2");

exports.getAll = catchAsync(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const lang = req.headers.lang || "en";

    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      offset,
      limit
    });

    if (products.length === 0) {
      return next(new AppError('No product found', 404));
    }

    const modifiedProducts = products.map(product => {
      const plainProduct = product.get({ plain: true });
      return {
        ...plainProduct,
        multilingualData: plainProduct.multilingualData[lang]
      };
    });

    res.status(200).json(modifiedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
});


exports.addProduct = catchAsync(async (request, response, next) => {

    const category_id = request.body.category_id;
    
    const category = await Category.findByPk(category_id);

		if (!category) {
			return next(new AppError(`Category not found`, 401));
		}

    //check if the product name is already exist
    const originalFileName = request.file.originalname; 
    const fileNameWithoutExtension = originalFileName.replace(/\.[^.]*$/, '');
    const Name = request.body.name ? request.body.name  : fileNameWithoutExtension;

    const productNameExist = await Product.findAll({ where: { name: Name} });
    console.log("productExist",productNameExist);
    if (productNameExist.limit > 0)  return next(new AppError(`Product name already exist`, 401));

    const newProduct = await Product.create ({
      name:Name,
      multilingualData:{
        en:{
          description:request.body.description,
          height:request.body.height,
          depth:request.body.depth,
          material:request.body.material,
          style:request.body.style,
          price:request.body.price,
        },
        ar:{
          description:request.body.description_ar,
          height:request.body.height_ar,
          depth:request.body.depth_ar,
          material:request.body.material_ar,
          style:request.body.style_ar,
          price:request.body.price_ar,
        }
      }
      ,
      category_id: request.body.category_id,
      image: request.file.originalname ,
    });
    
    response.status(200).json(newProduct);
  
});


exports.getProduct = catchAsync(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const lang = req.headers.lang;

    const product = await Product.findByPk(productId);

    if (!product) {
      return next(new AppError('No product found', 404));
    }

    const relatedProducts = await Product.findAll({
      where: {
        category_id: product.category_id,
        id: { [Op.ne]: product.id }
      },
      limit: 3 
    });

    // Modify the relatedProducts based on language condition
    const modifiedRelatedProducts = relatedProducts.map(relatedProduct => {
        return {
          ...relatedProduct.get({ plain: true }),
          multilingualData: relatedProduct.multilingualData[lang]
        };
     
    });

    const modifiedProducts = {
      ...product.get({ plain: true }),
      multilingualData: product.multilingualData[lang]
    };


    res.status(200).json({
      status: 'success',
      data: {
        product: modifiedProducts,
        relatedProducts: modifiedRelatedProducts
      }
    });
  } catch (error) {
    next(error); 
  }
});







exports.updateProduct = catchAsync(async (req, res, next) => {
 
    const id = req.params.id;

    const product = await Product.findByPk(id);

    if (!product) return next(new AppError("product not found", 404));

    const category_id = req.body.category_id;
    if(category_id)
    {
       const category = await Category.findByPk(category_id);

        if (!category) {
          return next(new AppError("category not found", 404));
        }
    }

    if(req.body.name)
    {
      product.name = req.body.name;
    }
   
    if(req.file)
    {
      image= req.file.originalname || product.image;
      product.image =image;
    }
    if(req.body.description)product.multilingualData.en.description = req.body.description;
    if(req.body.description_ar)product.multilingualData.ar.description = req.body.description_ar;
    if(req.body.height) product.multilingualData.en.height = req.body.height;
    if(req.body.height_ar) product.multilingualData.ar.height = req.body.height_ar;
    if(req.body.depth)  product.multilingualData.en.depth = req.body.depth;
    if(req.body.depth_ar) product.multilingualData.ar.depth = req.body.depth_ar;
    if(req.body.material)  product.multilingualData.en.material = req.body.material;
    if(req.body.material_ar) product.multilingualData.ar.material = req.body.material_ar;
    if(req.body.price)  product.multilingualData.en.price = req.body.price;
    if(req.body.price_ar) product.multilingualData.ar.price = req.body.price_ar;
    if(req.body.category_id) product.category_id = req.body.category_id;
    if(req.body.style)  product.multilingualData.en.style = req.body.style;
    if(req.body.style_ar) product.multilingualData.ar.style = req.body.style_ar;
    await product.save();

    res.status(200).json(product);
     
    
  }
);

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id; // Get the product ID from the request

  try {
    const product = await Product.findByPk(productId); // Find the product by its ID
    if (!product) {
      return next(new AppError('No record found', 404));
    }
console.log("product",product);
    await product.destroy(); // Delete the product
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    next(error);
  }
});

exports.getProductsCategory = catchAsync(async (request, response, next) => {
  const lang = request.headers.lang || 'en';
  const categoryID = request.query.categoryID;
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const sort = request.query.sort || 'newest';
  const style = request.query.style || '';
  const material = request.query.material || '';


  const whereClause = {
    category_id: categoryID,
  };

  const preData = await Product.findAll({
    where: whereClause,
    attributes: ['id', 'multilingualData'],
  });

  const prices = preData.map(
    item => item.multilingualData[lang].price
  );

  const leastPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const minPrice = parseFloat(request.query.minPrice) || leastPrice;
  const maxPrice = parseFloat(request.query.maxPrice) || highestPrice + 1;

  const andConditions = [];

  if (style) {
   andConditions.push({ [`multilingualData.${lang}.style`]: style });
  }

  if (material) {
   andConditions.push({ [`multilingualData.${lang}.material`]: material });
  }

  if (andConditions.length > 0) {
   whereClause[Op.and] = andConditions;
  }


  const order = [];
  switch (sort) {
    case 'newest':
      order.push(['createdAt', 'DESC']);
      break;
    case 'earliest':
      order.push(['createdAt', 'ASC']);
      break;
    case 'price_dsec':
      order.push([`multilingualData.en.price`, 'DESC']);
      break;
    case 'price_asec':
      order.push([`multilingualData.en.price`, 'ASC']);
      break;
    default:
      order.push(['createdAt', 'DESC']);
  }

  const attributes = ['id', 'name', 'multilingualData', 'image'];

  const { docs, pages, total } = await Product.paginate({
    where: {
      ...whereClause,
      [`multilingualData.en.price`]: {
        [Op.between]: [minPrice, maxPrice],
      },
    },
    attributes,
    page,
    paginate: limit,
    order,
  });

  const data = docs.map(item => {
    const multilingualData = item.multilingualData[lang];
    const {
      depth,
      price,
      style,
      height,
      material,
      description,
    } = multilingualData;

    return {
      id: item.id,
      name: item.name,
      image: item.image,
      depth,
      price,
      style,
      height,
      material,
      description,
    };
  });

  if(data.length ==0){
    return next(new AppError(`There's no products!`, 400));
  }

  response.status(200).json({
    products: data,
    currentPage: page,
    totalPages: pages,
    totalProducts: total,
    leastPrice: leastPrice,
    highestPrice: highestPrice,
    styles: [...new Set(preData.map(item => item.multilingualData[lang].style))],
    materials: [...new Set(preData.map(item => item.multilingualData[lang].material))],
  });
});


exports.searchProducts = catchAsync(async (req, res, next) => {
  const searchQuery = req.query.searchkey || "";

  const query = {
    name: {
      [Op.like]: `%${searchQuery}%`
    }
  };

  const projection = [
    'image',
    'name',
  ];
    
  const data = await Product.findAll({
    where: query,
    attributes: projection,
    });
  
  if (data.length === 0) {
    return next(new AppError(`There are no matched results for your search.`, 400));
  }

  res.status(200).json(data);
});

