const Category = require('./CategoryModel');
const Product = require('./ProductModel');

Category.hasMany(Product, { foreignKey: 'category_id' });

Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = { Category, Product };
