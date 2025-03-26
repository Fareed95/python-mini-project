"use client";

import { motion } from 'framer-motion';
import { Send, Bot, User, Dot } from 'lucide-react';
import { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { useUserContext } from '@/app/context/Userinfo'; // Adjust the import path as needed

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: "Hello! I'm your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);

  // Get email from context
  const { contextemail, contextisLoggedIn, contextsetRoadmap, contextsetFirstRoadmap } = useUserContext();

  const getBotResponse = async (userInput) => {
    try {
      const response = await fetch('http://localhost:8001/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userInput,
          email: contextemail // Include email in the request
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      return data.answer || "I couldn't process that request. Please try again.";
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return "Sorry, I'm having trouble connecting to the server. Please try again later.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = { 
      content: message, 
      isBot: false, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // Get bot response
    const botResponse = await getBotResponse(message);
    
    // Add bot message
    setMessages(prev => [
      ...prev, 
      { 
        content: botResponse, 
        isBot: true, 
        timestamp: new Date() 
      }
    ]);
    
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center space-x-4 pb-4 border-b border-neutral-800 mb-4">
        <div className="p-3 bg-neutral-800 rounded-xl">
          <Bot className="w-6 h-6 text-neutral-300" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-neutral-200">AI Assistant</h3>
          <p className="text-xs text-neutral-400">Ready to chat</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-[300px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-neutral-700">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: msg.isBot ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.isBot ? '' : 'justify-end'}`}
          >
            <div className={`max-w-[85%] p-4 ${
              msg.isBot
                ? 'bg-neutral-800 rounded-2xl rounded-bl-none'
                : 'bg-neutral-700 rounded-2xl rounded-br-none'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {msg.isBot ? (
                  <>
                    <Bot className="w-4 h-4 text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-400">Assistant</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-neutral-300" />
                    <span className="text-xs font-medium text-neutral-300">You</span>
                  </>
                )}
                <span className="text-xs text-neutral-500">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-neutral-200">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-1 px-4 py-2 w-max">
            <Dot className="w-5 h-5 text-neutral-400 animate-bounce" />
            <Dot className="w-5 h-5 text-neutral-500 animate-bounce delay-100" />
            <Dot className="w-5 h-5 text-neutral-600 animate-bounce delay-200" />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full px-4 py-3 bg-black border border-neutral-700 rounded-xl focus:outline-none focus:border-neutral-600 text-neutral-200 placeholder-neutral-500 disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center disabled:opacity-50"
            disabled={isLoading || !message.trim()}
          >
            <Send className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}