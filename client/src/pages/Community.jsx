import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageSquare, Send, Plus, BookOpen, Info, User } from "lucide-react";
import {
  getForumPosts,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  addCommentToPost,
  getExpertsByRole,
  bookConsultation,
  getChatResponse,
} from "../services/api";
import {toast} from "react-toastify";

const ForumConsultation = () => {
  const [activeTab, setActiveTab] = useState("forum");
  const [forumPosts, setForumPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState({});
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "expert", text: "Hello, how can I help?" },
  ]);
  const [expertRole, setExpertRole] = useState("");
  const [experts, setExperts] = useState([]);
  const [bookingData, setBookingData] = useState({
    expertId: "",
    dateTime: "",
    issue: "",
  });

  // Fetch forum posts on component mount
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

  // Fetch experts when role changes
  useEffect(() => {
    if (expertRole) {
      const fetchExperts = async () => {
        try {
          const experts = await getExpertsByRole(expertRole);
          setExperts(experts);
        } catch (error) {
          toast.error("Failed to load experts");
        }
      };
      fetchExperts();
    }
  }, [expertRole]);

  const handleNewPost = async () => {
    if (!newPost.trim()) return;
    
    try {
      const createdPost = await createForumPost(newPost);
      setForumPosts([createdPost, ...forumPosts]);
      setNewPost("");
      toast.success("Post created successfully");
    } catch (error) {
      toast.error("Failed to create post");
    }
  };

  const handleUpdatePost = async (postId, currentContent) => {
    const updatedContent = prompt("Edit your post:", currentContent);
    if (updatedContent === null || updatedContent === currentContent) return;
    
    try {
      await updateForumPost(postId, updatedContent);
      setForumPosts(forumPosts.map(post => 
        post._id === postId ? { ...post, content: updatedContent } : post
      ));
      toast.success("Post updated successfully");
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await deleteForumPost(postId);
      setForumPosts(forumPosts.filter(post => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId]?.trim()) return;
    
    try {
      const comment = await addCommentToPost(postId, newComment[postId]);
      setForumPosts(forumPosts.map(post => 
        post._id === postId 
          ? { ...post, comments: [...post.comments, comment] } 
          : post
      ));
      setNewComment({ ...newComment, [postId]: "" });
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleBookConsultation = async () => {
    if (!bookingData.expertId || !bookingData.dateTime || !bookingData.issue) {
      toast.error("Please fill all fields");
      return;
    }
    
    try {
      await bookConsultation(bookingData);
      toast.success("Consultation booked successfully");
      setBookingData({
        expertId: "",
        dateTime: "",
        issue: "",
      });
    } catch (error) {
      toast.error("Failed to book consultation");
    }
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { sender: "user", text: chatMessage }]);
    setChatMessage("");
    
    try {
      // Get bot response
      const { response } = await getChatResponse(chatMessage);
      setChatHistory(prev => [...prev, { sender: "expert", text: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        sender: "expert", 
        text: "Sorry, I'm having trouble responding. Please try again later." 
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Tab Header */}
        <div className="flex space-x-4 border-b mb-6">
          <button
            onClick={() => setActiveTab("forum")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "forum" ? "border-b-4 border-blue-600 text-blue-700" : "text-gray-500"
            }`}
          >
            <MessageSquare className="inline-block mr-1" size={18} /> Community Forum
          </button>
          <button
            onClick={() => setActiveTab("consultation")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "consultation" ? "border-b-4 border-green-600 text-green-700" : "text-gray-500"
            }`}
          >
            <BookOpen className="inline-block mr-1" size={18} /> Expert Consultation
          </button>
        </div>

        {/* Forum Tab */}
        {activeTab === "forum" && (
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
              <button
                onClick={handleNewPost}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Plus className="inline-block mr-1" size={16} />
                Post
              </button>
            </div>

            {/* Posts */}
            {forumPosts.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No posts yet. Be the first to share!</p>
            ) : (
              forumPosts.map((post) => (
                <div key={post._id} className="bg-white rounded shadow p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <p className="text-gray-800 mb-2">
                      <User size={14} className="inline-block mr-1" />
                      <strong>{post.author?.name || "Unknown"}</strong>: {post.content}
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleUpdatePost(post._id, post.content)}
                        className="text-blue-500 text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post._id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Comments Section */}
                  <div className="ml-4 mt-3 border-t pt-3">
                    {post.comments?.map((comment) => (
                      <div key={comment._id} className="text-sm text-gray-700 mb-2">
                        <MessageSquare size={12} className="inline-block mr-1" />
                        <strong>{comment.authorName || "Unknown"}</strong>: {comment.text}
                      </div>
                    ))}
                    
                    {/* Add Comment */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newComment[post._id] || ""}
                        onChange={(e) => setNewComment({
                          ...newComment,
                          [post._id]: e.target.value
                        })}
                        placeholder="Add a comment..."
                        className="flex-grow p-2 border rounded text-sm"
                        onKeyPress={(e) => e.key === "Enter" && handleAddComment(post._id)}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Consultation Tab */}
        {activeTab === "consultation" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Booking Form */}
            <div className="bg-white rounded shadow p-4">
              <h3 className="text-lg font-semibold mb-3 text-green-700">
                Book a Consultation
              </h3>
              <div className="space-y-3">
                <select
                  value={expertRole}
                  onChange={(e) => setExpertRole(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Expert Type</option>
                  <option value="Poultry Farmer">Poultry Farmer</option>
                  <option value="Extension Officer">Extension Officer</option>
                  <option value="Veterinarian">Veterinarian</option>
                  <option value="Agricultural Biotechnologist">Agricultural Biotechnologist</option>
                </select>
                
                {expertRole && (
                  <select
                    value={bookingData.expertId}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      expertId: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Expert</option>
                    {experts.map((expert) => (
                      <option key={expert._id} value={expert._id}>
                        {expert.farmName} ({expert.role})
                      </option>
                    ))}
                  </select>
                )}
                
                <input
                  type="datetime-local"
                  value={bookingData.dateTime}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    dateTime: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
                
                <textarea
                  value={bookingData.issue}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    issue: e.target.value
                  })}
                  placeholder="Describe your issue"
                  rows={3}
                  className="w-full p-2 border rounded"
                />
                
                <button
                  onClick={handleBookConsultation}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Live Chat & FAQs */}
            <div className="bg-white rounded shadow p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">
                Live Chat
              </h3>
              <div className="h-60 overflow-y-auto border p-2 mb-3 bg-gray-50 rounded">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-2 ${msg.sender === "expert" ? "text-left" : "text-right"}`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        msg.sender === "expert"
                          ? "bg-green-100 text-gray-800"
                          : "bg-blue-100 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Type your question..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                />
                <button
                  onClick={handleSendChat}
                  className="bg-blue-500 text-white px-4 rounded"
                >
                  <Send size={18} />
                </button>
              </div>

              {/* FAQ */}
              <div className="mt-6">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                  <Info size={14} className="inline-block mr-1" />
                  FAQs
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>🐣 How do I prevent respiratory diseases?</li>
                  <li>💊 When should I deworm my flock?</li>
                  <li>🥚 Best feed type for layers?</li>
                  <li>🏠 Ideal poultry housing conditions?</li>
                  <li>💉 Vaccination schedule for broilers?</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ForumConsultation;