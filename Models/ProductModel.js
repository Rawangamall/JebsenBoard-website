
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");
// const { Category } = require("./CategoryModel"); // Import the Category model

const Product = sequelize.define(
  "products",
  {
    name: DataTypes.STRING,
    multilingualData: {
      
      //description,height,depth,material,style,price ,[en,ar]
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    category_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Category', // Use the imported Category model
        key: 'id'
      }
    },
    image: DataTypes.STRING
  },
  { timestamps: true }
);

Product.associate = function (models) {
  Product.belongsTo(models.CategoryModel, { foreignKey: 'category_id', as: 'category' });
};

module.exports = Product;