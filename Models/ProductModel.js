const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConfig");

const Product = sequelize.define(
  "Product",
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
          model: 'Category',
          key: 'id'
        }},
      image: DataTypes.STRING
     
    },
    { timestamps: true }
  );

  module.exports = Product;
