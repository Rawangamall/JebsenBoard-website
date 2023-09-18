const { Op , Sequelize} = require('sequelize');
const { Category, Product } = require('./../Models/associateModel');
const Settings = require('./../Models/SettingModel');

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

exports.getAll = catchAsync(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const lang = req.originalUrl.toLowerCase().includes('dashboard') ? null : req.headers.lang || 'en';

    const offset = (page - 1) * limit;

    const { rows, count } = await Product.findAndCountAll({
      offset,
      limit,
    });

    if (count === 0) {
      return next(new AppError('No products found', 404));
    }

    let modifiedProducts;
    if (lang === 'en' || lang === 'ar') {
      modifiedProducts = rows.map(product => {
        const plainProduct = product.get({ plain: true });
        let PriceAfterOffer = null;
        if(plainProduct.offer)
        {
          price = product.multilingualData['en'].price;
          PriceAfterOffer =  price - (price * plainProduct.offer / 100)
          if(lang=='en') PriceAfterOffer = PriceAfterOffer.toFixed(2);
          if (lang === 'ar') {
            PriceAfterOffer = PriceAfterOffer.toLocaleString('ar-EG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          }
        }
        
        return {
          ...plainProduct,
          multilingualData: plainProduct.multilingualData[lang],
          PriceAfterOffer:  PriceAfterOffer
        };
      });
    }
    else if (lang === null) {
      modifiedProducts = rows.map(product => {
       

        const plainProduct = product.get({ plain: true });
        return {
          ...plainProduct,
          PriceAfterOffer: plainProduct.multilingualData['ar'].price - (plainProduct.multilingualData['ar'].price * plainProduct.offer / 100), 
          multilingualData: plainProduct.multilingualData['ar']
        };
      });
    }
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalProducts: count,
      products: modifiedProducts ? modifiedProducts : rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
});


exports.addProduct = catchAsync(async (request, response, next) => {
  const category_id = request.body.category_id;
    
  const category = await Category.findByPk(category_id);

  if (!category) {
    return next(new AppError(`الفئة غير موجودة`, 401));
  }

  if (!request.file) return next(new AppError(`يرجى إدخال صورة`, 401));
  const originalFileName = request.file.originalname; 
  const fileNameWithoutExtension = originalFileName.replace(/\.[^.]*$/, '');
  const Name = request.body.name ? request.body.name : fileNameWithoutExtension;

  const productNameExist = await Product.findAll({ where: { name: Name} });
  if (productNameExist.length > 0) return next(new AppError(`اسم المنتج موجود بالفعل`, 401));

  const newProduct = await Product.create ({
    name: Name,
    multilingualData: {
      en: {
        description: request.body.description,
        height: request.body.height,
        depth: request.body.depth,
        material: request.body.material,
        style: request.body.style,
        price: request.body.price,
        execute: request.body.execute
      },
      ar: {
        description: request.body.description_ar,
        height: request.body.height_ar,
        depth: request.body.depth_ar,
        material: request.body.material_ar,
        style: request.body.style_ar,
        price: request.body.price_ar,
        execute: request.body.execute_ar
      }
    },
    category_id: request.body.category_id,
    image: request.file.originalname ,
  });

  response.status(200).json(newProduct);
});



exports.getProduct = catchAsync(async (req, res, next) => {
  try {

    const productId = req.params.id;
    const lang = req.originalUrl.toLowerCase().includes('dashboard') ? null : req.headers.lang || 'en';
    const currency = req.headers.currency || 'EGP';

    const Setting = await Settings.findByPk(1);
    const product = await Product.findByPk(productId);

    if (!product) {
      return next(new AppError('لم يتم العثور على منتج', 404));
    }

    if(currency == "USD"){
      product.multilingualData.en.price = (product.multilingualData.en.price / Setting.exchangeRate).toFixed(2);
      product.multilingualData.ar.price = parseFloat(product.multilingualData.en.price).toLocaleString('ar-EG');
    }

    const relatedProducts = await Product.findAll({
      where: {
        category_id: product.category_id,
        id: { [Op.ne]: product.id }
      },
      limit: 3 
    });

    let modifiedRelatedProducts ;
    if(lang === 'en' || lang === 'ar') {
     modifiedRelatedProducts = relatedProducts.map(relatedProduct => {

      if(currency == "USD"){
        relatedProduct.multilingualData.en.price = (relatedProduct.multilingualData.en.price / Setting.exchangeRate).toFixed(2);
        relatedProduct.multilingualData.ar.price = parseFloat(relatedProduct.multilingualData.en.price).toLocaleString('ar-EG');
      }
        return {
          ...relatedProduct.get({ plain: true }),
          multilingualData: relatedProduct.multilingualData[lang]
        };
     
    });
  }
  

  let modifiedProduct;

  if(lang === "en" || lang === "ar")
  {
      modifiedProduct = {
      ...product.get({ plain: true }),
      multilingualData: product.multilingualData[lang]
    };
  }
  
    res.status(200).json({
      status: 'success',
      data: {
        product:  modifiedProduct ? modifiedProduct : product,
        relatedProducts: modifiedRelatedProducts ? modifiedRelatedProducts : relatedProducts
      }
    });
  } catch (error) {
    next(error); 
  }
});



exports.updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return next(new AppError('لم يتم العثور على المنتج', 404));
    }

    const updatedMultilingualData = { ...product.multilingualData };

    const category_id = req.body.category_id;
    if (category_id) {
      const category = await Category.findByPk(category_id);

      if (!category) {
        return next(new AppError('لم يتم العثور على الفئة', 404));
      }
    }

    if (req.body.name) {
      product.name = req.body.name;
    }

    if (req.file) {
      image = req.file.originalname || product.image;
      product.image = image;
    }

    if (req.body.description) {
      updatedMultilingualData.en.description = req.body.description;
    }
    if (req.body.description_ar) {
      updatedMultilingualData.ar.description = req.body.description_ar;
    }
    if (req.body.height) {
      updatedMultilingualData.en.height = req.body.height;
    }
    if (req.body.height_ar) {
      updatedMultilingualData.ar.height = req.body.height_ar;
    }
    if (req.body.depth) {
      updatedMultilingualData.en.depth = req.body.depth;
    }
    if (req.body.depth_ar) {
      updatedMultilingualData.ar.depth = req.body.depth_ar;
    }
    if (req.body.material) {
      updatedMultilingualData.en.material = req.body.material;
    }
    if (req.body.material_ar) {
      updatedMultilingualData.ar.material = req.body.material_ar;
    }
    if (req.body.price) {
      updatedMultilingualData.en.price = req.body.price;
    }
    if (req.body.price_ar) {
      updatedMultilingualData.ar.price = req.body.price_ar;
    }
    if (req.body.category_id) {
      product.category_id = req.body.category_id;
    }
    if (req.body.style) {
      updatedMultilingualData.en.style = req.body.style;
    } else {
      // If req.body.style is empty or not provided, remove the "style" property from updatedMultilingualData
      delete updatedMultilingualData.en.style;
    }
    
    if (req.body.style_ar) {
      updatedMultilingualData.ar.style = req.body.style_ar;
    } else {
      // If req.body.style_ar is empty or not provided, remove the "style" property from updatedMultilingualData
      delete updatedMultilingualData.ar.style;
    }

    if (req.body.execute) { 
      updatedMultilingualData.en.execute = req.body.execute;
    } else {
      delete updatedMultilingualData.en.execute;
    }

    if (req.body.execute) { 
      updatedMultilingualData.ar.execute = req.body.execute_ar;
    } else {
      delete updatedMultilingualData.ar.execute;
    }


    // Create a new product object with the updated data
    const updatedProduct = {
      ...product.toJSON(),
      multilingualData: updatedMultilingualData
    };

    // Update the product in the database
    await Product.update(updatedProduct, {
      where: { id }
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});


exports.deleteProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id; // Get the product ID from the request

  try {
    const product = await Product.findByPk(productId); // Find the product by its ID
    if (!product) {
      return next(new AppError('لم يتم العثور على المنتج', 404));
    }
    await product.destroy(); // Delete the product
    res.status(200).json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    next(error);
  }
});

exports.getProductsCategory = catchAsync(async (request, response, next) => {
  const lang = request.headers.lang || 'en';
  const currency = request.headers.currency || 'EGP';
  const categoryID = request.query.categoryID;
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const sort = request.query.sort || 'newest';
  const style = request.query.style || '';
  const material = request.query.material || '';
  const execute = request.query.execute || '';
  const Setting = await Settings.findByPk(1);
  minPrice = parseFloat(request.query.minPrice);
  maxPrice = parseFloat(request.query.maxPrice);


  const whereClause = {
    category_id: categoryID,
  };

  const preData = await Product.findAll({
    where: whereClause,
    attributes: ['id', 'multilingualData'],
  });

 if (currency == "USD") {
    minPrice = minPrice * Setting.exchangeRate;
    maxPrice = maxPrice * Setting.exchangeRate;
  }

  const priceCondition = {};
  if (!isNaN(minPrice) && !isNaN(maxPrice)) {
    priceCondition[Op.between] = [minPrice, maxPrice];
  } else if (!isNaN(minPrice)) {
    priceCondition[Op.gte] = minPrice;
  } else if (!isNaN(maxPrice)) {
    priceCondition[Op.lte] = maxPrice;
  }

  const andConditions = [];

  if (style) {
   andConditions.push({ [`multilingualData.${lang}.style`]: style });
  }

  if (material) {
   andConditions.push({ [`multilingualData.${lang}.material`]: material });
  }

  if (execute) {
    andConditions.push({ [`multilingualData.${lang}.execute`]: execute });
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
        order.push([Sequelize.literal(`CAST(json_unquote(json_extract(\`multilingualData\`, '$."en"."price"')) AS DECIMAL(10, 2))`), 'DESC']);
        break;
      case 'price_asec':
        order.push([Sequelize.literal(`CAST(json_unquote(json_extract(\`multilingualData\`, '$."en"."price"')) AS DECIMAL(10, 2))`), 'ASC']);
        break;
    default:
      order.push(['createdAt', 'DESC']);
  }

  const attributes = ['id', 'name', 'multilingualData', 'image','offer'];
  const { docs, pages, total } = await Product.paginate({
    where: {
      ...whereClause,
    [`multilingualData.en.price`]: priceCondition,
    },
    attributes,
    page,
    paginate: limit,
    order,
  });

  const data = await Promise.all (docs.map(async item => {

    let PriceAfterOffer = null;
    if(item.offer != 0)
    {
      price = item.multilingualData['en'].price;
      PriceAfterOffer = ( price - (price * item.offer / 100)).toFixed(2)
    }

    if(currency == "USD"){
      item.multilingualData.en.price = (item.multilingualData.en.price / Setting.exchangeRate).toFixed(2);
      item.multilingualData.ar.price = parseFloat(item.multilingualData.en.price).toLocaleString('ar-EG');
        if(PriceAfterOffer != null){
          PriceAfterOffer = (PriceAfterOffer / Setting.exchangeRate).toFixed(2);
        }
    }
    
    if (lang === 'ar' && PriceAfterOffer != null) {
      PriceAfterOffer = parseFloat(PriceAfterOffer).toLocaleString('ar-EG');
      item.offer = parseFloat(item.offer).toLocaleString('ar-EG');
    }

    return {
      id: item.id,
      name: item.name,
      image: item.image,
      depth:item.multilingualData[lang].depth,
      price:item.multilingualData[lang].price,
      style:item.multilingualData[lang].style,
      height:item.multilingualData[lang].height,
      material:item.multilingualData[lang].material,
      description:item.multilingualData[lang].description,
      PriceAfterOffer,
      offer:item.offer,
    };
  }));

  if(data.length ==0){
    return next(new AppError(`There's no products - لا يوجد منتج`, 400));
  }

  response.status(200).json({
    products: data,
    currentPage: page,
    totalPages: pages,
    totalProducts: total,
    styles: [...new Set(preData.map(item => item.multilingualData[lang].style))],
    materials: [...new Set(preData.map(item => item.multilingualData[lang].material))],
    execute: [...new Set(preData.map(item => item.multilingualData[lang].execute))],
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
    'id',
    'image',
    'name',
  ];
    
  const data = await Product.findAll({
    where: query,
    attributes: projection,
    limit: 6,
    });
  
  if (data.length === 0) {
    return next(new AppError(`There are no matched results for your search - لا يوجد منتج متطابق`, 400));
  }

  res.status(200).json(data);
});


exports.addOffer = catchAsync(async (req, res, next) => {
  const productIDs = req.body.products; // Assuming req.body.products is an array of product IDs
  const offer = req.body.offer;

  try {
    // Find all products by their IDs
    const products = await Product.findAll({
      where: {
        id: productIDs,
      },
    });

    if (!products || products.length === 0) {
      return next(new AppError('No products found', 404));
    }

    // Update the offer for each product
    for (const product of products) {
      product.offer = offer;
      await product.save();
    }

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

exports.getallOffers = catchAsync(async (req, res, next) => {
  try {
    const allOffers = await Product.findAll({
      attributes: ['offer'], // Specify the column you want to retrieve
      where: {
        offer: {
          [Op.gt]: 0,
        },
      },
      group: ['offer'], // Use the group option to group by the offer column
    });

    if (!allOffers || allOffers.length === 0) {
      return next(new AppError('No offers found', 404));
    }

    res.status(200).json(allOffers );
  } catch (error) {
    next(error);
  }
}

);


exports.deleteOffer = catchAsync(async (req, res, next) => {
  const offer = req.body.offer; // Assuming req.body.products is an array of product IDs

  try {
    // Find all products by their IDs
    const products = await Product.findAll({
      where: {
        offer: offer,
      },
    });

    if (!products || products.length === 0) {
      return next(new AppError('No products with that offer found', 404));
    }

    // Update the offer for each product
    for (const product of products) {
      product.offer = 0;
      await product.save();
    }

    res.status(200).json("Offer deleted successfully");
  } catch (error) {
    next(error);
  }
});

exports.getOfferProducts = catchAsync(async (req, res, next) => {

  const offer = req.params.value; 
  try {
    // Find all products by their IDs
    const products = await Product.findAll({
      where: {
        offer: offer,
      },
    });

    if (!products || products.length === 0) {
      return next(new AppError('No products with that offer found', 404));
    }

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

exports.PriceIncrease = catchAsync(async (request, response, next) => {
  
  const IncPercentage = parseFloat(request.body.percentage);
  const products = await Product.findAll();

  if (isNaN(IncPercentage)) {
    return response.status(400).json({ error: "يجب ادخال نسبه رقميه فقط" });
  }

  for (const product of products) {
    let currentPrice = parseFloat(product.multilingualData.en.price);

    if (!isNaN(currentPrice)) {
      const newPrice = currentPrice + (currentPrice * IncPercentage) / 100;

      const newPriceEn = newPrice.toFixed(2);;
      const newPriceAr = newPrice.toLocaleString('ar-EG', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

      const multilingualData = product.multilingualData;

      multilingualData.en.price = newPriceEn;
      multilingualData.ar.price = newPriceAr;

      await Product.update({"multilingualData" : multilingualData }, {where: { "id": product.id }} );
    }
  }

  return response.status(200).json({ message: "Updated" });
});

