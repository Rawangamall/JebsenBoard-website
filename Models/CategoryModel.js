const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);


const categorySchema = new mongoose.Schema(
  {
    _id: Number,
    name: {
      en: String,
      ar: String
    }
  },
  { timestamps: true }
);


categorySchema.plugin(AutoIncrement, { id: "category_id", inc_field: "_id" });

//mapping
mongoose.model("category", categorySchema);
