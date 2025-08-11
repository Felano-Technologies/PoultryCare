import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Plus, User, Mic, Image, Video, X, Send, Download, Play, Pause } from "lucide-react";
import {
  getForumPosts,
  createForumPostWithMedia,
  updateForumPost,
  deleteForumPost,
  getForumComments,
  addCommentWithMedia,
  uploadCommentMedia
} from "../services/api";
import { toast } from "react-toastify";
import AudioPlayer from "./AudioPlayer";

const ForumComponent = () => {
  const [forumPosts, setForumPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState({});
  const [postMedia, setPostMedia] = useState({ images: [], videos: [], voiceNotes: null });
  const [commentMedia, setCommentMedia] = useState({});
  const [recordingState, setRecordingState] = useState({
    type: null,
    commentId: null
  });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const postFileInputRef = useRef(null);
  const commentFileInputRefs = useRef({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getForumPosts();
        setForumPosts(posts);
      } catch (error) {
        toast.error("Failed to load forum posts");
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchCommentsForPosts = async () => {
      const commentsMap = {};
      for (const post of forumPosts) {
        try {
          const comments = await getForumComments(post._id);
          commentsMap[post._id] = comments.data;
        } catch (error) {
          commentsMap[post._id] = [];
          console.error(`Failed to load comments for post ${post._id}`, error);
        }
      }
      setCommentsByPost(commentsMap);
    };

    if (forumPosts.length > 0) {
      fetchCommentsForPosts();
    }
  }, [forumPosts]);

  // Post media handling
  const handlePostFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'images') {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      setPostMedia(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }));
    } else if (type === 'videos') {
      const videoFiles = files.filter(file => file.type.startsWith('video/'));
      setPostMedia(prev => ({ ...prev, videos: [...prev.videos, ...videoFiles] }));
    }
  };

  const startPostRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      const recordingType = 'post';
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (recordingType === 'post') {
          setPostMedia(prev => ({ ...prev, voiceNotes: audioBlob }));
        } else {
          setCommentMedia(prev => ({
            ...prev,
            [recordingState.commentId]: { 
              ...prev[recordingState.commentId], 
              voiceNotes: audioBlob 
            }
          }));
        }
        setRecordingState({ type: null, commentId: null });
      };
      
      mediaRecorderRef.current.start();
      setRecordingState({ type: 'post', commentId: null });
    } catch (error) {
      toast.error("Error accessing microphone: " + error.message);
    }
  };

  const startCommentRecording = async (postId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setCommentMedia(prev => ({
          ...prev,
          [postId]: { ...prev[postId], voiceNotes: audioBlob }
        }));
        setRecordingState({ type: null, commentId: null });
      };
      
      mediaRecorderRef.current.start();
      setRecordingState({ type: 'comment', commentId: postId });
    } catch (error) {
      toast.error("Error accessing microphone: " + error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState.type) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const removePostMedia = (type, index) => {
    if (type === 'voiceNotes') {
      setPostMedia(prev => ({ ...prev, voiceNotes: null }));
    } else {
      setPostMedia(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    }
  };

  const handleCommentFileChange = (postId, e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'images') {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      setCommentMedia(prev => ({
        ...prev,
        [postId]: { ...prev[postId], images: [...(prev[postId]?.images || []), ...imageFiles] }
      }));
    } else if (type === 'videos') {
      const videoFiles = files.filter(file => file.type.startsWith('video/'));
      setCommentMedia(prev => ({
        ...prev,
        [postId]: { ...prev[postId], videos: [...(prev[postId]?.videos || []), ...videoFiles] }
      }));
    }
  };

  const removeCommentMedia = (postId, type, index) => {
    if (type === 'voiceNotes') {
      setCommentMedia(prev => ({
        ...prev,
        [postId]: { ...prev[postId], voiceNotes: null }
      }));
    } else {
      setCommentMedia(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          [type]: prev[postId][type].filter((_, i) => i !== index)
        }
      }));
    }
  };

  const handleNewPost = async () => {
    // if (!newPost.trim() && postMedia.images.length === 0 &&
    //     postMedia.videos.length === 0 && !postMedia.voiceNotes) {
    //   toast.error("Please add content or media to your post");
    //   return;
    // }
  
    try {
      const formData = new FormData();
      formData.append("content", newPost);
  
      postMedia.images.forEach(image => {
        formData.append("images", image);
      });
  
      postMedia.videos.forEach(video => {
        formData.append("videos", video);
      });
  
      if (postMedia.voiceNotes) {
        formData.append("voiceNotes", postMedia.voiceNotes, `voicenote-${Date.now()}.wav`);
      }
  
      const createdPost = await createForumPostWithMedia(formData);
      setForumPosts([createdPost, ...forumPosts]);
      setNewPost("");
      setPostMedia({ images: [], videos: [], voiceNotes: null });
      toast.success("Post created successfully");
    } catch (error) {
      toast.error("Failed to create post: " + error.message);
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = newComment[postId]?.trim() || "";
    const currentCommentMedia = commentMedia[postId] || {};
    
    // Validation (uncomment if needed)
    // if (!commentText && 
    //     (!currentCommentMedia.images || currentCommentMedia.images.length === 0) && 
    //     (!currentCommentMedia.videos || currentCommentMedia.videos.length === 0) && 
    //     !currentCommentMedia.voiceNotes) {
    //   toast.error("Please add text or media to your comment");
    //   return;
    // }
    
    try {
      const formData = new FormData();
      
      // Append text if it exists
      if (commentText) {
        formData.append("text", commentText);
      }
      
      // Append images if they exist
      if (currentCommentMedia.images) {
        currentCommentMedia.images.forEach(image => {
          formData.append("images", image);
        });
      }
      
      // Append videos if they exist
      if (currentCommentMedia.videos) {
        currentCommentMedia.videos.forEach(video => {
          formData.append("videos", video);
        });
      }
      
      // Append voice note if it exists
      if (currentCommentMedia.voiceNotes) {
        formData.append("voiceNotes", currentCommentMedia.voiceNotes, `voicenote-${Date.now()}.wav`);
      }
      
      // Make the API call
      const comment = await addCommentWithMedia(postId, formData)
      // Update state
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      
      setNewComment(prev => ({ ...prev, [postId]: "" }));
      setCommentMedia(prev => ({ ...prev, [postId]: {} }));
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment: " + error.message);
    }
  };

  // Update post functions
  const handleStartEditPost = (postId, content) => {
    setEditingPostId(postId);
    setEditingContent(content);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingContent("");
  };

  const handleUpdatePost = async (postId) => {
    try {
      const updatedPost = await updateForumPost(postId, { content: editingContent });
      setForumPosts(prev =>
        prev.map(post => (post._id === postId ? updatedPost : post))
      );
      setEditingPostId(null);
      setEditingContent("");
      toast.success("Post updated successfully");
    } catch (error) {
      toast.error("Failed to update post: " + error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await deleteForumPost(postId);
      setForumPosts(prev => prev.filter(post => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post: " + error.message);
    }
  };

  return (
    <div>
      {/* Create Post */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share a question or discussion..."
          className="w-full p-3 border rounded mb-2"
          rows={3}
        />
        
        {/* Post Media Preview */}
        <div className="mb-3">
          {postMedia.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {postMedia.images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(image)} alt="" className="h-20 w-20 object-cover rounded" />
                  <button onClick={() => removePostMedia('images', index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {postMedia.videos.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {postMedia.videos.map((video, index) => (
                <div key={index} className="relative">
                  <video src={URL.createObjectURL(video)} className="h-20 w-20 object-cover rounded" controls />
                  <button onClick={() => removePostMedia('videos', index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {postMedia.voiceNotes && (
            <div className="flex items-center gap-2 mb-2">
              <AudioPlayer src={URL.createObjectURL(postMedia.voiceNotes)} />
              <button onClick={() => removePostMedia('voiceNotes')} className="bg-red-500 text-white rounded-full p-1">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        
        {/* Post Media Controls */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => postFileInputRef.current?.click()} className="p-2 bg-gray-200 rounded hover:bg-gray-300" title="Add images">
            <Image size={18} />
            <input type="file" ref={postFileInputRef} onChange={(e) => handlePostFileChange(e, 'images')} accept="image/*" multiple className="hidden" />
          </button>
          
          <button onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.multiple = true;
            input.onchange = (e) => handlePostFileChange(e, 'videos');
            input.click();
          }} className="p-2 bg-gray-200 rounded hover:bg-gray-300" title="Add videos">
            <Video size={18} />
          </button>
          
          <button 
            onClick={recordingState.type === 'post' ? stopRecording : startPostRecording} 
            className={`p-2 rounded ${recordingState.type === 'post' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            title={recordingState.type === 'post' ? "Stop recording" : "Record voice note"}
          >
            <Mic size={18} />
          </button>
        </div>
        
        <button onClick={handleNewPost} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus className="inline-block mr-1" size={16} />
          Post
        </button>
      </div>

      {/* Posts List */}
      {forumPosts.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No posts yet. Be the first to share!</p>
      ) : (
        forumPosts.map((post) => (
          <div key={post._id} className="bg-white rounded shadow p-4 mb-4">
            {/* Post Content */}
            <div className="flex justify-between items-start">
              {editingPostId === post._id ? (
                <div className="flex-1">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdatePost(post._id)} className="bg-green-500 text-white px-3 py-1 rounded">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 mb-2 flex-1">
                    <User size={14} className="inline-block mr-1" />
                    <strong>{post.author?.name || "Unknown"}</strong>: {post.content}
                  </p>
                  <div className="flex space-x-2">
                    <button onClick={() => handleStartEditPost(post._id, post.content)} className="text-blue-500 text-sm">Edit</button>
                    <button onClick={() => handleDeletePost(post._id)} className="text-red-500 text-sm">Delete</button>
                  </div>
                </>
              )}
            </div>
            
            {/* Post Media */}
            {post.media?.length > 0 && (
              <div className="mt-2 mb-3">
                <div className="flex flex-wrap gap-2">
                  {post.media.map((media, index) => (
                    <div key={index} className="max-w-full">
                      {media.type === 'image' && (
                        <img 
                          src={media.url} 
                          alt={`Post image ${index + 1}`} 
                          className="max-h-60 max-w-full rounded"
                          onClick={() => window.open(media.url, '_blank')}
                        />
                      )}
                      {media.type === 'video' && (
                        <video 
                          src={media.url} 
                          controls 
                          className="max-h-60 max-w-full rounded"
                        />
                      )}
                      {media.type === 'audio' && <AudioPlayer src={media.url} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Comments Section */}
            <div className="ml-4 mt-3 border-t pt-3">
              {commentsByPost[post._id]?.map((comment) => (
                <div key={comment._id} className="text-sm text-gray-700 mb-2 pl-2 border-l-2 border-gray-200">
                  <div className="flex items-start">
                    <User size={14} className="inline-block mr-1 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-600">{comment.author.name || "Unknown"}</strong>
                      <p className="text-gray-800">{comment.text}</p>
                      
                      {/* Comment Media */}
                      {comment.media?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {comment.media.map((media, index) => (
                            <div key={index} className="max-w-xs">
                              {media.type === 'image' && (
                                <img 
                                  src={media.url} 
                                  alt={`Comment image ${index + 1}`} 
                                  className="h-20 object-cover rounded cursor-pointer"
                                  onClick={() => window.open(media.url, '_blank')}
                                />
                              )}
                              {media.type === 'video' && (
                                <video 
                                  src={media.url} 
                                  controls 
                                  className="h-20 object-cover rounded"
                                />
                              )}
                              {media.type === 'audio' && <AudioPlayer src={media.url} />}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Comment */}
              <div className="mt-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment[post._id] || ""}
                    onChange={(e) => setNewComment({ ...newComment, [post._id]: e.target.value })}
                    placeholder="Add a comment..."
                    className="flex-grow p-2 border rounded text-sm"
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment(post._id)}
                  />
                  <button onClick={() => handleAddComment(post._id)} className="bg-blue-500 text-white p-2 rounded">
                    <Send size={14} />
                  </button>
                </div>
                
                {/* Comment Media Controls */}
                <div className="mt-2 flex gap-2">
                  <button onClick={() => {
                    if (!commentFileInputRefs.current[post._id]) {
                      commentFileInputRefs.current[post._id] = React.createRef();
                    }
                    commentFileInputRefs.current[post._id].current?.click();
                  }} className="p-1 bg-gray-200 rounded hover:bg-gray-300" title="Add images">
                    <Image size={16} />
                    <input
                      type="file"
                      ref={el => commentFileInputRefs.current[post._id] = { current: el }}
                      onChange={(e) => handleCommentFileChange(post._id, e, 'images')}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                  </button>
                  
                  <button onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'video/*';
                    input.multiple = true;
                    input.onchange = (e) => handleCommentFileChange(post._id, e, 'videos');
                    input.click();
                  }} className="p-1 bg-gray-200 rounded hover:bg-gray-300" title="Add videos">
                    <Video size={16} />
                  </button>
                  
                  <button
                    onClick={recordingState.commentId === post._id ? stopRecording : () => startCommentRecording(post._id)}
                    className={`p-1 rounded ${recordingState.commentId === post._id ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    title={recordingState.commentId === post._id ? "Stop recording" : "Record voice note"}
                  >
                    <Mic size={16} />
                  </button>
                </div>
                
                {/* Comment Media Preview */}
                {(commentMedia[post._id]?.images?.length > 0 || 
                  commentMedia[post._id]?.videos?.length > 0 || 
                  commentMedia[post._id]?.voiceNotes) && (
                  <div className="mt-2">
                    {commentMedia[post._id]?.images?.map((image, index) => (
                      <div key={index} className="relative inline-block mr-2 mb-2">
                        <img src={URL.createObjectURL(image)} alt="" className="h-16 w-16 object-cover rounded" />
                        <button onClick={() => removeCommentMedia(post._id, 'images', index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {commentMedia[post._id]?.videos?.map((video, index) => (
                      <div key={index} className="relative inline-block mr-2 mb-2">
                        <video src={URL.createObjectURL(video)} className="h-16 w-16 object-cover rounded" controls />
                        <button onClick={() => removeCommentMedia(post._id, 'videos', index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {commentMedia[post._id]?.voiceNotes && (
                      <div className="flex items-center gap-2">
                        <AudioPlayer src={URL.createObjectURL(commentMedia[post._id].voiceNotes)} />
                        <button onClick={() => removeCommentMedia(post._id, 'voiceNotes')} className="bg-red-500 text-white rounded-full p-1">
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ForumComponent;