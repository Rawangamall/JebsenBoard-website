const { DataTypes } = require('sequelize');
const sequelize = require('../utils/dbConfig');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = sequelize.define('users', {
  firstName:DataTypes.STRING,
  lastName:DataTypes.STRING,
  phoneNumber:{type : DataTypes.STRING , unique: true},
  role:DataTypes.STRING ,
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

User.prototype.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


User.prototype.createPasswordRandomToken = async function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.code = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min from now

  await this.save(); // Save the changes to the database

  return resetToken;
};

module.exports = User;
