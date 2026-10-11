const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: '', maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: ['Starters', 'Mains', 'Desserts', 'Drinks'] },
  image: { type: String, default: '' }, isSpecial: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });
schema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('MenuItem', schema);
