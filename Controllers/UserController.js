const mongoose = require("mongoose");
require("./../Models/UserModel");
const UserSchema = mongoose.model("user");

const bcrypt = require("bcrypt");
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/appError");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

exports.addUser = CatchAsync(async (request, response, next) => {

    const hash = await bcrypt.hash(request.body.password, salt);
      const user = new UserSchema({
        'firstName.en': request.body.firstName,
        'firstName.ar': request.body.firstName_ar,
        'lastName.en': request.body.lastName,
        'lastName.ar': request.body.lastName_ar,
        email: request.body.email,
        password: hash,
        image:"default.jpg",
        'phoneNumber.en': request.body.phoneNumber,
        'phoneNumber.ar': request.body.phoneNumber_ar,
        'role.en': request.body.role,
        'role.ar': request.body.role_ar
      });
  
      const data = await user.save();
      response.status(201).json(data);
 
    
  });

  exports.getallUsers = CatchAsync(async (request, response, next) => {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
  
    const options = {
      page,
      limit
    };
  
    const result = await UserSchema.paginate({}, options);
  
    response.status(200).json(result);
  });

exports.getUser = CatchAsync(async (request, response, next) => {

  const id = request.params._id;
  const user = await UserSchema.findById(id)

  if(!user){
    return next(new AppError(`User not found`, 401));
  }
    
  response.status(200).json(user);
     
  });

  exports.editUser = CatchAsync(async (request, response, next) => {
    const id = request.params._id;

    if (request.body.password) {

      const hash = await bcrypt.hash(request.body.password, salt);
      request.body.password = hash;
    }
  
    const user = await UserSchema.findByIdAndUpdate(id, {
      'firstName.en': request.body.firstName,
      'firstName.ar': request.body.firstName_ar,
      'lastName.en': request.body.lastName,
      'lastName.ar': request.body.lastName_ar,
      email: request.body.email,
      password: request.body.password,
      'phoneNumber.en': request.body.phoneNumber,
      'phoneNumber.ar': request.body.phoneNumber_ar,
      'role.en': request.body.role,
      'role.ar': request.body.role_ar,
    });

    if(!user){
      return next(new AppError(`User not found`, 401));
    }
    
    response.status(200).json(user);
  });
  
exports.delUser = CatchAsync(async (request, response, next) => {
  const id = request.params._id;
  const user = await UserSchema.findByIdAndDelete(id);

  if(!user){
    return next(new AppError(`User not found`, 401));
  }
  
  response.status(200).json(user);
}); 