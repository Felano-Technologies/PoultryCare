import mongoose from 'mongoose';

const flockSchema = new mongoose.Schema({
  flockName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  birdCount: {
    type: Number,
    required: true,
  },
  acquiredAt: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'sick', 'dead'],
    default: 'active'
  },  
  healthLogs: [
    {
      date: { type: Date, default: Date.now },
      type: { type: String, enum: ['healthy', 'sick', 'dead'], required: true },
      count: Number,
      remarks: String
    }
  ],
  feedLogs: [
    {
      date: { type: Date, default: Date.now },
      feedType: String,
      quantityKg: Number,
      remarks: String
    }
  ],
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Flock || mongoose.model('Flock', flockSchema);
