import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  type: {
    type: String,
    enum: ['vaccination', 'health-check', 'feed', 'weather', 'system'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedFlock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flock'
  },
  dueDate: {
    type: Date,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for frequently queried fields
notificationSchema.index({ farm: 1, isRead: 1, dueDate: 1 });

// Middleware to format message before save
notificationSchema.pre('save', function(next) {
  if (this.isModified('type') || this.isModified('dueDate')) {
    this.message = this.generateMessage();
  }
  next();
});

// Instance method to generate notification message
notificationSchema.methods.generateMessage = function() {
  const dateStr = this.dueDate.toLocaleDateString();
  switch(this.type) {
    case 'vaccination':
      return `Vaccination due for flock on ${dateStr}`;
    case 'health-check':
      return `Health check overdue since ${dateStr}`;
    case 'feed':
      return `Feed order needs replenishment by ${dateStr}`;
    default:
      return this.message;
  }
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;