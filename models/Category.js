const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
  profile: String // just the filename
});

module.exports = mongoose.model('Category', categorySchema);
