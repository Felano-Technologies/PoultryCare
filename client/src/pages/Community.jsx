import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageSquare, BookOpen } from "lucide-react";
import ForumComponent from "../components/ForumComponent";
import ConsultationComponent from "../components/Consultation";

const ForumConsultation = () => {
  const [activeTab, setActiveTab] = useState("forum");

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

        {activeTab === "forum" ? <ForumComponent /> : <ConsultationComponent />}
      </main>

      <Footer />
    </div>
  );
};

export default ForumConsultation;