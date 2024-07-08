const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, unique: true },
  password: { type: String },
  email: { type: String, unique: true },
  Approved: { type: Boolean, default: false },
  isadmin: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', userSchema)