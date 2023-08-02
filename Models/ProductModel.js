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
        en:  Number,
        ar: String
      }
      ,
      depth:{
        en: Number,
        ar: String
      }
      ,
      material: {
        en: String,
        ar: String
      },
      style:
      {
        en: String,
        ar: String
      },  

      price: {
        en: Number,
        ar: String
      },
      category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      },
      image: { type: String, default: "default.jpg"}
     
    },
    { timestamps: true }
  );

  Schema.plugin(mongoosePaginate);

//mapping
mongoose.model("product", Schema);
