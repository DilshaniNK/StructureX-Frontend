import React, { useState } from 'react';

export default function InventoryRequest({ title, items, projects, type }) {
  const [selectedSite, setSelectedSite] = useState('');
  const [requests, setRequests] = useState([{ item: '', qty: '', purpose: '' }]);
  const [submitted, setSubmitted] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...requests];
    updated[index][field] = value;
    setRequests(updated);
  };

  const handleAdd = () => {
    setRequests([...requests, { item: '', qty: '', purpose: '' }]);
  };

  const handleSubmit = () => {
    if (!selectedSite) {
      alert('Please select a site.');
      return;
    }

    const record = {
      site: selectedSite,
      type,
      date: new Date().toISOString().split('T')[0],
      requests,
    };

    setSubmitted((prev) => [...prev, record]);
    setRequests([{ item: '', qty: '', purpose: '' }]);
    alert(`${type} request submitted for ${selectedSite}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 ">
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">
        {title || `${type} Request`}
      </h1>

      {/* Site Selector */}
      <div className="mb-6 ">
        <label className="block font-medium mb-1">Select Site</label>
        <select
          className="border rounded w-full p-2"
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
        >
          <option value="">-- Choose Site --</option>
          {projects.map((site) => (
            <option key={site}>{site}</option>
          ))}
        </select>
      </div>

      {/* Request Form */}
      {selectedSite && (
        <div className=" p-4 rounded-2xl shadow mb-6">
          {requests.map((req, idx) => (
            <div key={idx} className="mb-4 bg-white p-4 rounded-2xl shadow-sm">
              <label className="block mb-1 font-medium">{type} Name</label>
              <select
                value={req.item}
                onChange={(e) => handleChange(idx, 'item', e.target.value)}
                className="border p-2 rounded-2xl w-full mb-2"
              >
                <option value="">Select {type.toLowerCase()}</option>
                {items.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.name}
                  </option>
                ))}
              </select>

              <label className="block mb-1 font-medium">Quantity</label>
              <input
                type="number"
                value={req.qty}
                onChange={(e) => handleChange(idx, 'qty', e.target.value)}
                className="border p-2 rounded-2xl w-full mb-2"
              />
            </div>
          ))}

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add {type}
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}

   
      {/* Submitted Requests as Cards (One card per submission) */}
<div>
  <h2 className="text-xl font-semibold mb-4 text-gray-700">Submitted Requests</h2>
  {submitted.length === 0 ? (
    <p className="text-gray-500">No requests submitted yet.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {submitted.map((entry, idx) => (
        <div
          key={idx}
          className="bg-white shadow-md rounded-2xl p-4"
        >
          <div className="text-sm text-gray-500 mb-1">
            <strong>Site:</strong> {entry.site}
          </div>
          <div className="text-sm text-gray-500 mb-3">
            <strong>Date:</strong> {entry.date}
          </div>
          <div className="text-sm text-gray-800 font-medium mb-2">Requested Items:</div>
          <ul className="space-y-2 text-sm">
            {entry.requests.map((r, i) => (
              <li key={i} className="border rounded p-2 bg-gray-50">
                <div><strong>Item:</strong> {r.item}</div>
                <div><strong>Quantity:</strong> {r.qty}</div>
               
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )}
</div>


    </div>
  );
}
