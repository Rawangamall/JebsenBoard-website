const { Op } = require('sequelize');
const Settings= require('../Models/SettingModel');

const catchAsync = require("../utils/CatchAsync");

exports.getAll = catchAsync(async (req, res, next) => {

  const Setting = await Settings.findOne();
  res.status(200).json(Setting);

});

exports.Update = catchAsync(async (req, res, next) => {
  const updatedSettingData = req.body;
  const existingSetting = await Settings.findOne();
  const id=1;

  if (existingSetting) {
    const existingImagesCount = (existingSetting.images || []).length;

    if (req.files != undefined) {
      const newImages = req.files.map((file, index) => {
        return {
          index: existingImagesCount + index,
          filename: file.filename
        };
      });

      updatedSettingData.images = (existingSetting.images || []).concat(newImages);
    }

    // const MapLocation = existingSetting.mapLocation;
    
    if (updatedSettingData.mapLocation !== undefined || updatedSettingData.mapLocation) {
      console.log("inside", updatedSettingData.mapLocation);
      MapLocation.latitude = updatedSettingData.mapLocation.latitude;
      MapLocation.longitude = updatedSettingData.mapLocation.longitude;
    } 

    // Update the existingSetting with new data
    existingSetting.set({
      ...updatedSettingData,
      mapLocation: MapLocation
    })
     
       await Settings.update(updatedSettingData, {
        where: { id },
        returning: true, 
      });
 
      res.status(200).json({ message: ' تم التحديث!' });
    } else {
      res.status(404).json({ message: 'لم يتم التحديث!' });
    }
  });






exports.Delete = catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { index } = req.params;
  
      const Setting = await Settings.findByPk(id);
  
      if (!Setting) {
        return res.status(404).json({ message: 'Setting not found' });
      }
  
      if (!Array.isArray(Setting.images)) {
        return res.status(400).json({ message: 'Images data is invalid' });
      }
  
      const imageIndex = parseInt(index);
  
      if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= Setting.images.length) {
        return res.status(400).json({ message: 'Invalid image index' });
      }
  
      Setting.images.splice(imageIndex, 1);
      Setting.images = Setting.images.map((image, newIndex) => ({
        index: newIndex,
        filename: image.filename,
      }));

     await Settings.update({ images: Setting.images }, { where: { id } });

  
      res.status(200).json({ message: 'Image deleted successfully' });
    });