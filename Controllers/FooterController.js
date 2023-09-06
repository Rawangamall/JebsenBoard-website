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
    
    const existingImagesCount = (footer.images || []).length;
    const newImages = req.files?.map((file, index) => {
      return {
        index: existingImagesCount + index,
        filename: file.filename
      };
    });

    updatedFooter.images = (footer.images || []).concat(newImages);

    await footer.update(updatedFooter);
    res.status(200).json({ message: 'تم تحديث البيانات' });
  } else {
    res.status(404).json({ message: 'لم يتم التحديث!' });
  }
});


exports.Delete = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { index } = req.params;
  
      const footer = await Footer.findByPk(id);
  
      if (!footer) {
        return res.status(404).json({ message: 'Footer not found' });
      }
  
      if (!Array.isArray(footer.images)) {
        return res.status(400).json({ message: 'Images data is invalid' });
      }
  
      const imageIndex = parseInt(index);
  
      if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= footer.images.length) {
        return res.status(400).json({ message: 'Invalid image index' });
      }
  
      footer.images.splice(imageIndex, 1);
      footer.images = footer.images.map((image, newIndex) => ({
        index: newIndex,
        filename: image.filename,
      }));

     await Footer.update({ images: footer.images }, { where: { id } });

  
      res.status(200).json({ message: 'Image deleted successfully' });
    });