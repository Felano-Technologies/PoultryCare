import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Author is required'] 
  },
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: [true, 'Post reference is required'] 
  },
  authorName: {  // Add this for easier display without population
    type: String,
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for better query performance
commentSchema.index({ post: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;