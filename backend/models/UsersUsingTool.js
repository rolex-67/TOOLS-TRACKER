const mongoose = require('mongoose');

const usersUsingToolSchema = new mongoose.Schema({
  toolId: String,
  toolName: String,
  userId: String,
  appointedAt: {
    type: Date,
    default: Date.now
  },
  requestedDays: Number,
  returnDate: Date,
  actualReturnDate: Date, // ✅ added
  reason: String,
  condition: String,
  status: {
    type: String,
    enum: ['In Use', 'Closed'],
    default: 'In Use'
  }
});

module.exports = mongoose.models.UsersUsingTool || mongoose.model('UsersUsingTool', usersUsingToolSchema);
