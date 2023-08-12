const { DataTypes } = require('sequelize');
const sequelize = require('../utils/dbConfig');

const User = sequelize.define('users', {
  multilingualData: {
    type: DataTypes.JSON, 
    allowNull: false,
    defaultValue: {},  
  }  ,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Invalid email format'
      }
    },
    unique: true
  },
  password: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, defaultValue: 'default.jpg' },
  code: DataTypes.STRING,
  passwordResetExpires: DataTypes.DATE
}, {
  timestamps: true,
});

module.exports = User;
