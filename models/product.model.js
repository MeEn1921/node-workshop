const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, unique: true },
  price: { type: String },
  quantity: { type: Number },
}, {
    timestamps: true
});

module.exports = mongoose.model('product', productSchema)