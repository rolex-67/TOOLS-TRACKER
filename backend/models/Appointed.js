const mongoose = require('mongoose');

const appointedSchema = new mongoose.Schema({
  toolId: String,
  toolName: String,
  userId: String,
  quantity: Number,
  requestedDays: Number,
  reason: String,
  status: {
    type: String,
    enum: ['appointed', 'approved'],
    default: 'appointed'
  },
  appointedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Appointed || mongoose.model('Appointed', appointedSchema);
