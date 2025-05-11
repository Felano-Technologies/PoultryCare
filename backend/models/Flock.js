const mongoose = require('mongoose');

const FlockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  flockName: String,
  breed: String,
  birdCount: Number,
  acquiredAt: Date,
  notes: String,
});

module.exports = mongoose.model('Flock', FlockSchema);
