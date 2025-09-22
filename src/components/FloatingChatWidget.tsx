"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [chatStage, setChatStage] = useState<'name' | 'welcome' | 'chat'>('name');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot', timestamp: Date}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Show the popup after 3 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Text-to-Speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to use a female voice
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.gender === 'female'
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
      };

      speechSynthesis.speak(utterance);
    }
  };

  const handleNameSubmit = () => {
    if (currentName.trim()) {
      setUserName(currentName.trim());
      setChatStage('welcome');
      
      // Welcome message with AI voice
      const welcomeMessage = `Hello ${currentName.trim()}! Welcome to Curevo Health Assistant. I'm here to help you with your medical questions and water-borne disease concerns. How can I assist you today?`;
      
      setTimeout(() => {
        speakText(welcomeMessage);
        setChatStage('chat');
        // Add initial bot message
        setMessages([{
          id: '1',
          text: `Hello ${currentName.trim()}! 👋 Welcome to Curevo Health Assistant. I'm here to help you with your medical questions and water-borne disease concerns. How can I assist you today?`,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: currentMessage.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate bot response (you can replace this with actual API call)
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'm processing your request and will provide assistance with your health concerns shortly.",
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (chatStage === 'name') {
        handleNameSubmit();
      } else if (chatStage === 'chat') {
        handleSendMessage();
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowPopup(false);
    
    // Reset to name input if no name is set
    if (!userName) {
      setChatStage('name');
      setCurrentName('');
    }
  };

  const hidePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300 }}
      >
        {/* Help Popup */}
        <AnimatePresence>
          {showPopup && !isOpen && (
            <motion.div
              className="absolute -top-16 -left-32 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-xl whitespace-nowrap"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">NEED HELP? ASK CUREVO</span>
                <button
                  onClick={hidePopup}
                  className="ml-2 text-white/80 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="absolute top-full right-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Button */}
        <motion.button
          onClick={toggleChat}
          className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl border-2 border-white group overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.div>
          
          {/* Pulsing effect */}
          <motion.div
            className="absolute inset-0 bg-blue-400 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
              
              {/* Name Input Stage */}
              {chatStage === 'name' && (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center"
                    >
                      {/* Avatar matching your image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-2 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full"></div>
                        <div className="relative text-2xl">👩‍💼</div>
                        {/* Glasses */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-3 border-2 border-gray-800 rounded-full bg-transparent"></div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Name Input */}
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        What's your name?
                      </h3>
                      <div className="relative">
                        <input
                          type="text"
                          value={currentName}
                          onChange={(e) => setCurrentName(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Your name"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-center text-lg focus:outline-none focus:border-blue-500 transition-colors"
                          autoFocus
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Start Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="p-4"
                  >
                    <button
                      onClick={handleNameSubmit}
                      disabled={!currentName.trim()}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                    >
                      Start
                    </button>
                  </motion.div>
                </>
              )}

              {/* Welcome Stage */}
              {chatStage === 'welcome' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <div className="text-3xl text-white">👋</div>
                    </div>
                    <h2 className="text-xl font-bold text-blue-800 mb-2">
                      Welcome, {userName}!
                    </h2>
                    <p className="text-blue-600">
                      Initializing Curevo Health Assistant...
                    </p>
                    <div className="mt-4">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Chat Stage */}
              {chatStage === 'chat' && (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl">👩‍💼</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Hello, {userName}!</h3>
                      <p className="text-blue-100 text-sm flex items-center gap-1">
                        Curevo Health Assistant
                        {isPlaying && <span className="text-yellow-300">🔊</span>}
                      </p>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50 max-h-64">
                    {/* Display actual messages */}
                    <div className="space-y-3">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white ml-auto'
                              : 'bg-white text-gray-700'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </motion.div>
                      ))}
                      
                      {/* Typing indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-xs text-gray-500">Curevo is typing...</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Quick Action Buttons - show only if no messages */}
                    {messages.length === 1 && (
                      <div className="space-y-2 mt-4">
                        <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg text-left text-sm transition-colors">
                          🤒 I have symptoms to report
                        </button>
                        <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-lg text-left text-sm transition-colors">
                          📄 Upload medical document
                        </button>
                        <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg text-left text-sm transition-colors">
                          🏥 Find nearby medical centers
                        </button>
                        <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 p-3 rounded-lg text-left text-sm transition-colors">
                          💧 Water-borne disease info
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Type your message, ${userName}...`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isTyping}
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || isTyping}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      ⚠️ For medical emergencies, contact your doctor immediately
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}