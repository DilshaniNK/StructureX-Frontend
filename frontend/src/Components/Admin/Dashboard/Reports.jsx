import React, { useState, useEffect } from 'react';
import { Download, Calendar, Loader, AlertCircle } from 'lucide-react';

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:8086/api/v1/user/all');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError('Error fetching users: ' + err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:8086/api/v1/transactions/all');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError('Error fetching transactions: ' + err.message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filter transactions by month
  const monthlyTransactions = transactions.filter(t => {
    const [year, month] = t.transactionDate.split('-');
    return parseInt(year) === selectedYear && parseInt(month) === selectedMonth;
  });

  // Calculate financial data
  const expenseTypes = {
    'Labor Payment': [],
    'Petty Cash': [],
    'Purchase': []
  };

  const incomeData = [];

  monthlyTransactions.forEach(t => {
    if (expenseTypes.hasOwnProperty(t.transactionType)) {
      expenseTypes[t.transactionType].push(t);
    } else if (t.transactionType === 'Client Payment') {
      incomeData.push(t);
    }
  });

  const allExpenses = Object.values(expenseTypes).flat();
  const totalExpenses = allExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = incomeData.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Group users by type
  const groupedUsers = users.reduce((acc, user) => {
    acc[user.type] = (acc[user.type] || []).concat(user);
    return acc;
  }, {});

  // Download Financial Report as PDF-like format
  const downloadFinancialReport = () => {
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    let content = `
═══════════════════════════════════════════════════════════════════════
                    FINANCIAL REPORT
                    ${monthName.toUpperCase()}
═══════════════════════════════════════════════════════════════════════

EXPENSES
───────────────────────────────────────────────────────────────────────
Project ID      | Project Name    | Date       | Type            | Amount
───────────────────────────────────────────────────────────────────────
${allExpenses.map(e => `${e.projectId.padEnd(15)} | ${e.projectName.padEnd(15)} | ${e.transactionDate} | ${e.transactionType.padEnd(15)} | $${e.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`).join('\n')}
───────────────────────────────────────────────────────────────────────
                                          TOTAL EXPENSES: $${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}


INCOME
───────────────────────────────────────────────────────────────────────
Project ID      | Project Name    | Date       | Type            | Amount
───────────────────────────────────────────────────────────────────────
${incomeData.map(i => `${i.projectId.padEnd(15)} | ${i.projectName.padEnd(15)} | ${i.transactionDate} | ${i.transactionType.padEnd(15)} | $${i.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`).join('\n')}
───────────────────────────────────────────────────────────────────────
                                          TOTAL INCOME: $${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}


═══════════════════════════════════════════════════════════════════════
NET RESULT: ${netProfit >= 0 ? 'PROFIT' : 'LOSS'} - $${Math.abs(netProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
═══════════════════════════════════════════════════════════════════════
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Financial-Report-${monthName.replace(' ', '-')}.txt`;
    a.click();
  };

  // Download Users Report
  const downloadUsersReport = () => {
    let content = `
═══════════════════════════════════════════════════════════════════════
                        USERS LIST REPORT
═══════════════════════════════════════════════════════════════════════

`;

    Object.entries(groupedUsers).forEach(([type, typeUsers]) => {
      content += `\n${type.replace('_', ' ').toUpperCase()} (${typeUsers.length} users)\n`;
      content += '───────────────────────────────────────────────────────────────────────\n';
      content += 'User ID | Name           | Email                   | Phone       | Address    | Joined Date\n';
      content += '───────────────────────────────────────────────────────────────────────\n';
      typeUsers.forEach(user => {
        content += `${String(user.userId).padEnd(7)} | ${user.name.padEnd(14)} | ${user.email.padEnd(23)} | ${user.phone_number.padEnd(11)} | ${user.address.padEnd(10)} | ${user.joined_date}\n`;
      });
      content += '\n';
    });

    content += `═══════════════════════════════════════════════════════════════════════\nTotal Users: ${users.length}\n═══════════════════════════════════════════════════════════════════════`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Users-List-Report.txt';
    a.click();
  };

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  if (loading && transactions.length === 0 && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-[#FAAD00] mx-auto mb-4" size={40} />
          <p className="text-gray-400">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FAAD00] mb-2">Admin Reports</h1>
            <p className="text-gray-400">System Financial & User Management Reports</p>
          </div>
          <button
            onClick={() => activeTab === 'financial' ? downloadFinancialReport() : downloadUsersReport()}
            className="bg-[#FAAD00] hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Download size={18} /> Download Report
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-2 text-red-400">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {[
            { id: 'financial', label: 'Financial Report' },
            { id: 'users', label: 'Users List' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-4 border-b-2 transition font-semibold ${activeTab === tab.id ? 'border-[#FAAD00] text-[#FAAD00]' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Financial Report */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Date Selectors */}
            <div className="flex gap-4 bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Year</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-yellow-500">
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Month</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 focus:ring-2 focus:ring-yellow-500">
                  {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{new Date(2025, i).toLocaleString('default', { month: 'long' })}</option>)}
                </select>
              </div>
              <div className="ml-auto flex items-end">
                <p className="text-gray-400 font-semibold text-lg">Report for: <span className="text-[#FAAD00]">{monthName}</span></p>
              </div>
            </div>

            {/* Report Document Style */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 p-8 text-center">
                <h2 className="text-3xl font-bold text-[#FAAD00] mb-2">FINANCIAL REPORT</h2>
                <p className="text-gray-400 text-lg">{monthName.toUpperCase()}</p>
              </div>

              <div className="p-8 space-y-8">
                {/* EXPENSES SECTION */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 pb-2 border-b-2 border-[#FAAD00]">EXPENSES</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-700/50 border-b border-gray-600">
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Project ID</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Project Name</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Date</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Type</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-300">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allExpenses.length > 0 ? (
                          allExpenses.map((exp, i) => (
                            <tr key={i} className="border-b border-gray-700 hover:bg-gray-700/30">
                              <td className="px-4 py-3 text-gray-300">{exp.projectId}</td>
                              <td className="px-4 py-3 text-gray-300">{exp.projectName}</td>
                              <td className="px-4 py-3 text-gray-300">{exp.transactionDate}</td>
                              <td className="px-4 py-3 text-gray-300">{exp.transactionType}</td>
                              <td className="px-4 py-3 text-right text-red-400 font-semibold">${exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-6 text-center text-gray-400">No expenses recorded for this period</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right pr-4">
                    <p className="text-lg font-bold text-gray-300">Total Expenses: <span className="text-red-400">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
                  </div>
                </div>

                {/* INCOME SECTION */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 pb-2 border-b-2 border-[#FAAD00]">INCOME</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-700/50 border-b border-gray-600">
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Project ID</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Project Name</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Date</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Type</th>
                          <th className="px-4 py-3 text-right font-bold text-gray-300">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incomeData.length > 0 ? (
                          incomeData.map((inc, i) => (
                            <tr key={i} className="border-b border-gray-700 hover:bg-gray-700/30">
                              <td className="px-4 py-3 text-gray-300">{inc.projectId}</td>
                              <td className="px-4 py-3 text-gray-300">{inc.projectName}</td>
                              <td className="px-4 py-3 text-gray-300">{inc.transactionDate}</td>
                              <td className="px-4 py-3 text-gray-300">{inc.transactionType}</td>
                              <td className="px-4 py-3 text-right text-green-400 font-semibold">${inc.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-6 text-center text-gray-400">No income recorded for this period</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right pr-4">
                    <p className="text-lg font-bold text-gray-300">Total Income: <span className="text-green-400">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
                  </div>
                </div>

                {/* SUMMARY */}
                <div className={`border-t-2 border-[#FAAD00] pt-6 ${netProfit >= 0 ? 'bg-blue-500/10' : 'bg-red-500/10'} p-6 rounded-lg`}>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-gray-300">NET RESULT:</p>
                    <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {netProfit >= 0 ? 'PROFIT' : 'LOSS'} - ${Math.abs(netProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Report */}
        {activeTab === 'users' && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600 p-8 text-center">
              <h2 className="text-3xl font-bold text-[#FAAD00] mb-2">USERS LIST REPORT</h2>
              <p className="text-gray-400">Total Users: <span className="text-[#FAAD00] font-bold">{users.length}</span></p>
            </div>

            <div className="p-8 space-y-8">
              {Object.entries(groupedUsers).map(([type, typeUsers]) => (
                <div key={type}>
                  <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b-2 border-[#FAAD00]">{type.replace('_', ' ').toUpperCase()} ({typeUsers.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-700/50 border-b border-gray-600">
                          <th className="px-4 py-3 text-left font-bold text-gray-300">User ID</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Name</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Email</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Phone</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Address</th>
                          <th className="px-4 py-3 text-left font-bold text-gray-300">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {typeUsers.map(user => (
                          <tr key={user.userId} className="border-b border-gray-700 hover:bg-gray-700/30">
                            <td className="px-4 py-3 text-gray-300">{user.userId}</td>
                            <td className="px-4 py-3 text-gray-300">{user.name}</td>
                            <td className="px-4 py-3 text-gray-300">{user.email}</td>
                            <td className="px-4 py-3 text-gray-300">{user.phone_number}</td>
                            <td className="px-4 py-3 text-gray-300">{user.address}</td>
                            <td className="px-4 py-3 text-gray-300">{user.joined_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;