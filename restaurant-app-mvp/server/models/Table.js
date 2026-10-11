const mongoose = require('mongoose');
module.exports = mongoose.model('Table', new mongoose.Schema({
  label: { type: String, required: true, unique: true, trim: true },
  seats: { type: Number, required: true, min: 1, max: 20 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false }));
