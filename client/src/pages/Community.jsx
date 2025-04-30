import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/community/Sidebar";
import CommunityFeed from "../components/community/CommunityFeed";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 mt-4 max-w-3xl mx-auto">
          <CommunityFeed />
        </main>
      </div>
    </div>
  );
};

export default Home;
