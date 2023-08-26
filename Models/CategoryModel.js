
const { DataTypes } = require("sequelize");
const SequelizePaginate = require('sequelize-paginate');
const sequelize = require("../utils/dbConfig");

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

SequelizePaginate.paginate(Category);
module.exports = Category;

