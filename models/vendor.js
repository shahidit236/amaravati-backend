const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String, // ➕ added
  category: String,
  location: String,
  latitude: String,
  longitude: String,
  profileImage: String, // just filename
  status: {
    type: String,
    enum: ['Active', 'Blocked'],
    default: 'Active',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);
