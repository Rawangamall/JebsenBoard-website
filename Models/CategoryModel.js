
const { DataTypes } = require("sequelize");
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

module.exports = Category;

