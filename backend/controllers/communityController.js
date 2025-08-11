import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
// @desc    Create a new post
// controllers/postController.js

const uploadBufferToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'mp3', 'wav', 'webm', 'webp'],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    // Get user name
    const user = await User.findById(userId).select('farmName name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const media = []; // Changed from mediaUrls to media array with type info

    // Handle images
    if (req.files.images) {
      for (const file of req.files.images) {
        const url = await uploadBufferToCloudinary(file.buffer, 'community_posts/images', 'image');
        media.push({
          url,
          type: 'image', // Explicitly store type
          publicId: url.split('/').pop().split('.')[0] // Optional: store Cloudinary public ID
        });
      }
    }

    // Handle videos
    if (req.files.videos) {
      for (const file of req.files.videos) {
        const url = await uploadBufferToCloudinary(file.buffer, 'community_posts/videos', 'video');
        media.push({
          url,
          type: 'video',
          publicId: url.split('/').pop().split('.')[0]
        });
      }
    }

    // Handle voice notes - changed resource_type to 'auto' or 'video' depending on your needs
    if (req.files.voiceNotes) {
      for (const file of req.files.voiceNotes) {
        const url = await uploadBufferToCloudinary(
          file.buffer, 
          'community_posts/voiceNotes', 
          'auto' // Changed from 'video' to 'auto' for better audio handling
        );
        media.push({
          url,
          type: 'audio', // Changed from video to audio
          publicId: url.split('/').pop().split('.')[0]
        });
      }
    }

    // Save post with complete media information
    const post = await Post.create({
      content,
      media, // Now includes both URL and type
      author: {
        userId,
        name: user.farmName || user.name
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};



// @desc    Update a post
export const updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verify the author matches the current user
    if (post.author.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    post.content = content || post.content;
    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.error('Update Post Error:', error);
    res.status(500).json({ 
      message: 'Failed to update post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verify the author matches the current user
    if (post.author.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Comment.deleteMany({ post: post._id });
    await Post.deleteOne({ _id: post._id });

    res.json({ message: 'Post and its comments removed successfully' });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({ 
      message: 'Failed to delete post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add comment to a post with media support
// @route   POST /api/community/posts/:postId/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const text = req.body.text || req.body.content || '';
    const { postId } = req.params;
    const userId = req.user._id;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get user info
    const user = await User.findById(userId).select('farmName name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const media = [];

    // Handle comment images
    if (req.files.images) {
      for (const file of req.files.images) {
        const url = await uploadBufferToCloudinary(file.buffer, 'community_comments/images', 'image');
        media.push({
          url,
          type: 'image',
          publicId: url.split('/').pop().split('.')[0]
        });
      }
    }

    // Handle comment videos
    if (req.files.videos) {
      for (const file of req.files.videos) {
        const url = await uploadBufferToCloudinary(file.buffer, 'community_comments/videos', 'video');
        media.push({
          url,
          type: 'video',
          publicId: url.split('/').pop().split('.')[0]
        });
      }
    }

    // Handle comment voice notes
    if (req.files.voiceNotes) {
      for (const file of req.files.voiceNotes) {
        const url = await uploadBufferToCloudinary(file.buffer, 'community_comments/voiceNotes', 'auto');
        media.push({
          url,
          type: 'audio',
          publicId: url.split('/').pop().split('.')[0]
        });
      }
    }

    // Validate that either text or media is provided
    if (!text && media.length === 0) {
      return res.status(400).json({ message: 'Comment must contain either text or media' });
    }

    // Create the comment
    const comment = await Comment.create({
      text,
      media,
      author: {
        userId,
        name: user.farmName || user.name
      },
      post: postId
    });

    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      message: 'Failed to add comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get comments for a specific post (updated to include media)
// @route   GET /api/community/posts/:postId/comments
// @access  Public
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Verify post exists
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found'
      });
    }

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    res.status(200).json({
      success: true,
      count: comments.length,
      postId,
      data: comments
    });
  } catch (error) {
    console.error('Get Post Comments Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve post comments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};