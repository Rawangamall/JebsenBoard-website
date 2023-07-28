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
    const lang = request.headers.lang || "en";
    const searchKey = request.query.searchkey || "";

    let query = {};

    if (searchKey) {
      const objectId = mongoose.Types.ObjectId.isValid(searchKey)
      ? mongoose.Types.ObjectId(searchKey)
      : null;
    
      const regexSearchKey = new RegExp(searchKey, "i");
      query = {
          
            $or: [
              { _id: objectId },
              { 'firstName.en': regexSearchKey },
              { 'lastName.en': regexSearchKey },
              { 'firstName.ar': regexSearchKey },
              { 'lastName.ar': regexSearchKey },
              { email: regexSearchKey },
            ],
          
      };
    }

    let projection = {
      "image": 1,
      "email": 1,
    };
    
    if (lang === "en") {
      projection["firstName.en"] = 1;
      projection["lastName.en"] = 1;
      projection["role.en"] = 1;
      projection["phoneNumber.en"] = 1;
    } else {
      projection["firstName.ar"] = 1;
      projection["lastName.ar"] = 1;
      projection["role.ar"] = 1;
      projection["phoneNumber.ar"] = 1;
    }

    const options = {
      page,
      limit,
      select: projection 
    };
  
    const result = await UserSchema.paginate(query, options);
  
    response.status(200).json(result);
  });

exports.getUser = CatchAsync(async (request, response, next) => {

  const id = request.params._id;
  const lang = request.headers.lang || "en";

  let projection = {
    "image": 1,
    "email": 1,
  };
  
  if (lang === "en") {
    projection["firstName.en"] = 1;
    projection["lastName.en"] = 1;
    projection["role.en"] = 1;
    projection["phoneNumber.en"] = 1;
  } else {
    projection["firstName.ar"] = 1;
    projection["lastName.ar"] = 1;
    projection["role.ar"] = 1;
    projection["phoneNumber.ar"] = 1;
  }

  const user = await UserSchema.findById(id).select(projection)

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