const { DataTypes } = require("sequelize");
const SequelizePaginate = require('sequelize-paginate');
const sequelize = require("../utils/dbConfig");

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
          model: 'Category',
          key: 'id'
        }},
      image: DataTypes.STRING
     
    },
    { timestamps: true }
  );

  SequelizePaginate.paginate(Product);
  module.exports = Product;
