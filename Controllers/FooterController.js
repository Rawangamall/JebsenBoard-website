const { Op } = require('sequelize');
const Footer= require('./../Models/FooterModel');

const catchAsync = require("./../utils/CatchAsync");

exports.getAll = catchAsync(async (req, res, next) => {

    const footer = await Footer.findOne();
    res.status(200).json(footer);

});

exports.Update = catchAsync(async (req, res, next) => {

    const updatedFooter = req.body; 

    const footer = await Footer.findOne(); 

    if (footer) {
      await footer.update(updatedFooter); 
      res.status(200).json({ message: 'تم تحديث البيانات' });
    } else {
      res.status(404).json({ message: 'لم يتم التحديث!' });
    }

});