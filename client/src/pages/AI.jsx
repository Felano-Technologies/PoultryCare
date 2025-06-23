//ai.jsx
import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import {
  PaperClipIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';
import { askAI, uploadToCloudinary, fetchMessages } from '../services/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Memoized markdown renderer
  const renderMarkdown = useMemo(() => {
    marked.setOptions({
      gfm: true, // Enable GitHub Flavored Markdown
      breaks: true,
      headerIds: false,
      // Add these new options:
      mangle: false,
      headerPrefix: '',
      xhtml: true
    });
  
    return (text) => {
      // First ensure all line breaks are properly converted
      const normalizedText = text.replace(/\n\s*\n/g, '\n\n');
      const rawHTML = marked.parse(normalizedText);
      return DOMPurify.sanitize(rawHTML);
    };
  }, []);

// In your handleSend function:
const handleSend = async () => {
  if (!input.trim() && !upload) return;

  const userMessage = {
    role: 'user',
    content: input.trim(),
    image: upload ? URL.createObjectURL(upload) : null
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
      image: imageUrl
      // The user ID will be automatically added by your API middleware
    });

    setTypingContent(response.answer);
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'ai', content: '' }]);
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

// In your initial load useEffect:
useEffect(() => {
  const loadInitialMessages = async () => {
    try {
      const response = await fetchMessages(page, 20);
      console.log(response.messages);
      const loadedMessages = response.messages;
      
      if (loadedMessages.length === 0) {
        setMessages([
          { 
            role: 'ai', 
            content: `# 👋 Welcome to Poultry AI Assistant\n\n## You can ask me about:\n- Common poultry diseases\n- Feed formulations\n- Housing management\n- Vaccination schedules\n- Biosecurity measures\n\nJust type your question below!`
          }
        ]);
      } else {
        setMessages(loadedMessages.reverse());
        setHasMoreMessages(response.pagination.hasMore);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([
        { 
          role: 'ai', 
          content: `# 👋 Welcome to Poultry AI Assistant\n\n## You can ask me about:\n- Common poultry diseases\n- Feed formulations\n- Housing management\n- Vaccination schedules\n- Biosecurity measures\n\nJust type your question below!`
        }
      ]);
    }
  };
  
  loadInitialMessages();
}, []);
  // Optimized typing effect
  const TYPING_SPEED = 20; // Increased speed
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
              Math.min(currentLength + 3, typingContent.length) // Add 3 chars at a time
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
    }, 50); // Faster interval

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

  // Pagination
  useEffect(() => {
    const handleScroll = async () => {
      if (!chatContainerRef.current || isFetching || !hasMoreMessages) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const threshold = 100; // pixels from top
      
      if (scrollTop < threshold) {
        setIsFetching(true);
        try {
          const response = await fetchMessages(page + 1, 20);
          if (response.messages.length > 0) {
            const prevScrollHeight = chatContainerRef.current.scrollHeight;
            
            setMessages(prev => [...response.messages.reverse(), ...prev]);
            setPage(prev => prev + 1);
            setHasMoreMessages(response.pagination.hasMore);
            
            // Maintain scroll position
            requestAnimationFrame(() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = 
                  chatContainerRef.current.scrollHeight - prevScrollHeight;
              }
            });
          }
        } catch (error) {
          console.error('Error loading more messages:', error);
        } finally {
          setIsFetching(false);
        }
      }
    };

    const container = chatContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [page, hasMoreMessages, isFetching]);



  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-600 hover:text-green-700 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-xl font-bold text-green-600">Poultry AI Assistant</h1>
      </header>

      {/* Chat Area */}
      <main 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {isFetching && (
          <div className="text-center text-gray-500 py-2">
            Loading more messages...
          </div>
        )}
        
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
  );
}