import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CommunityForum() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return alert('Please fill in all fields');

    console.log({ title, content, category });

    setShowModal(false);
    setTitle('');
    setContent('');
    setCategory('');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Your Navbar */}
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Community Forum</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Create Post
          </button>
        </div>

        {/* Forum Post Previews */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Posted by FarmerJoe • Broilers</span>
              <span className="text-xs text-green-600">2 hours ago</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Best feed for broilers during rainy season?</h3>
            <p className="text-gray-600 mt-2">I’ve noticed a drop in feed intake. What do you recommend?</p>
            <button className="mt-3 text-sm text-blue-600 hover:underline">View Discussion</button>
          </div>

          <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Posted by VetSarah • Vaccination</span>
              <span className="text-xs text-green-600">1 day ago</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Signs your chicks might need a booster dose</h3>
            <p className="text-gray-600 mt-2">Common early signs farmers miss that suggest inadequate protection.</p>
            <button className="mt-3 text-sm text-blue-600 hover:underline">View Discussion</button>
          </div>
        </div>
      </div>

      {/* Your Footer */}
      <Footer />

      {/* Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Select Category</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Feeding">Feeding</option>
                <option value="Housing">Housing</option>
                <option value="Diseases">Diseases</option>
                <option value="General">General</option>
              </select>
              <textarea
                placeholder="Write your discussion here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="5"
                className="w-full border px-4 py-2 rounded"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Post to Forum
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
