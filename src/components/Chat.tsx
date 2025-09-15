"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageCircle, ImageIcon, Send, Loader2, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: Date.now().toString(),
        role: "assistant",
        content: `👋 **Welcome to Your AI Health Assistant!**

I'm here to help you with water-borne diseases and health concerns. Here's what I can do:

🔬 **Analyze Images**: 
   • Water quality assessment
   • Symptom identification  
   • Environmental health risks
   • Sanitation conditions

💬 **Answer Questions About**:
   • Water-borne diseases (cholera, typhoid, hepatitis A, etc.)
   • Prevention strategies
   • Treatment recommendations
   • Public health guidance

📸 **To share an image**: Click the 📷 button or drag & drop an image here

⚠️ **Important**: I provide educational information only. Always consult healthcare professionals for medical diagnosis and treatment.

How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  }, [messages.length]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processImageFile(imageFile);
    } else {
      alert("Please drop a valid image file");
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    setIsLoading(true);
    
    // Determine message content based on input and image
    let messageContent = input || "";
    if (selectedImage && !input.trim()) {
      messageContent = "📷 Please analyze this image for health or water quality concerns";
    } else if (selectedImage && input.trim()) {
      messageContent = `${input}\n\n📷 Image attached for analysis`;
    }
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      image: imagePreview || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date()
    }]);

    // Clear input and image
    const messageText = input;
    setInput("");
    const imageFile = selectedImage;
    clearImage();

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("message", messageText);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream available");

      let assistantContent = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                assistantContent += data.text;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: assistantContent }
                      : msg
                  )
                );
              }
              if (data.done) {
                break;
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // If no content was received, show a helpful message
      if (!assistantContent.trim()) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: "I'm sorry, I couldn't process your request. Please try again with a different image or question." }
              : msg
          )
        );
      }

    } catch (error) {
      console.error("Chat error:", error);
      let errorMessage = "I'm experiencing technical difficulties. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = "The chat service is temporarily unavailable. Please try again later.";
        } else if (error.message.includes('413')) {
          errorMessage = "The image is too large. Please try a smaller image (under 10MB).";
        } else if (error.message.includes('400')) {
          errorMessage = "There was an issue with your request. Please check your image format and try again.";
        }
      }
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: `❌ ${errorMessage}\n\n💡 **Tip**: I work best with clear images of water, symptoms, or environmental conditions related to health.` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          AI Health Assistant
        </h2>
      </div>
      
      {/* Messages Area with Drag & Drop */}
      <div 
        className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors ${
          isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-blue-500 mb-2" />
              <p className="text-blue-600 font-medium">Drop your image here</p>
              <p className="text-sm text-blue-500">For water quality or health analysis</p>
            </div>
          </div>
        )}
        
        {!isDragOver && messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {msg.image && (
                <div className="mb-2">
                  <img 
                    src={msg.image} 
                    alt="Shared image" 
                    className="max-w-full h-auto rounded border max-h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(msg.image, '_blank')}
                  />
                  <p className="text-xs opacity-60 mt-1">📷 Click to view full size</p>
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">
                {selectedImage ? "Analyzing image..." : "Thinking..."}
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 pb-2">
          <div className="bg-gray-50 rounded-lg p-3 border">
            <p className="text-xs text-gray-600 mb-2">📷 Image ready to send:</p>
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-24 rounded border shadow-sm"
              />
              <Button
                onClick={clearImage}
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 I'll analyze this for water quality, health symptoms, or environmental risks
            </p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              variant="outline"
              className="px-3"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about water-borne diseases..."
              className="flex-1"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleSend} 
            size="sm"
            disabled={isLoading || (!input.trim() && !selectedImage)}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="mt-2 text-xs text-muted-foreground">
          💡 <strong>I can analyze:</strong> Water quality, symptoms, skin conditions, eye problems, environmental risks
          <br />
          📸 <strong>Send images by:</strong> Clicking the camera button or dragging & dropping
          <br />
          ⚠️ <strong>Disclaimer:</strong> Educational purposes only - consult healthcare professionals for medical advice
        </p>
      </div>
    </div>
  );
}
