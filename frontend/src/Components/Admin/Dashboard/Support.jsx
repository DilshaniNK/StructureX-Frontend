import React, { useState } from 'react';
import { 
  MessageSquare,  
  User,  
  Calendar, 
  Send, 
  Paperclip, 
  Search, 
  Tag,
  RefreshCw,
  X,
  Menu,
  Phone,
  Mail,
  Trash2,
  Reply
} from 'lucide-react';

const AdminSupportDashboard = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [ticketStatus, setTicketStatus] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const removeTicket = (ticketId) => {
    setSupportTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null);
      setSidebarOpen(true);
    }
  };

  const [supportTickets, setSupportTickets] = useState([
    {
      id: 'TK-001',
      subject: 'Unable to Access Dashboard',
      message: 'I\'ve been trying to log into my dashboard for the past hour but keep getting an error message. Can you please help me resolve this issue?',
      status: 'open',
      category: 'Technical Support',
      submittedBy: {
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        mobile: '+1 (555) 123-4567'
      },
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      assignedTo: 'Sarah Wilson',
      tags: ['dashboard', 'login', 'urgent'],
      replies: [
        {
          id: 1,
          sender: 'admin',
          senderName: 'Sarah Wilson',
          message: 'Hi John, I\'ve received your request. Could you please share what error message you\'re seeing exactly?',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          attachments: []
        }
      ],
      attachments: [
        { name: 'error_screenshot.png', size: '245 KB', type: 'image' }
      ]
    },
    {
      id: 'TK-002',
      subject: 'Account Setup Issues',
      message: 'Hi team, I\'m having trouble setting up my new account. The verification email hasn\'t arrived and I\'ve checked my spam folder multiple times.',
      status: 'resolved',
      category: 'Account Management',
      submittedBy: {
        fullName: 'Emily Johnson',
        email: 'emily.j@company.com',
        mobile: '+1 (555) 987-6543'
      },
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
      assignedTo: 'Mike Chen',
      tags: ['account', 'verification', 'email'],
      replies: [
        {
          id: 1,
          sender: 'admin',
          senderName: 'Mike Chen',
          message: 'Hi Emily! I\'ve resent the verification email to your address. Please check your inbox and let me know if you receive it.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          attachments: []
        },
        {
          id: 2,
          sender: 'user',
          senderName: 'Emily Johnson',
          message: 'Perfect! I received the email and was able to verify my account successfully. Thank you for your quick help!',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          attachments: []
        }
      ],
      attachments: []
    },
    {
      id: 'TK-003',
      subject: 'Payment Processing Error',
      message: 'I\'m trying to process a payment but keep getting a "transaction failed" error. My card details are correct and I have sufficient funds.',
      status: 'open',
      category: 'Billing',
      submittedBy: {
        fullName: 'Michael Davis',
        email: 'mdavis@business.com',
        mobile: '+1 (555) 456-7890'
      },
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
      assignedTo: 'Lisa Park',
      tags: ['payment', 'billing', 'urgent'],
      replies: [],
      attachments: []
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.submittedBy.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.submittedBy.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ticketCounts = {
    all: supportTickets.length,
    open: supportTickets.filter(t => t.status === 'open').length,
    resolved: supportTickets.filter(t => t.status === 'resolved').length
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    const newReply = {
      id: selectedTicket.replies.length + 1,
      sender: 'admin',
      senderName: 'Admin Support',
      message: replyText,
      timestamp: new Date(),
      attachments: []
    };

    setSupportTickets(prev => 
      prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              replies: [...ticket.replies, newReply],
              lastUpdated: new Date(),
              status: ticketStatus || ticket.status
            }
          : ticket
      )
    );

    setReplyText('');
    setTicketStatus('');
    
    // Update selected ticket
    setSelectedTicket(prev => ({
      ...prev,
      replies: [...prev.replies, newReply],
      lastUpdated: new Date(),
      status: ticketStatus || prev.status
    }));
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setSupportTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, lastUpdated: new Date() }
          : ticket
      )
    );
    
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, status: newStatus, lastUpdated: new Date() }));
    }
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setSidebarOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const closeTicketDetails = () => {
    setSelectedTicket(null);
    setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#FAAD00] flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Support
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex h-screen pt-16 lg:pt-0">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar - Ticket List */}
        <div className={`
          ${!selectedTicket ? 'lg:w-full' : 'lg:w-1/3'} 
          ${sidebarOpen || !selectedTicket ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${selectedTicket ? 'hidden lg:block' : 'block'}
          fixed lg:relative z-50 lg:z-auto w-full lg:w-auto h-full
          border-r border-gray-700 bg-gray-900 transition-all duration-300
        `}>
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl lg:text-2xl font-bold text-[#FAAD00] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6" />
                <span className="hidden lg:inline">Support Tickets</span>
              </h1>
              <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
              <div className="bg-gray-800 rounded-lg p-3 lg:p-4">
                <p className="text-xs lg:text-sm text-gray-400">Open Tickets</p>
                <p className="text-lg lg:text-xl font-bold text-red-400">{ticketCounts.open}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 lg:p-4">
                <p className="text-xs lg:text-sm text-gray-400">Resolved</p>
                <p className="text-lg lg:text-xl font-bold text-green-400">{ticketCounts.resolved}</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3 lg:space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#FAAD00] focus:outline-none text-sm lg:text-base"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#FAAD00] focus:outline-none text-sm lg:text-base"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Ticket List */}
          <div className="h-[calc(100vh-16rem)] lg:h-[calc(100vh-20rem)] overflow-y-auto">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-3 lg:p-4 border-b border-gray-700 hover:bg-gray-800/50 transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-gray-800 border-l-4 border-l-[#FAAD00]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleTicketSelect(ticket)}
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-mono text-xs lg:text-sm text-gray-400">{ticket.id}</span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>

                    <h3 className="font-semibold text-white mb-1 line-clamp-2 text-sm lg:text-base">{ticket.subject}</h3>
                    <p className="text-xs lg:text-sm text-gray-400 mb-2 line-clamp-2">{ticket.message}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="truncate mr-2">{ticket.submittedBy.fullName}</span>
                      <span className="whitespace-nowrap">{getTimeAgo(ticket.lastUpdated)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTicketSelect(ticket);
                        document.querySelector('textarea')?.focus();
                      }}
                      className="p-2 bg-[#FAAD00] text-black rounded-lg hover:bg-[#FFC746] transition-colors"
                      title="Reply to ticket"
                    >
                      <Reply className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTicket(ticket.id);
                      }}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Remove ticket"
                    >
                      <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Ticket Details */}
        {selectedTicket && (
          <div className={`
            ${selectedTicket ? 'block' : 'hidden lg:block'}
            flex-1 flex flex-col h-full bg-gray-900
            fixed lg:relative inset-0 lg:inset-auto z-30 lg:z-auto
          `}>
            {/* Ticket Header */}
            <div className="p-4 lg:p-6 border-b border-gray-700 bg-gray-800 flex-shrink-0">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 flex-wrap">
                    <h2 className="text-lg lg:text-xl font-bold text-white truncate">{selectedTicket.subject}</h2>
                    <span className="font-mono text-xs lg:text-sm text-gray-400 whitespace-nowrap">{selectedTicket.id}</span>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="truncate">{selectedTicket.submittedBy.fullName}</span>
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                      {getTimeAgo(selectedTicket.submittedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="truncate">{selectedTicket.category}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                    className="px-2 lg:px-3 py-1 lg:py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#FAAD00] focus:outline-none text-xs lg:text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  <button
                    onClick={closeTicketDetails}
                    className="p-1 lg:p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-700/50 rounded-lg p-3 lg:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Customer</p>
                    <p className="text-sm text-white truncate">{selectedTicket.submittedBy.fullName}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <div className="flex items-center gap-1 min-w-0">
                      <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-white truncate">{selectedTicket.submittedBy.email}</p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Mobile</p>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-white">{selectedTicket.submittedBy.mobile}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
              {/* Original Message */}
              <div className="bg-gray-800 rounded-lg p-3 lg:p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#FAAD00] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 lg:w-4 lg:h-4 text-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white text-sm lg:text-base truncate">{selectedTicket.submittedBy.fullName}</p>
                    <p className="text-xs text-gray-400">{getTimeAgo(selectedTicket.submittedAt)}</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed mb-3 text-sm lg:text-base">{selectedTicket.message}</p>
                
                {selectedTicket.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{attachment.name}</span>
                        <span className="text-xs text-gray-500">({attachment.size})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Replies */}
              {selectedTicket.replies.map((reply) => (
                <div key={reply.id} className={`mb-4 ${
                  reply.sender === 'admin' ? 'lg:ml-8' : 'lg:mr-8'
                }`}>
                  <div className={`rounded-lg p-3 lg:p-4 ${
                    reply.sender === 'admin' 
                      ? 'bg-[#FAAD00]/10 border border-[#FAAD00]/20' 
                      : 'bg-gray-800'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        reply.sender === 'admin' 
                          ? 'bg-[#FAAD00] text-black' 
                          : 'bg-gray-600 text-white'
                      }`}>
                        <User className="w-3 h-3 lg:w-4 lg:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white text-sm lg:text-base truncate">{reply.senderName}</p>
                        <p className="text-xs text-gray-400">{getTimeAgo(reply.timestamp)}</p>
                      </div>
                      {reply.sender === 'admin' && (
                        <span className="px-2 py-1 bg-[#FAAD00]/20 text-[#FAAD00] text-xs rounded-full whitespace-nowrap">
                          Support Team
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm lg:text-base">{reply.message}</p>
                    
                    {reply.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {reply.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">{attachment.name}</span>
                            <span className="text-xs text-gray-500">({attachment.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Section */}
            <div className="p-4 lg:p-6 border-t border-gray-700 bg-gray-800 flex-shrink-0">
              <div className="mb-4">
                <div className="flex items-center gap-2 lg:gap-4 mb-3">
                  <select
                    value={ticketStatus}
                    onChange={(e) => setTicketStatus(e.target.value)}
                    className="flex-1 lg:flex-none px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#FAAD00] focus:outline-none text-sm"
                  >
                    <option value="">Keep current status</option>
                    <option value="open">Mark as Open</option>
                    <option value="resolved">Mark as Resolved</option>
                  </select>
                </div>
                
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#FAAD00] focus:outline-none resize-none text-sm lg:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400">Attach files</span>
                </div>

                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-[#FAAD00] text-black rounded-lg hover:bg-[#FFC746] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                >
                  <Send className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no ticket selected on desktop */}
        {!selectedTicket && (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-800/50">
            <div className="text-center text-gray-400">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Select a ticket to view details</p>
              <p className="text-sm">Choose a support ticket from the list to start managing it</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportDashboard;