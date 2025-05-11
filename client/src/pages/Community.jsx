import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  MessageSquare,
  Send,
  Plus,
  BookOpen,
  Info,
  User,
} from "lucide-react";

const ForumConsultation = () => {
  const [activeTab, setActiveTab] = useState("forum");
  const [forumPosts, setForumPosts] = useState([
    {
      id: 1,
      author: "Farmer Mike",
      content: "What feed type improves egg production?",
      comments: [{ id: 1, author: "Dr. Grace", text: "High protein layer mash!" }],
    },
  ]);
  const [newPost, setNewPost] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "expert", text: "Hello, how can I help?" },
  ]);

  const handleNewPost = () => {
    if (newPost.trim()) {
      setForumPosts([
        { id: Date.now(), author: "You", content: newPost, comments: [] },
        ...forumPosts,
      ]);
      setNewPost("");
    }
  };

  const handleSendChat = () => {
    if (chatMessage.trim()) {
      setChatHistory([...chatHistory, { sender: "user", text: chatMessage }]);
      setChatMessage("");
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
            {forumPosts.map((post) => (
              <div key={post.id} className="bg-white rounded shadow p-4 mb-4">
                <p className="text-gray-800 mb-2">
                  <User size={14} className="inline-block mr-1" />
                  <strong>{post.author}</strong>: {post.content}
                </p>
                <div className="ml-4">
                  {post.comments.map((comment) => (
                    <p key={comment.id} className="text-sm text-gray-700">
                      <MessageSquare size={12} className="inline-block mr-1" />
                      <strong>{comment.author}</strong>: {comment.text}
                    </p>
                  ))}
                </div>
              </div>
            ))}
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
              <form className="space-y-3">
                <input className="input" placeholder="Your Name" />
                <input className="input" type="email" placeholder="Email" />
                <select className="input">
                  <option value="">Select Expert</option>
                  <option>Veterinarian</option>
                  <option>Extension Officer</option>
                  <option>Biotechnologist</option>
                </select>
                <input className="input" type="datetime-local" />
                <textarea className="input" placeholder="Describe your issue" rows={3} />
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Book Now
                </button>
              </form>
            </div>

            {/* Live Chat & FAQs */}
            <div className="bg-white rounded shadow p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">
                Live Chat
              </h3>
              <div className="h-40 overflow-y-auto border p-2 mb-3 bg-gray-50">
                {chatHistory.map((msg, idx) => (
                  <p
                    key={idx}
                    className={`text-sm p-1 rounded mb-1 ${
                      msg.sender === "expert"
                        ? "text-left bg-green-100"
                        : "text-right bg-blue-100"
                    }`}
                  >
                    {msg.text}
                  </p>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Type your question..."
                />
                <button
                  onClick={handleSendChat}
                  className="bg-blue-500 text-white px-3 rounded"
                >
                  <Send size={16} />
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
