const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);


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

// Schema.plugin(AutoIncrement, { id: "product_id", inc_field: "_id" });

//mapping
mongoose.model("product", Schema);
