
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
        model: 'Category', // Use the imported Category model
        key: 'id'
      }
    },
    image: DataTypes.STRING,
    offer: DataTypes.INTEGER
  },
  { timestamps: true }
);

// Product.associate = function (models) {
//   Product.belongsTo(models.CategoryModel, { foreignKey: 'category_id', as: 'category' });
// };

  SequelizePaginate.paginate(Product);

  module.exports = Product;
