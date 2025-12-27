"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { MessageCircle, X, Send, User, RotateCcw, History, ChevronLeft, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [chatStage, setChatStage] = useState<'name' | 'welcome' | 'chat'>('name');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'bot', timestamp: Date, imageUrl?: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // For selected image before sending
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Chat history state
  interface SavedChat {
    id: string;
    title: string;
    userName: string;
    messages: Array<{id: string, text: string, sender: 'user' | 'bot', timestamp: string, imageUrl?: string}>;
    createdAt: string;
  }
  const [chatHistory, setChatHistory] = useState<SavedChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('curevo-chat-history');
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('curevo-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Auto-save current chat when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 1 && userName) {
      const chatTitle = generateChatTitle(messages);
      setChatHistory(prev => {
        const existingIndex = prev.findIndex(c => c.id === currentChatId);
        const updatedChat: SavedChat = {
          id: currentChatId,
          title: chatTitle,
          userName,
          messages: messages.map(m => ({...m, timestamp: m.timestamp.toISOString()})),
          createdAt: existingIndex >= 0 ? prev[existingIndex].createdAt : new Date().toISOString()
        };
        if (existingIndex >= 0) {
          const newHistory = [...prev];
          newHistory[existingIndex] = updatedChat;
          return newHistory;
        }
        return [updatedChat, ...prev];
      });
    }
  }, [messages, currentChatId, userName]);

  // Generate chat title from first user message
  const generateChatTitle = (msgs: typeof messages) => {
    const firstUserMsg = msgs.find(m => m.sender === 'user');
    if (firstUserMsg) {
      const text = firstUserMsg.text.slice(0, 30);
      return text.length < firstUserMsg.text.length ? text + '...' : text;
    }
    return 'New Chat';
  };

  // Helper to remove markdown and stray asterisks for clean display
  const sanitizeText = (text: string) => {
    if (!text) return text;
    let t = text;

    // Convert markdown links [text](url) -> text
    t = t.replace(/\[([^\]]+)\]\((?:https?:\/\/)?[^\)]+\)/g, '$1');

    // Remove bold **text** and __text__
    t = t.replace(/\*\*([^*]+)\*\*/g, '$1');
    t = t.replace(/__([^_]+)__/g, '$1');

    // Remove italic *text* and _text_
    t = t.replace(/\*([^*]+)\*/g, '$1');
    t = t.replace(/_([^_]+)_/g, '$1');

    // Remove inline code `code`
    t = t.replace(/`([^`]+)`/g, '$1');

    // Remove any remaining stray asterisks or backticks
    t = t.replace(/\*+/g, '');
    t = t.replace(/`+/g, '');

    // Collapse multiple spaces and trim
    t = t.replace(/\s{2,}/g, ' ').trim();

    return t;
  };

  useEffect(() => {
    // Show the popup after 3 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
        voice.name.toLowerCase().includes('samantha')
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
      // Create new chat ID for this session
      setCurrentChatId(Date.now().toString());
      
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

  // Helper to send FormData to API and stream response (returns accumulated text)
  const sendToApi = async (formData: FormData) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get response');
    }

    const reader = response.body?.getReader();
    let accumulatedText = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                accumulatedText += data.text;
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    }

    return accumulatedText;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() && !selectedImage) return;

    const userMessage = {
      id: Date.now().toString(),
      text: currentMessage.trim(),
      sender: 'user' as const,
      timestamp: new Date(),
      imageUrl: selectedImageUrl || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('message', userMessage.text);
      
      // If an image is selected and user pressed send, include it
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const accumulatedText = await sendToApi(formData);

      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: sanitizeText(accumulatedText),
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      // clear selected image after send
      if (selectedImage) {
        setSelectedImage(null);
        setSelectedImageUrl(null);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: sanitizeText(error instanceof Error ? `Sorry, ${error.message}` : "Sorry, I'm having trouble responding right now. Please try again."),
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle file selection: set preview and let user add a caption before sending
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    // store selected file and preview URL, but do not upload yet
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setSelectedImageUrl(imageUrl);

    // prefill message placeholder if empty
    if (!currentMessage.trim()) {
      setCurrentMessage('');
    }

    // focus input so user can write caption
    setTimeout(() => inputRef.current?.focus(), 100);
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
    // focus input when opening chat panel
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const hidePopup = () => {
    setShowPopup(false);
  };

  const startNewChat = () => {
    // Current chat is auto-saved via useEffect, just start fresh
    setCurrentChatId(Date.now().toString());
    setMessages([]);
    setCurrentMessage("");
    setSelectedImage(null);
    setSelectedImageUrl(null);
    // Keep userName so user doesn't have to re-enter
    setChatStage('chat');
    // Add welcome message for new chat
    setMessages([{
      id: '1',
      text: `Hello ${userName}! 👋 Starting a new conversation. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    }]);
    setShowHistory(false);
    // Stop any playing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const loadChat = (chat: typeof chatHistory[0]) => {
    setCurrentChatId(chat.id);
    setUserName(chat.userName);
    setMessages(chat.messages.map(m => ({...m, timestamp: new Date(m.timestamp)})));
    setChatStage('chat');
    setShowHistory(false);
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      startNewChat();
    }
    // Update localStorage
    const updated = chatHistory.filter(c => c.id !== chatId);
    localStorage.setItem('curevo-chat-history', JSON.stringify(updated));
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
              className="absolute -top-12 -left-24 bg-blue-600 text-white px-2 py-1.5 rounded-md shadow-xl whitespace-nowrap"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <span className="font-medium text-xs">NEED HELP? ASK CUREVO</span>
                <button
                  onClick={hidePopup}
                  className="ml-1 text-white/80 hover:text-white"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-blue-600"></div>
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
            <div className="w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
              
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
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        title="Chat history"
                      >
                        <History size={20} />
                      </button>
                      <div>
                        <h3 className="font-bold text-lg">Hello, {userName}!</h3>
                        <p className="text-blue-100 text-sm flex items-center gap-1">
                          Curevo Health Assistant
                          {isPlaying && <span className="text-yellow-300">🔊</span>}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={startNewChat}
                      className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      title="Start new chat"
                    >
                      <RotateCcw size={14} />
                      New
                    </button>
                  </div>

                  {/* Chat History Panel */}
                  <AnimatePresence>
                    {showHistory && (
                      <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-white z-10 flex flex-col"
                      >
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center gap-3">
                          <button
                            onClick={() => setShowHistory(false)}
                            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <h3 className="font-bold text-lg">Chat History</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                          {chatHistory.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                              <History size={40} className="mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No saved chats yet</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {chatHistory.map((chat) => (
                                <div
                                  key={chat.id}
                                  onClick={() => loadChat(chat)}
                                  className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between group ${
                                    currentChatId === chat.id 
                                      ? 'bg-blue-100 border-l-4 border-blue-600' 
                                      : 'hover:bg-gray-100'
                                  }`}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-800 truncate">
                                      {chat.title || 'New Chat'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(chat.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => deleteChat(chat.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded transition-all"
                                    title="Delete chat"
                                  >
                                    <Trash2 size={14} className="text-red-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="p-3 border-t">
                          <button
                            onClick={startNewChat}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <RotateCcw size={16} />
                            New Chat
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50 max-h-80">
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
                          {message.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={message.imageUrl}
                                alt="Uploaded content"
                                className="max-w-full h-auto rounded-lg shadow-sm"
                              />
                            </div>
                          )}
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
                        <button onClick={() => {
                          // Prefill chat input and switch to chat
                          if (!isOpen) setIsOpen(true);
                          setChatStage('chat');
                          setCurrentMessage('I have symptoms to report: ');
                          setTimeout(() => inputRef.current?.focus(), 100);
                        }} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg text-left text-sm transition-colors">
                          🤒 I have symptoms to report
                        </button>
                        <button onClick={() => router.push('/map')} className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg text-left text-sm transition-colors">
                          🏥 Find nearby medical centers
                        </button>
                        <button onClick={() => router.push('/diseases')} className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 p-3 rounded-lg text-left text-sm transition-colors">
                          💧 Water-borne disease info
                        </button>
                      </div>
                    )}
                    
                    {/* Invisible element to scroll to */}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t bg-white">
                    {/* Selected image preview (if any) */}
                    {selectedImageUrl && (
                      <div className="p-2 border rounded mb-2 flex items-start gap-2">
                        <img src={selectedImageUrl} alt="preview" className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 mb-1">Image selected — add a caption or press send</p>
                          <button onClick={() => { setSelectedImage(null); setSelectedImageUrl(null); }} className="text-red-500 text-sm">Remove</button>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Type your message, ${userName}...`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isTyping}
                      />
                      {/* Image upload button (logo) */}
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload image"
                        className="bg-white hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg mr-2 border"
                      >
                        📷
                      </button>

                      <button 
                        onClick={handleSendMessage}
                        disabled={(!currentMessage.trim() && !selectedImage) || isTyping}
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