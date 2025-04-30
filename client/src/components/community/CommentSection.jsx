import { useState } from "react";

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const addComment = () => {
    if (!text.trim()) return;
    setComments([...comments, { text, timestamp: new Date().toISOString() }]);
    setText("");
  };

  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 p-2 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={addComment}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Comment
        </button>
      </div>
      {comments.map((c, i) => (
        <div key={i} className="text-sm bg-gray-100 p-2 rounded mb-1">
          <p>{c.text}</p>
          <span className="text-xs text-gray-500">
            {new Date(c.timestamp).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
