import React, { useState } from "react";

const CreatePost = ({ onPost }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onPost({ id: Date.now(), author: "You", content: text, comments: [] });
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's your question or topic?"
        className="w-full p-2 border rounded resize-none"
        rows={3}
      />
      <button
        type="submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Post Discussion
      </button>
    </form>
  );
};

export default CreatePost;
