import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
// @desc    Create a new post
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    
    const user = await User.findById(req.user._id).select('farmName');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = new Post({
      content,
      author: {
        userId: req.user._id,
        name: user.farmName
      }
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ 
      message: 'Failed to create post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

// @desc    Get comments for a specific post
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


// @desc    Add comment to a post
// @route   POST /api/community/posts/:postId/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = new Comment({
      text,
      author: req.user._id,
      authorName: user.farmName,  // Store name directly
      post: post._id
    });

    const savedComment = await comment.save();
    
    // Add comment to post and save
    post.comments.push(savedComment._id);
    await post.save();

    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
