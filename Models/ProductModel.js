const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);


const Schema = new mongoose.Schema(
    {
      _id: Number,
      name: {
        en: String,
        ar: String
      },
      description: {
        en: String,
        ar: String
      },
      price: {
        en: Number,
        ar: Number
      },
      category_id: {
        type: Number,
        ref: 'Category'
      },
      main_image: {
        en: String,
        ar: String
      },
      slideshow_images: [
        {
          image: {
            en: String,
            ar: String
          },
          caption: {
            en: String,
            ar: String
          }
        }
      ]
    },
    { timestamps: true }
  );

Schema.plugin(AutoIncrement, { id: "product_id", inc_field: "_id" });

//mapping
mongoose.model("product", Schema);
