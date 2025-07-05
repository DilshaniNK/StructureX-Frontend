import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  MapPin,
  Calendar,
  Save,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Edit3,
  Trash2,
  Plus,
  Clock,
  BarChart3,
  Building2,
  UserCheck,
  X,
  ExternalLink
} from 'lucide-react';

const laborCategories = [
  { id: 'mason', name: 'Mason', icon: '🧱', color: 'bg-orange-100 text-orange-800' },
  { id: 'carpenter', name: 'Carpenter', icon: '🔨', color: 'bg-amber-100 text-amber-800' },
  { id: 'plumber', name: 'Plumber', icon: '🔧', color: 'bg-blue-100 text-blue-800' },
  { id: 'electrician', name: 'Electrician', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'helper', name: 'Helper', icon: '👷', color: 'bg-green-100 text-green-800' }
];

export default function Labors() {
  const [sites, setSites] = useState([]);

  const [selectedSite, setSelectedSite] = useState('');
  const [date, setSelectedDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [hiring_type, setHiringType] = useState('');
  const [labor_type, setLaborType] = useState('');
  const [count, setCount] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8086/api/v1/financial_officer`)
      .then((res) => {
        if (res.data) {
          setSites(res.data); // Set all sites into state
        }
      })
      .catch((error) => {
        console.error('Failed to fetch sites:', error);
      });
  }, []);


  useEffect(() => {
    axios.get(`http://localhost:8086/api/v1/site_supervisor`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRecords(res.data);
        } else {
          console.warn("Unexpected response format:", res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch attendance records:", err);
      });
  }, []);





  const [attendance, setAttendance] = useState({});
  const [thirdPartyAttendance, setThirdPartyAttendance] = useState({});
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'thirdparty'
  const [thirdPartyCompanies, setThirdPartyCompanies] = useState([]);


  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', contact: '', specialization: '' });


  const handleSiteChange = (e) => {
    setSelectedSite(e.target.value);
    setAttendance({});
    setThirdPartyAttendance({});
  };

  const handleCountChange = (category, value) => {
    setAttendance((prev) => ({
      ...prev,
      [category]: parseInt(value) || 0,
    }));
  };

  const handleThirdPartyCountChange = (labor_type, value) => {
    setThirdPartyAttendance((prev) => ({
      ...prev,
      [labor_type]: parseInt(value) || 0,
    }));
  };



  const addThirdPartyCompany = () => {
    if (!newCompany.name.trim()) return;

    const company = {
      id: `tp${Date.now()}`,
      name: newCompany.name,
      contact: newCompany.contact,
      specialization: newCompany.specialization
    };

    setThirdPartyCompanies(prev => [...prev, company]);
    setNewCompany({ name: '', contact: '', specialization: '' });
    setShowAddCompanyModal(false);

    // Success notification
    showNotification('3rd Party Company added successfully!', 'success');
  };

  const removeThirdPartyCompany = (companyId) => {
    setThirdPartyCompanies(prev => prev.filter(company => company.id !== companyId));
    setThirdPartyAttendance(prev => {
      const updated = { ...prev };
      delete updated[companyId];
      return updated;
    });
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!selectedSite) {
      showNotification('Please select a site.', 'error');
      return;
    }

    const hasDirectWorkers = Object.values(attendance).some(count => count > 0);
    const hasThirdPartyWorkers = Object.values(thirdPartyAttendance).some(count => count > 0);

    if (!hasDirectWorkers && !hasThirdPartyWorkers) {
      showNotification('Please enter attendance for at least one worker category or 3rd party company.', 'error');
      return;
    }

    setIsSubmitting(true);

    // 🔁 Create payload array
    const directPayload = Object.entries(attendance).map(([labor_type, count]) => ({
      project_id: selectedSite
      ,// ensure it's a number
      date: date,
      hiring_type: "Direct worker",
      labor_type,
      count: parseInt(count),
      company: ""
    }));

    const thirdPartyPayload = Object.entries(thirdPartyAttendance).map(([labor_type, count]) => ({
      project_id: selectedSite
      ,// ensure it's a number
      date: date,
      hiring_type: "3rd party worker",
      labor_type,
      count: parseInt(count),
      company,
    }));



    const payload = [...directPayload, ...thirdPartyPayload];

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    try {
      await axios.post('http://localhost:8086/api/v1/site_supervisor', payload);
      showNotification('Attendance submitted successfully!', 'success');
      setAttendance({});
      setThirdPartyAttendance({});
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
      showNotification('Failed to submit attendance', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const deleteRecord = (id) => {
    axios.delete(`http://localhost:8086/api/v1/site_supervisor`)
      .then(() => {
        setRecords(prev => prev.filter(record => record.id !== id));
        setIsSaved(false);
        setIsEditing(false);
        alert('Deleted!');
      })
      .catch(() => alert('Failed to delete plan'));
    showNotification('Record deleted successfully!', 'success');
  };


  const filteredRecords = records.filter(record => {
    const site = sites.find(site => site.projectId === record.project_id);
    const siteName = site?.name || '';
    const date = record?.date || '';
    return (
      siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      date.includes(searchQuery)
    );
  });


  const totalDirectWorkers = records.reduce((sum, record) => sum + record.directTotal, 0);
  const totalThirdPartyWorkers = records.reduce((sum, record) => sum + record.thirdPartyTotal, 0);
  const totalWorkers = totalDirectWorkers + totalThirdPartyWorkers;
  const averageDaily = records.length > 0 ? Math.round(totalWorkers / records.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Labor Attendance System</h1>
                  <p className="text-gray-600">Track and manage daily worker attendance across all sites including 3rd party contractors</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <BarChart3 className="h-4 w-4" />
                  <span>Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Direct Workers</p>
                <p className="text-2xl font-bold text-green-600">{totalDirectWorkers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">3rd Party Workers</p>
                <p className="text-2xl font-bold text-purple-600">{totalThirdPartyWorkers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Average</p>
                <p className="text-2xl font-bold text-orange-600">{averageDaily}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sites</p>
                <p className="text-2xl font-bold text-indigo-600"></p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Record Attendance</h2>
              </div>

              {/* Site Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Select Site
                </label>
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="..."
                >
                  <option value="">Choose a construction site...</option>
                  {sites.map((site) => (
                    <option key={site.id ?? site.name} value={site.projectId}>
                      {site.name}
                    </option>
                  ))}
                </select>

                {selectedSite && (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {sites.find(s => s.id === selectedSite)?.location}
                  </p>
                )}
              </div>

              {/* Date Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Tab Navigation */}
              {selectedSite && (
                <div className="mb-6">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('direct')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'direct'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      <Users className="inline h-4 w-4 mr-2" />
                      Direct Workers
                    </button>
                    <button
                      onClick={() => setActiveTab('thirdparty')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'thirdparty'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      <Building2 className="inline h-4 w-4 mr-2" />
                      3rd Party
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Workers Tab */}
              {selectedSite && activeTab === 'direct' && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Direct Worker Categories
                  </h3>
                  {laborCategories.map((category) => (
                    <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{category.icon}</span>
                          <div>
                            <span className="font-medium text-gray-900">{category.name}</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${category.color}`}>
                              {category.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        value={attendance[category.id] || ''}
                        onChange={(e) => handleCountChange(category.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 3rd Party Workers Tab */}
              {selectedSite && activeTab === 'thirdparty' && (
                <div className="space-y-4 mb-6">
                  
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      3rd Party Companies
                    </h3>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />

                    {laborCategories.map((category) => (
                      <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{category.icon}</span>
                            <div>
                              <span className="font-medium text-gray-900">{category.name}</span>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${category.color}`}>
                                {category.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          value={thirdPartyAttendance[category.id] || ''}
                          onChange={(e) => handleThirdPartyCountChange(category.id, e.target.value)}
                        />
                      </div>
                    ))}





                    <button
                      onClick={() => setShowAddCompanyModal(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Company
                    </button>
                  

                  {thirdPartyCompanies.map((company) => (
                    <div key={company.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Building2 className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-gray-900">{company.name}</span>
                          </div>
                          <p className="text-xs text-gray-500">{company.specialization}</p>
                          <p className="text-xs text-gray-400">{company.contact}</p>
                        </div>
                        <button
                          onClick={() => removeThirdPartyCompany(company.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="number"
                        min="0"
                        placeholder="Number of workers"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        value={thirdPartyAttendance[company.id] || ''}
                        onChange={(e) => handleThirdPartyCountChange(company.id, e.target.value)}
                      />
                    </div>
                  ))}

                  {thirdPartyCompanies.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No 3rd party companies added yet</p>
                      <button
                        onClick={() => setShowAddCompanyModal(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                      >
                        Add your first company
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!selectedSite || isSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Submit Attendance</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-3" />
                    Attendance Records
                  </h3>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by site name or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg">No attendance records yet</p>
                    <p className="text-gray-500 text-sm">Start by recording attendance for a site</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Site</th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <Users className="h-4 w-4 inline mr-1" />
                          Direct Workers
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <Building2 className="h-4 w-4 inline mr-1" />
                          3rd Party Workers
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">
                                {sites.find(site => site.projectId === record.project_id)?.name || 'Unknown Site'}
                              </div>

                              <div className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</div>

                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                              {record.count}
                            </span>
                            {/*}  <div className="text-xs text-gray-500 mt-1">
                              {laborCategories.map(cat => 
                                record.attendance[cat.id] ? `${cat.icon}${record.attendance[cat.id]} ` : ''
                              ).join('')}
                            </div>*/}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                              {record.thirdPartyTotal}
                            </span>
                            {record.thirdPartyCompanies && record.thirdPartyCompanies.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {record.thirdPartyCompanies.map(company => (
                                  <div key={company.id} className="truncate">
                                    {company.name}: {record.thirdPartyAttendance[company.id]}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {record.grandTotal}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteRecord(record.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {showAddCompanyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add 3rd Party Company</h3>
                <button
                  onClick={() => setShowAddCompanyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={newCompany.contact}
                    onChange={(e) => setNewCompany(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., +94 77 123 4567"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 