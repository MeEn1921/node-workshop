const mongoose = require("mongoose");
const { Schema } = mongoose;

const ordersSchema = new Schema(
  {
    name: { type: String, unique: true },
    quantity: { type: Number },
    productid: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    productname: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", ordersSchema);
