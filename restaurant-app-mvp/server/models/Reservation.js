const mongoose = require('mongoose');
module.exports = mongoose.model('Reservation', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  date: { type: Date, required: true, index: true }, time: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1, max: 12 },
  contactName: { type: String, required: true, trim: true }, phone: { type: String, required: true, match: /^03\d{2}-?\d{7}$/ },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Cancelled'], default: 'Pending' },
  notes: { type: String, default: '', maxlength: 500 }
}, { timestamps: true, versionKey: false }));
