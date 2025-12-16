
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  price: { type: Number, required: true },
  packageName: { type: String, required: true },
  method: { type: String, required: true },
  startDate: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
