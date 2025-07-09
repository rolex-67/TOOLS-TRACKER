const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  toolId: String,
  toolName: String,
  userId: String,
  requestedDays: Number,
  reason: String,
  status: {
    type: String,
    enum: ['pending', 'appointed', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Request || mongoose.model('Request', requestSchema);
