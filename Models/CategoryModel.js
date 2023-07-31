const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');


const categorySchema = new mongoose.Schema(
  {
   
    name: {
      en: String,
      ar: String
    },
    image: String
  },
  { timestamps: true }
);


categorySchema.plugin(mongoosePaginate);

//mapping
mongoose.model("category", categorySchema);
