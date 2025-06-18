import React, { useState } from 'react';
import { Send, Paperclip, Search, Phone, Video, MoreVertical, Plus } from 'lucide-react';

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(1);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const contacts = [
    {
      id: 1,
      name: 'Project Team',
      type: 'group',
      lastMessage: 'Foundation work completed successfully',
      lastMessageTime: '10:30 AM',
      unreadCount: 2,
      online: true,
      avatar: 'PT'
    },
    {
      id: 2,
      name: 'John Smith',
      type: 'individual',
      role: 'Site Manager',
      lastMessage: 'Will check the steel delivery schedule',
      lastMessageTime: '9:45 AM',
      unreadCount: 0,
      online: true,
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      type: 'individual',
      role: 'Safety Inspector',
      lastMessage: 'Safety report uploaded',
      lastMessageTime: 'Yesterday',
      unreadCount: 1,
      online: false,
      avatar: 'SJ'
    },
    {
      id: 4,
      name: 'Client Group',
      type: 'group',
      lastMessage: 'Approved the design changes',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      online: true,
      avatar: 'CG'
    },
    {
      id: 5,
      name: 'Mike Chen',
      type: 'individual',
      role: 'Architect',
      lastMessage: 'Updated blueprints shared',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
      online: false,
      avatar: 'MC'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'John Smith',
      message: 'Good morning everyone! Foundation work for Block A is complete.',
      timestamp: '9:00 AM',
      type: 'received',
      avatar: 'JS'
    },
    {
      id: 2,
      sender: 'You',
      message: 'Excellent work! How are we looking for the steel beam delivery?',
      timestamp: '9:15 AM',
      type: 'sent'
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      message: 'Steel beams are scheduled for delivery tomorrow at 8 AM. Safety protocols are in place.',
      timestamp: '9:20 AM',
      type: 'received',
      avatar: 'SJ'
    },
    {
      id: 4,
      sender: 'You',
      message: 'Perfect. Please ensure the crane operator is available.',
      timestamp: '9:25 AM',
      type: 'sent'
    },
    {
      id: 5,
      sender: 'John Smith',
      message: 'Crane operator confirmed. Also, we might need additional workers for the installation.',
      timestamp: '9:30 AM',
      type: 'received',
      avatar: 'JS'
    },
    {
      id: 6,
      sender: 'You',
      message: 'I\'ll arrange for 2 additional workers. What about the weather forecast?',
      timestamp: '9:35 AM',
      type: 'sent'
    },
    {
      id: 7,
      sender: 'Sarah Johnson',
      message: 'Weather looks good for tomorrow. Clear skies expected.',
      timestamp: '10:30 AM',
      type: 'received',
      avatar: 'SJ'
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      setMessage('');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.role && contact.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedContactData = contacts.find(c => c.id === selectedContact);

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedContact === contact.id ? 'bg-primary-50 border-primary-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                    contact.type === 'group' ? 'bg-secondary-500' : 'bg-primary-500'
                  }`}>
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                  </div>
                  {contact.role && (
                    <p className="text-xs text-gray-500 mb-1">{contact.role}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && (
                      <span className="ml-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                selectedContactData?.type === 'group' ? 'bg-secondary-500' : 'bg-primary-500'
              }`}>
                {selectedContactData?.avatar}
              </div>
              {selectedContactData?.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{selectedContactData?.name}</h3>
              {selectedContactData?.role && (
                <p className="text-sm text-gray-500">{selectedContactData.role}</p>
              )}
              {selectedContactData?.online && (
                <p className="text-xs text-green-600">Online</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Video size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                msg.type === 'sent' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}>
                {msg.type === 'received' && (
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {msg.avatar}
                  </div>
                )}
                <div className={`rounded-lg px-4 py-2 ${
                  msg.type === 'sent' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {msg.type === 'received' && (
                    <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.type === 'sent' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Paperclip size={20} className="text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={handleSendMessage}
              className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;