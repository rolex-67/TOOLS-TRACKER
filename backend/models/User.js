const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'User', 'Toolskeeper'], default: 'User' }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
