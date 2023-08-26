const Category = require('./CategoryModel');
const Product = require('./ProductModel');

Category.hasMany(Product, { foreignKey: 'category_id' });

Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = { Category, Product };


//code to fetch category's products -in product controller-

// const categoryWithProducts = await Category.findByPk(categoryID, {
//     include: Product 
//   });
  
//   const productsDataValues = categoryWithProducts.products.map(product => product.dataValues);
  