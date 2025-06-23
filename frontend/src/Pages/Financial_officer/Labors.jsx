import React, { useState } from 'react';
import { Search, Download, Save, Edit3, Users, Building2, MapPin, Calendar, DollarSign } from 'lucide-react';

const defaultRates = {
  mason: 3500,
  helper: 2000,
  welder: 4000,
  carpenter: 3200,
  electrician: 3800,
  painter: 2800,
  plumber: 3600,
};

const defaultThirdPartyRates = {
  security: 2500,
  cleaning: 2200,
  transport: 3000,
  catering: 1800,
  maintenance: 3500,
  landscaping: 2600,
};

const initialSites = [
  {
    id: 1,
    name: 'Luxury Residences - Phase 1',
    location: 'Colombo 07',
    projectManager: 'John Silva',
    registeredLabors: [
      { type: 'mason', count: 20, rate: defaultRates.mason, saved: false },
      { type: 'helper', count: 10, rate: defaultRates.helper, saved: false },
      { type: 'carpenter', count: 8, rate: defaultRates.carpenter, saved: false },
      { type: 'electrician', count: 5, rate: defaultRates.electrician, saved: false },
    ],
    thirdPartyLabors: [
      { type: 'security', count: 4, rate: defaultThirdPartyRates.security, saved: false, company: 'SecureGuard Ltd', contact: '077-1234567' },
      { type: 'cleaning', count: 6, rate: defaultThirdPartyRates.cleaning, saved: false, company: 'CleanPro Services', contact: '071-9876543' },
      { type: 'catering', count: 2, rate: defaultThirdPartyRates.catering, saved: false, company: 'FoodServe Ltd', contact: '076-5432109' },
    ],
  },
  {
    id: 2,
    name: 'Commercial Tower - Block B',
    location: 'Dehiwala',
    projectManager: 'Sarah Fernando',
    registeredLabors: [
      { type: 'mason', count: 15, rate: defaultRates.mason, saved: false },
      { type: 'welder', count: 8, rate: defaultRates.welder, saved: false },
      { type: 'electrician', count: 7, rate: defaultRates.electrician, saved: false },
      { type: 'plumber', count: 4, rate: defaultRates.plumber, saved: false },
    ],
    thirdPartyLabors: [
      { type: 'transport', count: 3, rate: defaultThirdPartyRates.transport, saved: false, company: 'TransMove Co', contact: '078-2468135' },
      { type: 'maintenance', count: 5, rate: defaultThirdPartyRates.maintenance, saved: false, company: 'FixIt Services', contact: '075-1357924' },
      { type: 'landscaping', count: 8, rate: defaultThirdPartyRates.landscaping, saved: false, company: 'GreenScape Ltd', contact: '072-8642097' },
    ],
  },
];

export default function LaborCharges() {
  const [sites, setSites] = useState(initialSites);
  const [search, setSearch] = useState('');

  const handleRateChange = (siteIndex, laborIndex, newRate, isThirdParty = false) => {
    const updatedSites = [...sites];
    const targetArray = isThirdParty ? 'thirdPartyLabors' : 'registeredLabors';
    updatedSites[siteIndex][targetArray][laborIndex].rate = parseFloat(newRate) || 0;
    setSites(updatedSites);
  };

  const handleSave = (siteIndex, isThirdParty = false) => {
    const updatedSites = [...sites];
    const targetArray = isThirdParty ? 'thirdPartyLabors' : 'registeredLabors';
    updatedSites[siteIndex][targetArray].forEach((worker) => (worker.saved = true));
    setSites(updatedSites);
  };

  const handleUpdate = (siteIndex, isThirdParty = false) => {
    const updatedSites = [...sites];
    const targetArray = isThirdParty ? 'thirdPartyLabors' : 'registeredLabors';
    updatedSites[siteIndex][targetArray].forEach((worker) => (worker.saved = false));
    setSites(updatedSites);
  };

  const calculateTotalCost = (workers) => {
    return workers.reduce((total, worker) => total + (worker.count * worker.rate), 0);
  };

  const downloadCSV = (site) => {
    const headers = ['Category', 'Type', 'Workers', 'Rate', 'Total', 'Company', 'Contact'];
    const registeredRows = site.registeredLabors.map(labor => [
      'Registered Labor',
      labor.type,
      labor.count,
      labor.rate,
      labor.count * labor.rate,
      'Direct Employee',
      'N/A'
    ]);
    const thirdPartyRows = site.thirdPartyLabors.map(labor => [
      'Third Party',
      labor.type,
      labor.count,
      labor.rate,
      labor.count * labor.rate,
      labor.company,
      labor.contact
    ]);
    
    const csvContent = [headers, ...registeredRows, ...thirdPartyRows]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `${site.name.replace(/[^a-zA-Z0-9]/g, '_')}_Labor_Report.csv`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-LK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderWorkerTable = (workers, siteIndex, isThirdParty = false, siteName) => {
    const allSaved = workers.length > 0 && workers.every(worker => worker.saved);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className={`px-6 py-4 ${isThirdParty ? 'bg-purple-50 border-b border-purple-200' : 'bg-blue-50 border-b border-blue-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isThirdParty ? (
                <Building2 className="h-5 w-5 text-purple-600" />
              ) : (
                <Users className="h-5 w-5 text-blue-600" />
              )}
              <h3 className={`font-semibold text-lg ${isThirdParty ? 'text-purple-800' : 'text-blue-800'}`}>
                {isThirdParty ? 'Third Party Workers' : 'Registered Workers'}
              </h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              allSaved 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {allSaved ? 'Rates Saved' : 'Pending'}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Worker Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate (LKR)
                </th>
                {isThirdParty && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workers.map((worker, workerIndex) => (
                <tr key={worker.type} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        isThirdParty ? 'bg-purple-400' : 'bg-blue-400'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {worker.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {worker.count}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {worker.saved ? (
                      <span className="text-sm text-gray-900 font-medium">
                        {formatCurrency(worker.rate)}
                      </span>
                    ) : (
                      <input
                        type="number"
                        className="w-24 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={worker.rate}
                        onChange={(e) =>
                          handleRateChange(siteIndex, workerIndex, e.target.value, isThirdParty)
                        }
                      />
                    )}
                  </td>
                  {isThirdParty && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {worker.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {worker.contact}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(worker.count * worker.rate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={isThirdParty ? 5 : 3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  Subtotal:
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(calculateTotalCost(workers))}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            {!allSaved ? (
              <button
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  isThirdParty 
                    ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                onClick={() => handleSave(siteIndex, isThirdParty)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Daily Rates
              </button>
            ) : (
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={() => handleUpdate(siteIndex, isThirdParty)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Update Rates
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(search.toLowerCase()) ||
    site.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Labor Management</h1>
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {getCurrentDate()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Active Sites</div>
                  <div className="text-2xl font-bold text-blue-800">{sites.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by site name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sites */}
        <div className="space-y-8">
          {filteredSites.map((site, siteIndex) => {
            const registeredTotal = calculateTotalCost(site.registeredLabors);
            const thirdPartyTotal = calculateTotalCost(site.thirdPartyLabors);
            const grandTotal = registeredTotal + thirdPartyTotal;
            const allSaved = [...site.registeredLabors, ...site.thirdPartyLabors].every(worker => worker.saved);

            return (
              <div key={site.id} className="bg-white rounded-lg shadow-md border mb-50 border-gray-200 overflow-hidden">
                {/* Site Header */}
                <div className="bg-gradient-to-r bg-black px-6 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{site.name}</h2>
                      <div className="mt-2 flex items-center space-x-4 text-blue-100">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {site.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          PM: {site.projectManager}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-90">Total Daily Cost</div>
                      <div className="text-3xl font-bold">{formatCurrency(grandTotal)}</div>
                      <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        allSaved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                      }`}>
                        {allSaved ? 'All Saved' : 'Pending Updates'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Registered Workers</p>
                          <p className="text-2xl font-bold text-blue-800">{formatCurrency(registeredTotal)}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">Third Party Workers</p>
                          <p className="text-2xl font-bold text-purple-800">{formatCurrency(thirdPartyTotal)}</p>
                        </div>
                        <Building2 className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Grand Total</p>
                          <p className="text-2xl font-bold text-green-800">{formatCurrency(grandTotal)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Worker Tables */}
                  <div className="space-y-6">
                    {renderWorkerTable(site.registeredLabors, siteIndex, false, site.name)}
                    {renderWorkerTable(site.thirdPartyLabors, siteIndex, true, site.name)}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        onClick={() => downloadCSV(site)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Complete Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No sites found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}