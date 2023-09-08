const sequelize = require("../utils/dbConfig");
const { DataTypes } = require('sequelize');

const Setting = sequelize.define('Setting', {
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
    exchangeRate: DataTypes.DECIMAL
}, {
    tableName: 'Setting',
    timestamps: false ,
    freezeTableName: true, 
    singular: 'Setting', 
});


Setting.beforeBulkCreate(() => {
    throw new Error('Only one instance of Setting can be created');
  });

module.exports = Setting;
