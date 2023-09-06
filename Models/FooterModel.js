const { json } = require("body-parser");
const sequelize = require("../utils/dbConfig");
const { DataTypes } = require('sequelize');

const FooterInfo = sequelize.define('FooterInfo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: {
              msg: 'Invalid email format'
            }
          }
        },
    location_en: DataTypes.STRING,
    location_ar: DataTypes.STRING,
    phone_1: DataTypes.STRING,
    phone_2: DataTypes.STRING,
    facebooklink: DataTypes.STRING,
    instagramlink_1: DataTypes.STRING,
    instagramlink_2: DataTypes.STRING,
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
}, {
    tableName: 'FooterInfo',
    timestamps: false ,
    freezeTableName: true, 
    singular: 'FooterInfo', 
});


FooterInfo.beforeBulkCreate(() => {
    throw new Error('Only one instance of Footer can be created');
  });

module.exports = FooterInfo;
