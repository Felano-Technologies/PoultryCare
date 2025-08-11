import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: { 
    type: String, 
    trim: true,
    maxlength: [5000, 'Post cannot exceed 5000 characters']
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
