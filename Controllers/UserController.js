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
      multilingualData: {
        en: {
          firstName:request.body.firstName,
          lastName:request.body.lastName,
          phoneNumber:request.body.phoneNumber ,
          role:request.body.role
        },
        ar: {
          firstName:request.body.firstName_ar,
          lastName:request.body.lastName_ar,
          phoneNumber:request.body.phoneNumber_ar ,
          role:request.body.role_ar
        },
      },
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
          { 'multilingualData.en.firstName': { [Op.like]: `%${searchKey}%` } },
          { 'multilingualData.en.lastName': { [Op.like]: `%${searchKey}%` } },
          { 'multilingualData.ar.firstName': { [Op.like]: `%${searchKey}%` } },
          { 'multilingualData.ar.lastName': { [Op.like]: `%${searchKey}%` } },
          { email: { [Op.like]: `%${searchKey}%` } },
        ],
      } : {};
  
      const offset = (page - 1) * limit;
      
      const attributes = ['id', 'multilingualData', 'email', 'image', 'updatedAt', 'createdAt'];
  
      const users = await User.findAll({
        where: whereClause,
        attributes,
        limit,
        offset,
      });
  
      const usersWithTranslations = users.map(user => {
        const { multilingualData, ...userData } = user.toJSON();
        const { firstName, lastName, phoneNumber, role } = lang === 'en' ? multilingualData.en : multilingualData.ar;
    
        return {
          firstName,
          lastName,
          phoneNumber,
          role,
          ...userData,
        };
      });

      response.status(200).json(usersWithTranslations);
  }
);

exports.getUser = CatchAsync(async (request, response, next) => {

  const id = request.params._id;
  const lang = request.headers.lang || "ar";

  const attributes = ['id', 'multilingualData', 'email', 'image', 'updatedAt', 'createdAt'];
  const data = await User.findByPk(id, { attributes });

  if(!data){
    return next(new AppError(`User not found`, 401));
  }

  const { multilingualData, ...userData } = data.toJSON();
  const { firstName, lastName, phoneNumber, role } = lang === 'en' ? multilingualData.en : multilingualData.ar;
  
  const user = {
    ...userData,
    firstName,
    lastName,
    phoneNumber,
    role,
  };

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
      'multilingualData.en.firstName': request.body.firstName,
      'multilingualData.ar.firstName.ar': request.body.firstName_ar,
      'multilingualData.en.lastName': request.body.lastName,
      'multilingualData.ar.lastName': request.body.lastName_ar,
      email: request.body.email,
      password: request.body.password,
      'multilingualData.en.phoneNumber': request.body.phoneNumber,
      'multilingualData.ar.phoneNumber': request.body.phoneNumber_ar,
      'multilingualData.en.role': request.body.role,
      'multilingualData.ar.role': request.body.role_ar,
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