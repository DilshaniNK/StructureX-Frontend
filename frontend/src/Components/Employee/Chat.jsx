import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Paperclip, Search, Phone, Video, MoreVertical, Plus, X, Download,
  FileText, Image, Users, Settings, LogOut, Bell, BellOff
} from 'lucide-react';

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(1);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState('voice');
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [contacts, setContacts] = useState([
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
      avatar: 'JS',
      phoneNumber: '+1 (555) 123-4567'
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
      avatar: 'SJ',
      phoneNumber: '+1 (555) 234-5678'
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
      avatar: 'MC',
      phoneNumber: '+1 (555) 345-6789'
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John Smith',
      message: 'Good morning everyone! Foundation work for Block A is complete.',
      timestamp: '9:00 AM',
      type: 'received',
      avatar: 'JS',
      messageType: 'text'
    },
    {
      id: 2,
      sender: 'You',
      message: 'Excellent work! How are we looking for the steel beam delivery?',
      timestamp: '9:15 AM',
      type: 'sent',
      messageType: 'text'
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      message: 'Steel beams are scheduled for delivery tomorrow at 8 AM. Safety protocols are in place.',
      timestamp: '9:20 AM',
      type: 'received',
      avatar: 'SJ',
      messageType: 'text'
    },
    {
      id: 4,
      sender: 'You',
      message: 'Perfect. Please ensure the crane operator is available.',
      timestamp: '9:25 AM',
      type: 'sent',
      messageType: 'text'
    },
    {
      id: 5,
      sender: 'John Smith',
      message: 'Crane operator confirmed. Also, we might need additional workers for the installation.',
      timestamp: '9:30 AM',
      type: 'received',
      avatar: 'JS',
      messageType: 'text'
    },
    {
      id: 6,
      sender: 'You',
      message: "I'll arrange for 2 additional workers. What about the weather forecast?",
      timestamp: '9:35 AM',
      type: 'sent',
      messageType: 'text'
    },
    {
      id: 7,
      sender: 'Sarah Johnson',
      message: 'Weather looks good for tomorrow. Clear skies expected.',
      timestamp: '10:30 AM',
      type: 'received',
      avatar: 'SJ',
      messageType: 'text'
    }
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    phoneNumber: '',
    type: 'individual'
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent',
        messageType: 'text'
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      setContacts(prev => prev.map(contact =>
        contact.id === selectedContact
          ? { ...contact, lastMessage: message.trim(), lastMessageTime: 'Now' }
          : contact
      ));

      setIsTyping(true);
      setTimeout(() => {
        const responses = [
          'Got it, thanks!',
          'Will do.',
          'Understood.',
          'Perfect!',
          'Noted.',
          'On it!',
          'Thanks for the update.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const selectedContactData = contacts.find(c => c.id === selectedContact);

        if (selectedContactData) {
          const responseMessage = {
            id: messages.length + 2,
            sender: selectedContactData.name,
            message: randomResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'received',
            avatar: selectedContactData.avatar,
            messageType: 'text'
          };
          setMessages(prev => [...prev, responseMessage]);
          setIsTyping(false);
        }
      }, 2000);
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const fileAttachment = {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          type: file.type,
          url: URL.createObjectURL(file)
        };

        const fileMessage = {
          id: messages.length + 1,
          sender: 'You',
          message: `Shared a file: ${file.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'sent',
          messageType: file.type.startsWith('image/') ? 'image' : 'file',
          fileName: file.name,
          fileSize: fileAttachment.size,
          fileUrl: fileAttachment.url
        };

        setMessages(prev => [...prev, fileMessage]);
        setAttachments(prev => [...prev, fileAttachment]);
      });
    }
  };

  const handleCall = (type) => {
    setCallType(type);
    setShowCallDialog(true);
  };

  const initiateCall = () => {
    const selectedContactData = contacts.find(c => c.id === selectedContact);
    if (selectedContactData) {
      alert(`Initiating ${callType} call with ${selectedContactData.name}...`);
    }
    setShowCallDialog(false);
  };

  const handleAddContact = () => {
    if (newContact.name.trim()) {
      const contact = {
        id: contacts.length + 1,
        name: newContact.name,
        type: newContact.type,
        role: newContact.role || undefined,
        lastMessage: 'No messages yet',
        lastMessageTime: 'Now',
        unreadCount: 0,
        online: Math.random() > 0.5,
        avatar: newContact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        phoneNumber: newContact.phoneNumber || undefined
      };

      setContacts(prev => [...prev, contact]);
      setNewContact({ name: '', role: '', phoneNumber: '', type: 'individual' });
      setShowAddContact(false);
    }
  };

  const markAsRead = (contactId) => {
    setContacts(prev => prev.map(contact =>
      contact.id === contactId ? { ...contact, unreadCount: 0 } : contact
    ));
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.role && contact.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedContactData = contacts.find(c => c.id === selectedContact);

  return (
    <>
      <div className="h-[calc(100vh-2rem)] flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
        />

        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleNotifications}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={notifications ? 'Disable notifications' : 'Enable notifications'}
                >
                  {notifications ? (
                    <Bell size={18} className="text-gray-600" />
                  ) : (
                    <BellOff size={18} className="text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => setShowAddContact(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Add new contact"
                >
                  <Plus size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact.id);
                  markAsRead(contact.id);
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-white transition-colors ${selectedContact === contact.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${contact.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
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
                        <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
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
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${selectedContactData?.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
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
                {selectedContactData?.online ? (
                  <p className="text-xs text-green-600">Online</p>
                ) : (
                  <p className="text-xs text-gray-500">Offline</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCall('voice')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Voice call"
              >
                <Phone size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => handleCall('video')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Video call"
              >
                <Video size={20} className="text-gray-600" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                      <Users size={16} />
                      <span>View group info</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                      <Settings size={16} />
                      <span>Chat settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600">
                      <LogOut size={16} />
                      <span>Leave chat</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.type === 'sent' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}>
                  {msg.type === 'received' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      {msg.avatar}
                    </div>
                  )}
                  <div className={`rounded-lg px-4 py-2 ${msg.type === 'sent'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                    {msg.type === 'received' && (
                      <p className="text-xs font-medium mb-1 opacity-75">{msg.sender}</p>
                    )}

                    {msg.messageType === 'file' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText size={16} />
                        <div>
                          <p className="text-sm font-medium">{msg.fileName}</p>
                          <p className="text-xs opacity-75">{msg.fileSize}</p>
                        </div>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Download size={14} />
                        </button>
                      </div>
                    )}

                    {msg.messageType === 'image' && msg.fileUrl && (
                      <div className="mb-2">
                        <img
                          src={msg.fileUrl}
                          alt={msg.fileName}
                          className="max-w-full h-auto rounded"
                          style={{ maxHeight: '200px' }}
                        />
                      </div>
                    )}

                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {selectedContactData?.avatar}
                  </div>
                  <div className="bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFileAttachment}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Attach file"
              >
                <Paperclip size={20} className="text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Add Contact Modal */}
        {showAddContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Contact</h3>
                <button onClick={() => setShowAddContact(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={newContact.role}
                    onChange={(e) => setNewContact(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter role (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newContact.phoneNumber}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newContact.type}
                    onChange={(e) => setNewContact(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddContact(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddContact}
                  disabled={!newContact.name.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call Dialog */}
        {showCallDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-80">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-medium mx-auto mb-4 ${selectedContactData?.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                  {selectedContactData?.avatar}
                </div>
                <h3 className="text-lg font-semibold mb-2">{selectedContactData?.name}</h3>
                <p className="text-gray-600 mb-4">
                  Initiate {callType} call?
                  {selectedContactData?.phoneNumber && (
                    <span className="block text-sm">{selectedContactData.phoneNumber}</span>
                  )}
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowCallDialog(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={initiateCall}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close menus */}
        {showMenu && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>
    </>
  );
};

export default Chat;
