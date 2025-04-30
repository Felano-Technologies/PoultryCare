import { useState } from "react";
import CreatePost from "./CreatePost";
import Post from "./Post";

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);

  const handleNewPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <div>
      <CreatePost onPost={handleNewPost} />
      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </div>
  );
};

export default CommunityFeed;
