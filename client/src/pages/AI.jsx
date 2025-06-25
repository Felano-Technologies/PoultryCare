// ai.jsx
import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import {
  PaperClipIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
  PlusIcon,
  ClockIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';
import { askAI, uploadToCloudinary, fetchMessages, fetchChatHistory, createNewChat, deleteChat } from '../services/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Footer from '../components/Footer';

// Memoized Message component
const Message = memo(({ msg, renderMarkdown }) => (
  <div className={`max-w-[80%] px-4 py-3 rounded-xl shadow-sm ${
    msg.role === 'user'
      ? 'ml-auto bg-green-100 text-gray-900'
      : 'mr-auto bg-white text-gray-800'
  }`}>
    {msg.image && (
      <img
        src={msg.image}
        alt="uploaded"
        className="w-40 h-auto mb-2 rounded border"
        loading="lazy"
      />
    )}
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} 
    />
  </div>
));

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingContent, setTypingContent] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Memoized markdown renderer
  const renderMarkdown = useMemo(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: false,
      mangle: false,
      headerPrefix: '',
      xhtml: true
    });
  
    return (text) => {
      const normalizedText = text.replace(/\n\s*\n/g, '\n\n');
      const rawHTML = marked.parse(normalizedText);
      return DOMPurify.sanitize(rawHTML);
    };
  }, []);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await fetchChatHistory();
        setChatHistory(history);
        
        // If there's no current chat and history exists, load the most recent one
        if (!currentChatId && history.length > 0) {
          loadChat(history[0]._id);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    
    loadChatHistory();
  }, []);

  // Load a specific chat
  const loadChat = async (chatId) => {
    try {
      setLoading(true);
      const response = await fetchMessages(chatId);
      setMessages(response.messages);
      setCurrentChatId(chatId);
    } catch (error) {
      console.error('Error loading chat:', error);
      setMessages([
        { 
          role: 'ai', 
          content: `# ❌ Error\n\nCould not load chat. Please try again.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Create new chat
  const handleNewChat = async () => {
    try {
      const newChat = await createNewChat();
      setChatHistory(prev => [newChat, ...prev]);
      setMessages([]);
      setCurrentChatId(newChat._id);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  // Delete chat
  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chat._id !== chatId));
      
      // If we're deleting the current chat, reset to new state
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !upload) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      image: upload ? URL.createObjectURL(upload) : null,
      chatId: currentChatId
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUpload(null);
    setLoading(true);

    try {
      let imageUrl = null;
      if (upload) {
        imageUrl = await uploadToCloudinary(upload);
      }

      const response = await askAI({
        question: userMessage.content,
        image: imageUrl,
        chatId: currentChatId
      });

      if (!currentChatId) {
        // New chat - add to sidebar
        setChatHistory(prev => [{
          _id: response.chatId,
          title: response.chatTitle
        }, ...prev]);
        setCurrentChatId(response.chatId);
      }

      setTypingContent(response.answer);
      setIsTyping(true);
      setMessages(prev => [...prev, { role: 'ai', content: '' }]);
      
      // Update chat history with new message
      if (!currentChatId) {
        setCurrentChatId(response.chatId);
        setChatHistory(prev => [{ _id: response.chatId, title: response.answer.substring(0, 30) + '...' }, ...prev]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: '# ❌ Error\n\nSorry, I encountered an issue processing your request. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Typing effect
  useEffect(() => {
    if (!isTyping) return;

    const interval = setInterval(() => {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === 'ai') {
          const currentLength = lastMessage.content.length;
          if (currentLength < typingContent.length) {
            const newContent = typingContent.substring(
              0, 
              Math.min(currentLength + 3, typingContent.length)
            );
            
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: newContent }
            ];
          } else {
            clearInterval(interval);
            setIsTyping(false);
          }
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isTyping, typingContent]);

  // Scroll management
  useEffect(() => {
    if (!isTyping && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Speech recognition
  useEffect(() => {
    if (!listening && transcript) {
      setInput(prev => `${prev} ${transcript}`.trim());
      resetTranscript();
    }
  }, [listening, transcript, resetTranscript]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0 w-64 bg-white shadow-lg z-20 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <button 
              onClick={handleNewChat}
              className="flex items-center justify-center w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Chat
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                Recent Chats
              </h3>
              {chatHistory.length === 0 ? (
                <p className="text-sm text-gray-500 px-2 py-4">No chat history yet</p>
              ) : (
                <ul>
                  {chatHistory.map(chat => (
                    <li 
                      key={chat._id}
                      onClick={() => loadChat(chat._id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                        currentChatId === chat._id ? 'bg-green-50' : ''
                      }`}
                    >
                      <div className="flex items-center truncate">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="truncate text-sm">
                          {chat.title || 'New Chat'}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteChat(chat._id, e)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-green-600 w-full"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to App
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center text-green-600 hover:text-green-700 transition"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-green-600">Poultry AI Assistant</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </header>

        {/* Chat Area */}
        <main 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        >
          {messages.length === 0 && !loading ? (
            <Message 
              msg={{ 
                role: 'ai', 
                content: `# 👋 Welcome to Poultry AI Assistant\n\n## You can ask me about:\n- Common poultry diseases\n- Feed formulations\n- Housing management\n- Vaccination schedules\n- Biosecurity measures\n\nJust type your question below!`
              }} 
              renderMarkdown={renderMarkdown}
            />
          ) : (
            messages.map((msg, i) => (
              <Message key={i} msg={msg} renderMarkdown={renderMarkdown} />
            ))
          )}
          
          {loading && !isTyping && (
            <div className="mr-auto bg-white text-gray-800 px-4 py-3 rounded-xl shadow-sm max-w-[80%]">
              Analyzing your question...
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        {/* Input Footer */}
        <footer className="bg-white p-4 shadow-inner">
          <div className="flex items-end gap-2">
            {/* Upload Icon */}
            <label className="cursor-pointer">
              <PaperClipIcon className="h-5 w-5 text-gray-500 hover:text-green-500" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setUpload(e.target.files?.[0] || null)}
              />
            </label>

            {/* Mic Icon */}
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

            {/* Text Input */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-green-500 max-h-40 overflow-auto"
              placeholder="Type your message..."
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={loading || isTyping}
              className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition text-white disabled:opacity-50"
              title="Send"
            >
              <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}