import { useState } from "react";

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    // Simulate expert reply
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Thank you for your message. We'll get back soon.", sender: "expert" }]);
    }, 1000);
  };

  return (
    <div className="border p-3 rounded">
      <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
      <div className="h-48 overflow-y-auto mb-2 bg-gray-100 p-2 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 text-sm ${msg.sender === "user" ? "text-right text-blue-700" : "text-left text-green-700"}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-1 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
