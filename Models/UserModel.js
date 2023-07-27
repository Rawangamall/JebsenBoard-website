const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoosePaginate = require('mongoose-paginate-v2');

//create schema object
const validateEmail = function (email) {
  const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  return regex.test(email);
};

const schema = new mongoose.Schema({
  firstName: {
    en: String,
    ar: String
  },
  lastName: {
    en: String,
    ar: String
  },
  email: {
    type: String,
    required : true,
    validate: [validateEmail, "invalid email"],
    unique: true,
  },
  password: { type: String, select: false },
  image:{ type : String , default:"default.jpg"},
  role: {
    en: { type: String ,default:"employee", required : true},
    ar: { type: String ,default:"موظف", required : true},
  },
  phoneNumber: { 
  en: { type: String , unique : true},
  ar: { type: String , unique : true}
  },
  code: String,
  passwordResetExpires: Date,
}
,{ timestamps: true});

schema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

schema.methods.createPasswordRandomToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.code = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 min

  return resetToken;
};

schema.plugin(mongoosePaginate);

//mapping
mongoose.model("user", schema);