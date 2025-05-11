import React, { useState } from "react";
import CommentBox from "./CommentBox";

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-800 mb-2"><strong>{post.author}</strong>: {post.content}</p>
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-sm text-blue-500 hover:underline"
      >
        {showComments ? "Hide" : "View"} Comments ({post.comments.length})
      </button>
      {showComments && <CommentBox comments={post.comments} />}
    </div>
  );
};

export default PostCard;
