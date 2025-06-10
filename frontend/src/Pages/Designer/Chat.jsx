import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi John! I've reviewed your latest floor plan design. The dimensions look good overall.",
      sender: "QS Officer",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      text: "Thank you for the feedback! Should I proceed with the structural calculations for the foundation?",
      sender: "You",
      timestamp: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      text: "Yes, please go ahead. Also, can you adjust the kitchen layout as we discussed?",
      sender: "QS Officer",
      timestamp: "10:35 AM",
      isOwn: false
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">QS</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Senior QS Officer</h2>
            <p className="text-sm text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Online
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isOwn
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isOwn ? 'text-yellow-100' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 rounded-b-lg">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows="1"
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                overflow: 'auto'
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-lg transition-colors ${
              newMessage.trim()
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}