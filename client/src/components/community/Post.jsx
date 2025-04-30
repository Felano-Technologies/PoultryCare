import CommentSection from "./CommentSection";

const Post = ({ post }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <p>{post.text}</p>
      {post.image && <img src={post.image} alt="Post" className="mt-2 rounded max-h-96" />}
      <p className="text-sm text-gray-500 mt-2">{new Date(post.timestamp).toLocaleString()}</p>
      <CommentSection />
    </div>
  );
};

export default Post;
