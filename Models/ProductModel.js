const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = new mongoose.Schema(
    {
      name: {
        en: String,
        ar: String
      },
      description: {
        en: String,
        ar: String
      },
      height: {
        en: String,
        ar: String
      }
      ,
      depth:{
        en: String,
        ar: String
      }
      ,
      material: {
        en: String,
        ar: String
      },
      price: {
        en: Number,
        ar: String
      },
      category_id: {
        type: Number,
        ref: 'Category'
      },
      main_image: { type: String, default: "default.jpg"},
      slideshow_images:
        [
          { type: String }
        ]
    },
    { timestamps: true }
  );

  Schema.plugin(mongoosePaginate);

//mapping
mongoose.model("product", Schema);
