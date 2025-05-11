import React, { useState } from "react";

const CommentBox = ({ comments }) => {
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState(comments);

  const addComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        text: commentText,
        author: "You",
      };
      setAllComments([...allComments, newComment]);
      setCommentText("");
    }
  };

  return (
    <div className="mt-2">
      {allComments.map((comment) => (
        <p key={comment.id} className="text-gray-700 text-sm">
          <strong>{comment.author}</strong>: {comment.text}
        </p>
      ))}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={addComment} className="bg-blue-500 text-white px-3 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default CommentBox;
