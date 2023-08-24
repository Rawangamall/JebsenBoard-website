const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");
const Product = require("./ProductModel"); 

const Category = sequelize.define(
  "category",
  {
   multilingualData: {
      
      //name,letter [en,ar]
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    image: { type: DataTypes.STRING, defaultValue: "default.jpg" },
  },
  { timestamps: true }
);

Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

module.exports = Category;

   
   


