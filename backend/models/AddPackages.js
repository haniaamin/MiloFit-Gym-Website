const mongoose = require('mongoose');

const AddPackageSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: String,
  duration: String
});

module.exports = mongoose.model('AddPackage', AddPackageSchema);