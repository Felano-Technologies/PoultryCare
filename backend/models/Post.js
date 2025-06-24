import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [5000, 'Post cannot exceed 5000 characters']
  },
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
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Post = mongoose.model('Post', postSchema);
export default Post;