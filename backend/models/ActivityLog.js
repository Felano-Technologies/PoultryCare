import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  flock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flock'
  },
  activityType: {
    type: String,
    required: true,
    enum: [
      'Vaccination', 
      'Treatment', 
      'Feed Change', 
      'Health Check',
      'Mortality',
      'Egg Collection',
      'Cleaning',
      'Maintenance',
      'Other'
    ]
  },
  details: {
    type: String,
    required: true,
    maxlength: 1000
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedDocument: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedDocumentModel'
  },
  relatedDocumentModel: {
    type: String,
    enum: ['Vaccination', 'HealthLog', 'FeedLog', 'Flock']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimized queries
activityLogSchema.index({ farm: 1, createdAt: -1 });
activityLogSchema.index({ flock: 1 });
activityLogSchema.index({ activityType: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;