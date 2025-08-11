import React, { useState, useEffect } from "react";
import { BookOpen, Info, Send } from "lucide-react";
import {
  getExpertsByRole,
  bookConsultation,
  getChatResponse,
  getUserConsultations
} from "../services/api";
import { toast } from "react-toastify";

const ConsultationComponent = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "expert", text: "Hello, how can I help?" },
  ]);
  const [expertRole, setExpertRole] = useState("");
  const [experts, setExperts] = useState([]);
  const [bookingData, setBookingData] = useState({
    expertId: "",
    dateTime: "",
    issue: "",
  });
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const consults = await getUserConsultations();
        setConsultations(consults);
      } catch (error) {
        toast.error("Failed to load consultations");
      }
    };
    fetchConsultations();
  }, []);

  useEffect(() => {
    if (expertRole) {
      const fetchExperts = async () => {
        try {
          const experts = await getExpertsByRole(expertRole);
          setExperts(experts);
        } catch (error) {
          toast.error("Failed to load experts");
        }
      };
      fetchExperts();
    }
  }, [expertRole]);

  const handleBookConsultation = async () => {
    if (!bookingData.expertId || !bookingData.dateTime || !bookingData.issue) {
      toast.error("Please fill all fields");
      return;
    }
    
    try {
      await bookConsultation(bookingData);
      toast.success("Consultation booked successfully");
      setBookingData({
        expertId: "",
        dateTime: "",
        issue: "",
      });
      // Refresh consultations
      const consults = await getUserConsultations();
      setConsultations(consults);
    } catch (error) {
      toast.error("Failed to book consultation");
    }
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory([...chatHistory, { sender: "user", text: chatMessage }]);
    setChatMessage("");
    
    try {
      const { response } = await getChatResponse(chatMessage);
      setChatHistory(prev => [...prev, { sender: "expert", text: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        sender: "expert", 
        text: "Sorry, I'm having trouble responding. Please try again later." 
      }]);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Booking Form */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-3 text-green-700">
          <BookOpen className="inline-block mr-1" size={18} /> Book a Consultation
        </h3>
        
        <div className="space-y-3">
          <select
            value={expertRole}
            onChange={(e) => setExpertRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Expert Type</option>
            <option value="Poultry Farmer">Poultry Farmer</option>
            <option value="Extension Officer">Extension Officer</option>
            <option value="Veterinarian">Veterinarian</option>
            <option value="Agricultural Biotechnologist">Agricultural Biotechnologist</option>
          </select>
          
          {expertRole && (
            <select
              value={bookingData.expertId}
              onChange={(e) => setBookingData({
                ...bookingData,
                expertId: e.target.value
              })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Expert</option>
              {experts.map((expert) => (
                <option key={expert._id} value={expert._id}>
                  {expert.farmName} ({expert.role})
                </option>
              ))}
            </select>
          )}
          
          <input
            type="datetime-local"
            value={bookingData.dateTime}
            onChange={(e) => setBookingData({
              ...bookingData,
              dateTime: e.target.value
            })}
            className="w-full p-2 border rounded"
          />
          
          <textarea
            value={bookingData.issue}
            onChange={(e) => setBookingData({
              ...bookingData,
              issue: e.target.value
            })}
            placeholder="Describe your issue"
            rows={3}
            className="w-full p-2 border rounded"
          />
          
          <button
            onClick={handleBookConsultation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Book Now
          </button>
        </div>
        
        {/* Upcoming Consultations */}
        {consultations.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-2">Upcoming Consultations</h4>
            <ul className="space-y-2">
              {consultations.map(consult => (
                <li key={consult._id} className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">{consult.expert.farmName}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(consult.dateTime).toLocaleString()}
                  </div>
                  <div className="text-sm">{consult.issue}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Live Chat & FAQs */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">
          Live Chat
        </h3>
        
        <div className="h-60 overflow-y-auto border p-2 mb-3 bg-gray-50 rounded">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${msg.sender === "expert" ? "text-left" : "text-right"}`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === "expert"
                    ? "bg-green-100 text-gray-800"
                    : "bg-blue-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Type your question..."
            onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
          />
          <button
            onClick={handleSendChat}
            className="bg-blue-500 text-white px-4 rounded"
          >
            <Send size={18} />
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
            <li>🏠 Ideal poultry housing conditions?</li>
            <li>💉 Vaccination schedule for broilers?</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConsultationComponent;