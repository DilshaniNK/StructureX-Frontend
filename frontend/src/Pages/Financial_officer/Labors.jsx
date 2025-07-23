import React, { useState, useEffect } from 'react';
import {
  Search,
  Save,
  Edit3,
  Trash2,
  Users,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function LaborCharges() {
  const [sites, setSites] = useState([]);
  const [enrichedSites, setEnrichedSites] = useState([]);
  const [search, setSearch] = useState('');
  const { employeeId } = useParams();
  const [projectIds, setProjectIds] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch ongoing sites on mount
  useEffect(() => {
    axios
      .get('http://localhost:8086/api/v1/financial_officer')
      .then((res) => {
        const ongoing = res.data.filter((p) => p.status === 'ongoing');
        setSites(ongoing);
        setProjectIds(ongoing.map((p) => p.projectId));
      })
      .catch((err) => console.error('Error fetching projects:', err));
  }, []);

  // Fetch attendance when projectIds or selectedDate changes
  useEffect(() => {
    if (!projectIds.length || !selectedDate) return;

    const fetchAttendance = async () => {
      try {
        const responses = await Promise.all(
          projectIds.map((id) =>
            axios.get(`http://localhost:8086/api/v1/financial_officer/attendance/${id}/date?date=${selectedDate}`),
          ),
        );
        const allAttendance = responses.flatMap((r) => (Array.isArray(r.data) ? r.data : []));

        // Normalize with flags and salaryId
        const normalized = allAttendance.map((w) => ({
          ...w,
          rate: w.salary?.laborRate ?? 0,
          saved: true,
          hasExistingRate: w.salary && typeof w.salary.laborRate === 'number',
          salaryId: w.salary?.salaryId || null,
        }));

        setAttendance(normalized);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, [projectIds, selectedDate]);

  // Helper to get workers for a site and hiring type
  const getWorkersForSite = (projectId, hiringType) =>
    attendance.filter((w) => w.project_id === projectId && w.hiring_type === hiringType);

  // Build enrichedSites with worker arrays
  useEffect(() => {
    const enriched = sites.map((site) => ({
      ...site,
      direct_workers: getWorkersForSite(site.projectId, 'direct_workers'),
      third_party: getWorkersForSite(site.projectId, 'third_party'),
    }));
    setEnrichedSites(enriched);
  }, [sites, attendance]);

  // Handle input change for rate
  const handleRateChange = (siteIndex, laborIndex, newRate, isThirdParty = false) => {
    const targetArray = isThirdParty ? 'third_party' : 'direct_workers';
    const site = enrichedSites[siteIndex];
    if (!site || !site[targetArray]) return;

    const workerToUpdate = site[targetArray][laborIndex];
    if (!workerToUpdate) return;

    setAttendance((prevAttendance) =>
      prevAttendance.map((worker) =>
        worker.id === workerToUpdate.id
          ? { ...worker, rate: parseFloat(newRate) || 0, saved: false }
          : worker,
      ),
    );
  };

  // Enable editing rates on clicking "Update Rates"
  const handleEditRates = (siteIndex, isThirdParty = false) => {
    const targetArray = isThirdParty ? 'third_party' : 'direct_workers';
    const site = enrichedSites[siteIndex];
    if (!site || !site[targetArray]) return;

    setAttendance((prev) =>
      prev.map((worker) =>
        worker.project_id === site.projectId &&
        worker.hiring_type === (isThirdParty ? 'third_party' : 'direct_workers')
          ? { ...worker, saved: false }
          : worker,
      ),
    );
  };

  // Unified Save or Update handler: batch POST and PUT
  const handleSaveOrUpdate = async (siteIndex, isThirdParty = false) => {
    const targetArray = isThirdParty ? 'third_party' : 'direct_workers';
    const site = enrichedSites[siteIndex];
    if (!site || !site[targetArray] || !site[targetArray].length) {
      console.warn('No workers to save');
      return;
    }

    const workersToSave = site[targetArray];

    const toUpdate = workersToSave.filter((w) => w.hasExistingRate);
    const toCreate = workersToSave.filter((w) => !w.hasExistingRate);

    try {
      // Batch update
      if (toUpdate.length > 0) {
        const updatePayload = toUpdate
          .filter((w) => w.salaryId && w.salaryId !== 0)
          .map((w) => ({
            salaryId: w.salaryId,
            attendanceId: w.id,
            laborRate: w.rate,
            projectId: w.project_id,
          }));

        if (updatePayload.length > 0) {
          await axios.put('http://localhost:8086/api/v1/financial_officer/labor_salary', updatePayload);
        }
      }

      // Batch create
      if (toCreate.length > 0) {
        const createPayload = toCreate.map((w) => ({
          attendanceId: w.id,
          laborRate: w.rate,
          projectId: w.project_id,
        }));

        await axios.post('http://localhost:8086/api/v1/financial_officer/labor_salary', createPayload);
      }

      // Update state to mark saved rates
      setAttendance((prev) =>
        prev.map((worker) =>
          worker.project_id === site.projectId &&
          worker.hiring_type === (isThirdParty ? 'third_party' : 'direct_workers')
            ? { ...worker, saved: true, hasExistingRate: true }
            : worker,
        ),
      );
      alert('Rates saved successfully!');
    } catch (error) {
      console.error('Error saving labor rates:', error.response?.data || error.message);
      alert('Failed to save rates. Please try again.');
    }
  };

  

  // Calculate total cost for a list of workers
  const calculateTotalCost = (workers) =>
    Array.isArray(workers)
      ? workers.reduce((sum, w) => sum + (w.count || 0) * (w.rate || 0), 0)
      : 0;

  // Currency formatter for LKR
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(amount);

  // Render workers table with editable rates and action buttons
  const renderWorkerTable = (workers, siteIndex, isThirdParty) => {
    if (!workers?.length)
      return (
        <div className="p-4 text-center italic text-gray-500">
          No {isThirdParty ? 'third party' : 'direct'} workers found.
        </div>
      );

    const allSaved = workers.every((w) => w.saved);

    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {/* Header */}
        <div
          className={`px-6 py-4 ${
            isThirdParty ? 'bg-purple-50 border-b border-purple-200' : 'bg-blue-50 border-b border-blue-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {isThirdParty ? (
                <Building2 className="h-5 w-5 text-purple-600" />
              ) : (
                <Users className="h-5 w-5 text-blue-600" />
              )}
              <h3 className={`font-semibold text-lg ${isThirdParty ? 'text-purple-800' : 'text-blue-800'}`}>
                {isThirdParty ? 'Third Party Workers' : 'Direct Workers'}
              </h3>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                allSaved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}
            >
              {allSaved ? 'Rates Saved' : 'Pending'}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate (LKR)</th>
                {isThirdParty && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                   
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
              
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workers.map((worker, idx) => (
                <tr key={worker.id || idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{worker.labor_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{worker.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {worker.saved ? (
                      formatCurrency(worker.rate)
                    ) : (
                      <input
                        type="number"
                        className="w-24 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={worker.rate}
                        onChange={(e) => handleRateChange(siteIndex, idx, e.target.value, isThirdParty)}
                      />
                    )}
                  </td>
                  {isThirdParty && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">{worker.company || 'N/A'}</td>
                      
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    {formatCurrency((worker.count ?? 0) * (worker.rate ?? 0))}
                  </td>
                  
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={isThirdParty ? 5 : 3} className="px-6 py-3 text-right font-medium">
                  Subtotal:
                </td>
                <td className="px-6 py-3 whitespace-nowrap font-bold">{formatCurrency(calculateTotalCost(workers))}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Save/Update buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-start space-x-3">
          {!allSaved ? (
            <button
              onClick={() => handleSaveOrUpdate(siteIndex, isThirdParty)}
              className={`inline-flex items-center px-4 py-2 text-white rounded-md text-sm font-medium ${
                isThirdParty ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Rates
            </button>
          ) : (
            <button
              onClick={() => handleEditRates(siteIndex, isThirdParty)}
              className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Update Rates
            </button>
          )}
        </div>
      </div>
    );
  };

  // Filter sites according to search
  const filteredSites = enrichedSites.filter(
    (site) =>
      site.name?.toLowerCase().includes(search.toLowerCase()) ||
      site.location?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Labor Management</h1>
              <p className="mt-1 text-sm text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString('en-LK', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Active Sites</div>
              <div className="text-2xl font-bold text-blue-800">{filteredSites.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Date Picker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="relative max-w-md w-full sm:w-auto">
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

          <div className="flex items-center space-x-2">
            <label htmlFor="attendance-date" className="text-sm font-medium text-gray-700">
              Select Date:
            </label>
            <input
              type="date"
              id="attendance-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sites */}
        <div className="space-y-8">
          {filteredSites.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building2
                className="mx-auto mb-4 opacity-50"
                style={{ height: '3rem', width: '3rem' }}
              />
              <p className="text-lg font-medium">No sites available</p>
              <p className="text-sm">Try adjusting your search criteria or selected date.</p>
            </div>
          ) : (
            filteredSites.map((site, idx) => {
              const directTotal = calculateTotalCost(site.direct_workers);
              const thirdPartyTotal = calculateTotalCost(site.third_party);
              const grandTotal = directTotal + thirdPartyTotal;
              const allSaved =
                [...(site.direct_workers || []), ...(site.third_party || [])].every((w) => w.saved);

              return (
                <div
                  key={site.projectId}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r bg-black px-6 py-6 text-white flex justify-between">
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
                      <div
                        className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          allSaved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                        }`}
                      >
                        {allSaved ? 'All Saved' : 'Pending Updates'}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {renderWorkerTable(site.direct_workers, idx, false)}
                    {renderWorkerTable(site.third_party, idx, true)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
