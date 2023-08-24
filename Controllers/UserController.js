const User = require("./../Models/UserModel");

const { Op } = require('sequelize');
const bcrypt = require("bcrypt");
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/appError");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

exports.addUser = CatchAsync(async (request, response, next) => {

    const hash = await bcrypt.hash(request.body.password, salt);

    const newUser = await User.create({
      firstName:request.body.firstName,
      lastName:request.body.lastName,
      phoneNumber:request.body.phoneNumber ,
      role:request.body.role,
      email: request.body.email,
      password:hash,
      image:"default.jpg"
    });

      response.status(201).json(newUser);
  });

  
  exports.getAllUsers = CatchAsync(async (request, response, next) => {

      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 10;
      const lang = request.headers.lang || "ar";
      const searchKey = request.query.searchkey || "";
  
      const whereClause = searchKey ? {
        [Op.or]: [
          { firstName: { [Op.like]: `%${searchKey}%` } },
          { lastName: { [Op.like]: `%${searchKey}%` } },
          { email: { [Op.like]: `%${searchKey}%` } },
        ],
      } : {};
  
      const offset = (page - 1) * limit;
      
      const attributes = ['id', 'firstName' , 'lastName', 'role', 'email','phoneNumber', 'image', 'updatedAt', 'createdAt'];
  
      const users = await User.findAll({
        where: whereClause,
        attributes,
        limit,
        offset,
      });

      response.status(200).json(users);
  }
);

exports.getUser = CatchAsync(async (request, response, next) => {

  const id = request.params._id;

  const attributes = ['id', 'firstName' , 'lastName', 'role', 'email','phoneNumber', 'image', 'updatedAt', 'createdAt'];
  const user = await User.findByPk(id, { attributes });

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
  
    const user = await User.findByPk(id);

    if(!user){
      return next(new AppError(`User not found`, 401));
    }

    const Updateduser = await user.update({
      firstName:request.body.firstName,
      lastName:request.body.lastName,
      phoneNumber:request.body.phoneNumber ,
      role:request.body.role,
      email: request.body.email,
    //  password:hash,
      password: request.body.password,
      image : request.imageName
    });

    response.status(200).json(Updateduser);
  });
  
exports.delUser = CatchAsync(async (request, response, next) => {
  const id = request.params._id;

  const user = await User.findByPk(id);

  if (!user) {
    return next(new AppError(`User not found`, 401));
  }

  await user.destroy();

  response.status(200).json({ message: 'User deleted successfully' });  
}); 