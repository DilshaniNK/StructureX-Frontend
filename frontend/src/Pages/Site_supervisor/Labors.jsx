import React, { useState } from 'react';

const laborCategories = ['Mason', 'Carpenter', 'Plumber', 'Electrician', 'Helper'];

const CategoryAttendanceWithTable = () => {
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [attendance, setAttendance] = useState({});
  const [records, setRecords] = useState([]);

  const sites = [
    { id: 'site001', name: 'Colombo Highrise Project' },
    { id: 'site002', name: 'Galle Road Mall Construction' },
  ];

  const handleSiteChange = (e) => {
    setSelectedSite(e.target.value);
    setAttendance({});
  };

  const handleCountChange = (category, value) => {
    setAttendance((prev) => ({
      ...prev,
      [category]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = () => {
    if (!selectedSite) {
      alert('Please select a site.');
      return;
    }

    const newRecord = {
      siteId: selectedSite,
      siteName: sites.find((s) => s.id === selectedSite)?.name,
      date: selectedDate,
      attendance,
    };

    setRecords((prev) => [...prev, newRecord]);
    setAttendance({});
    alert('Attendance submitted! Table updated.');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-6">📊 Category-wise Attendance</h2>

      {/* Form Section */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        {/* Site Selector */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Select Site</label>
          <select
            value={selectedSite}
            onChange={handleSiteChange}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Choose Site --</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Attendance Inputs */}
        {selectedSite && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {laborCategories.map((category) => (
              <div key={category}>
                <label className="block font-medium">{category}</label>
                <input
                  type="number"
                  min="0"
                  className="border p-2 rounded w-full"
                  value={attendance[category] || ''}
                  onChange={(e) => handleCountChange(category, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Attendance
        </button>
      </div>

      {/* Attendance Table Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📋 Attendance Records</h3>
        {records.length === 0 ? (
          <p className="text-gray-600">No records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Site</th>
                  {laborCategories.map((cat) => (
                    <th key={cat} className="p-2 border">{cat}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((rec, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{rec.date}</td>
                    <td className="p-2 border">{rec.siteName}</td>
                    {laborCategories.map((cat) => (
                      <td key={cat} className="p-2 border text-center">
                        {rec.attendance[cat] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryAttendanceWithTable;
