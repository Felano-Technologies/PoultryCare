import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { 
    type: String, 
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  media: [{
    url: {
      type: String,
      required: [true, 'Media URL is required']
    },
    type: {
      type: String,
      required: [true, 'Media type is required'],
      enum: {
        values: ['image', 'video', 'audio'],
        message: 'Media type must be image, video, or audio'
      }
    },
    publicId: {
      type: String,
      required: false // Optional but recommended
    }
  }],
  author: {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'User ID is required'] 
    },
    name: { 
      type: String, 
      required: [true, 'Author name is required'] 
    }
  },
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: [true, 'Post reference is required'] 
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better query performance
commentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;