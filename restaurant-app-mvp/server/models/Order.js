const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{ menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true }, name: { type: String, required: true }, unitPrice: { type: Number, required: true, min: 0 }, quantity: { type: Number, required: true, min: 1, max: 50 }, note: { type: String, default: '', maxlength: 250 } }],
  subtotal: { type: Number, required: true, min: 0 }, serviceCharge: { type: Number, required: true, min: 0 }, tax: { type: Number, required: true, min: 0 }, discount: { type: Number, default: 0, min: 0 }, total: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['Dine-in', 'Takeaway'], required: true }, table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' }, pickupTime: String,
  promoCode: { type: String, default: '' }, status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'], default: 'Pending' }
}, { timestamps: true, versionKey: false });
module.exports = mongoose.model('Order', orderSchema);
