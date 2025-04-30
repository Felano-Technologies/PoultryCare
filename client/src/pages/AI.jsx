import React, { useState, useRef, useEffect } from 'react';


import {
  PaperClipIcon,
  MicrophoneIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import API from '../services/api';


export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '👋 Hello! Need help with poultry health, feeding, or environment?' }
  ]);
  const [input, setInput] = useState('');
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();


  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!listening && transcript) {
      setInput((prev) => `${prev} ${transcript}`.trim());
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript]);

  const handleSend = async () => {
    if (!input.trim() && !upload) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      image: upload ? URL.createObjectURL(upload) : null
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setUpload(null);
    setLoading(true);

    try {
      let imageUrl = null;

      if (upload) {
        const formData = new FormData();
        formData.append('image', upload);
        const uploadRes = await API.post('ai/upload', formData);
        imageUrl = `ai/images/${uploadRes.data.filename}`;
      }

      const response = await API.post('ai/ask', {
        question: userMessage.content,
        image: imageUrl
      });

      const aiMessage = { role: 'ai', content: response.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', content: '❌ Error: Unable to process your request.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)} // or navigate('/dashboard') for a specific route
          className="flex items-center text-green-600 hover:text-green-700 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>

        <h1 className="text-xl font-bold text-green-600">Poultry AI Assistant</h1>
      </header>


      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-3 rounded-xl shadow-sm ${
              msg.role === 'user'
                ? 'ml-auto bg-green-100 text-gray-900'
                : 'mr-auto bg-white text-gray-800'
            }`}
          >
            {msg.image && (
              <img
                src={msg.image}
                alt="uploaded"
                className="w-40 h-auto mb-2 rounded border"
              />
            )}
            <div>{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-white text-gray-800 px-4 py-3 rounded-xl shadow-sm">
            Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Footer: Input Area */}
      <footer className="bg-white p-4 shadow-inner">
        <div className="flex items-end gap-2">
          {/* Upload Icon */}
          <label className="cursor-pointer">
            <PaperClipIcon className="h-5 w-5 text-gray-500 hover:text-green-500" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setUpload(e.target.files[0])}
            />
          </label>

          {/* Microphone Icon */}
          <button
            type="button"
            onClick={() =>
              listening
                ? SpeechRecognition.stopListening()
                : SpeechRecognition.startListening({ continuous: false })
            }
            className={`p-2 rounded-full border ${
              listening ? 'bg-green-100 border-green-500' : 'hover:bg-gray-100'
            }`}
            title="Click to speak"
          >
            <MicrophoneIcon className="h-5 w-5 text-green-600" />
          </button>

          {/* Expandable Textarea */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-green-500 max-h-40 overflow-auto"
            placeholder="Type your message..."
            style={{
              lineHeight: '1.5',
              overflowY: 'auto'
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition text-white"
            title="Send"
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
          </button>
        </div>
      </footer>
    </div>
  );
}
