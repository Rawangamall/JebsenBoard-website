const Category = require("../Models/CategoryModel");
const Product = require("../Models/ProductModel");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");


const path=require("path");
const fs = require('fs');



exports.getAll = catchAsync(async (req, res, next) => {

    const categories = await Category.findAll({});
  if(!categories) return next(new AppError('No category found', 404))
  res.status(200).json(categories);
});

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   const options = {
//     page,
//     limit
//   };

//   // Aggregate to get categories and their product counts in a single query
//   const categoriesWithCounts = await CategorySchema.aggregate([
//     {
//       $lookup: {
//         from: 'product', // Replace 'products' with the name of your products collection
//         localField: 'id',
//         foreignField: 'category_id',
//         as: 'products'
//       }
//     },
//     {
//       $project: {
//         _id: 1,
//         name: 1,
//         description: 1,
//         image: 1,
//         // Add other fields from your CategorySchema that you want to include
//         productCount: { $size: '$products' }
//       }
//     },
//     { $skip: (page - 1) * limit },
//     { $limit: limit }
//   ]);

//   if (categoriesWithCounts.length === 0) {
//     return next(new AppError('No category found', 404));
//   }

//   res.status(200).json(categoriesWithCounts);
// });


exports.addCategory = catchAsync(async (request, response, next) => {
console.log("categoryyy dataa",request.body);
  const newCategory = await Category.create({
    multilingualData: {
      en: {
        name: request.body.name
      },
      ar: {
        name: request.body.name_ar
      },
    },
    image: request.body.name + ".jpg"
  });
 
    response.status(201).json(newCategory);
  
});

 exports.getCategory = catchAsync(async (req, res, next) => {
  const lang = req.headers.lang || "ar";
  const attributes = ['id', 'multilingualData', 'image', 'updatedAt', 'createdAt'];//, 'letter'
  const id = req.params.id;

  const category = await Category.findByPk(id, { attributes });
  if(!category) return next(new AppError('No category found', 404))

  const { multilingualData, image ,letter, updatedAt ,createdAt} = category.toJSON();
  
  const { name, description, height, depth, material, style, price } = lang === 'en' ? multilingualData.en : multilingualData.ar;
  const categoryData = {
    name,
    description,
    height,
    depth,
    material,
    style,
    price, 
    image,
    // letter,
    updatedAt,
    createdAt 
  };

  // const productsCount = await Product.count({
  //   where: { categoryId: id }
  // });

  res.status(200).json({
    status: "success",
    data: {
      categoryData, //productsCount
  }});
}
);

// exports.updateCategory = catchAsync(async (req, res, next) => {
 
//   const attributes = ['id', 'multilingualData', 'image', 'letter', 'updatedAt', 'createdAt'];
//   const id = req.params.id;

//   const category = await Category.findByPk(id, { attributes });
  
//     if(!category) return next(new AppError('No category found', 404))
//     console.log("category",category);
//     const imageExist = req.file || "undefined";
//     if(req.body.name && imageExist == "undefined")
//     {
//       const previousFileName =  category.image;
//       const newFileName = req.body.name+".jpg";
//       const directoryPath = path.join(__dirname,"..","Core","images","Category"); // Change this to your image upload directory

//       const previousFilePath = path.join(directoryPath, previousFileName);
//       const newFilePath = path.join(directoryPath, newFileName);

//        fs.rename(previousFilePath, newFilePath, (err) => {    
//          if (err) {
//                 console.error('Error renaming the image:', err);
//           } else {
//                 console.log('Image file renamed successfully!');
//                 }});
//     }

//     if(req.body.name)
//     {
//       category.name.en = req.body.name;
//       category.image = req.body.name+".jpg";
//     }
//     if(req.body.name_ar)
//     {
//       category.name.ar = req.body.name_ar;
//     }
//     if(req.file)
//     {
//       console.log(req.body.name || category.name.en);
//       image= req.body.name || category.name.en;
//       category.image =image+".jpg";
//     }


//     const updatedDocument = await category.save();

     
//     res.status(200).json(updatedDocument);
     
    
//   }
// );

// exports.deleteCategory = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   console.log(id);
//   const deleted = await CategorySchema.findByIdAndRemove(id);
//   console.log(deleted);
//   if(!deleted) return next(new AppError('No category found', 404))
  
//   res.status(200).json("deleted");
// }
// );
