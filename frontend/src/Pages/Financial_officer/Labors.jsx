import React, { useState } from 'react';



const defaultRates = {
  mason: 3500,
  helper: 2000,
  welder: 4000,
};

const initialSites = [
  {
    id: 1,
    name: 'Site A',
    labors: [
      { type: 'mason', count: 20, rate: defaultRates.mason, saved: false },
      { type: 'helper', count: 10, rate: defaultRates.helper, saved: false },
    ],
  },
  {
    id: 2,
    name: 'Site B',
    labors: [
      { type: 'mason', count: 15, rate: defaultRates.mason, saved: false },
      { type: 'welder', count: 5, rate: defaultRates.welder, saved: false },
    ],
  },
];

export default function LaborCharges() {
  const [sites, setSites] = useState(initialSites);
  const [search, setSearch] = useState('');

  const handleRateChange = (siteIndex, laborIndex, newRate) => {
    const updatedSites = [...sites];
    updatedSites[siteIndex].labors[laborIndex].rate = parseFloat(newRate);
    setSites(updatedSites);
  };

  const handleSave = (siteIndex) => {
    const updatedSites = [...sites];
    updatedSites[siteIndex].labors.forEach((labor) => (labor.saved = true));
    setSites(updatedSites);
  };

  const handleUpdate = (siteIndex) => {
    const updatedSites = [...sites];
    updatedSites[siteIndex].labors.forEach((labor) => (labor.saved = false));
    setSites(updatedSites);
  };

  const downloadCSV = (site) => {
    const headers = ['Labor Type', 'No. of Workers', 'Rate per Worker', 'Total Salary'];
    const rows = site.labors.map((labor) => [
      labor.type,
      labor.count,
      labor.rate,
      labor.count * labor.rate,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `${site.name.replace(/\s/g, '_')}_Labor_Salaries.csv`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-center justify-center align-middle text-3xl mb-15">Today's Labors</h1>

      <div className="max-w-5xl mx-auto p-4">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search project name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 border rounded px-4 py-2"
          />
        </div>

        {/* Filtered Sites */}
        {sites
          .filter((site) =>
            site.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((site, siteIndex) => (
            <div key={site.id} className="bg-white shadow p-4 rounded mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">{site.name}</h2>

              <div className="overflow-x-auto">
                <table className="min-w-max w-full text-left mb-3 border text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Labor Type</th>
                      <th className="p-2 border">No. of Workers</th>
                      <th className="p-2 border">Rate per Worker (Rs)</th>
                      <th className="p-2 border">Total Salary (Rs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {site.labors.map((labor, laborIndex) => (
                      <tr key={labor.type} className="border-t">
                        <td className="p-2 border">{labor.type}</td>
                        <td className="p-2 border">{labor.count}</td>
                        <td className="p-2 border">
                          {labor.saved ? (
                            labor.rate
                          ) : (
                            <input
                              type="number"
                              className="border p-1 w-24"
                              value={labor.rate}
                              onChange={(e) =>
                                handleRateChange(siteIndex, laborIndex, e.target.value)
                              }
                            />
                          )}
                        </td>
                        <td className="p-2 border font-semibold">
                          Rs. {labor.count * labor.rate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {!site.labors[0].saved ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => handleSave(siteIndex)}
                  >
                    Save Daily Rates
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => downloadCSV(site)}
                    >
                      Download Saved Data
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      onClick={() => handleUpdate(siteIndex)}
                    >
                      Update Rates
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
