import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Trash2, Edit2, PlusCircle, DollarSign, Receipt, AlertCircle } from 'lucide-react';

const API_BASE = "http://localhost:8086/api/v1/site_supervisor";

const PettyCash = ({ employeeId }) => {
    const [pettyCashList, setPettyCashList] = useState([]);
    const [newRecord, setNewRecord] = useState({ pettyCashId: '', expenseAmount: '', date: '', description: '' });
    const [editingRecord, setEditingRecord] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchPettyCash();
    }, [employeeId]);

    const fetchPettyCash = async () => {
        try {
            const res = await fetch(`${API_BASE}/petty_cash/${employeeId}`);
            const data = await res.json();
            setPettyCashList(data);
        } catch (err) {
            console.error("Error fetching petty cash:", err);
        }
    };

    const handleAddRecord = async () => {
        const pc = pettyCashList.find(pc => pc.pettyCashId === parseInt(newRecord.pettyCashId));
        const totalSpent = pc.pettyCashRecords.reduce((sum, r) => sum + parseFloat(r.expenseAmount), 0);
        const newTotal = totalSpent + parseFloat(newRecord.expenseAmount);

        if (newTotal > parseFloat(pc.amount)) {
            setErrorMessage("Cannot add record: total expenses exceed petty cash amount!");
            return;
        }

        setErrorMessage("");
        if (!newRecord.pettyCashId || !newRecord.expenseAmount || !newRecord.date) return;

        try {
            await fetch(`${API_BASE}/petty_cash_record`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecord)
            });
            setNewRecord({ pettyCashId: '', expenseAmount: '', date: '', description: '' });
            fetchPettyCash();
        } catch (err) {
            console.error("Error adding petty cash record:", err);
        }
    };

    const handleUpdateRecord = async () => {
        if (!editingRecord) return;
        try {
            await fetch(`${API_BASE}/petty_cash_record`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingRecord)
            });
            setEditingRecord(null);
            fetchPettyCash();
        } catch (err) {
            console.error("Error updating record:", err);
        }
    };

    const handleDeleteRecord = async (recordId) => {
        try {
            await fetch(`${API_BASE}/petty_cash_record/${recordId}`, {
                method: 'DELETE'
            });
            fetchPettyCash();
        } catch (err) {
            console.error("Error deleting record:", err);
        }
    };

    const calculateTotals = (pc) => {
        const totalSpent = pc.pettyCashRecords.reduce((sum, r) => sum + parseFloat(r.expenseAmount || 0), 0);
        const remaining = parseFloat(pc.amount) - totalSpent;
        const percentage = (totalSpent / parseFloat(pc.amount)) * 100;
        return { totalSpent, remaining, percentage };
    };
    // validation helpers & state
    const [validationMessage, setValidationMessage] = useState("");

    const isFutureDate = (dateStr) => {
        if (!dateStr) return false;
        const given = new Date(dateStr);
        const today = new Date();
        given.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return given > today;
    };

    // Validate new record inputs and auto-correct invalid values to prevent submission
    useEffect(() => {
        const msgs = [];

        // Amount checks
        if (newRecord.expenseAmount !== '' && newRecord.expenseAmount != null) {
            const amt = Number(newRecord.expenseAmount);
            if (isNaN(amt)) {
                msgs.push('Amount must be a valid number.');
                setNewRecord(nr => ({ ...nr, expenseAmount: '' }));
            } else if (amt < 0) {
                msgs.push('Amount cannot be negative.');
                setNewRecord(nr => ({ ...nr, expenseAmount: '' }));
            }
        } else {
            // if user has started filling other fields, show required message
            if (newRecord.pettyCashId || newRecord.date || newRecord.description) {
                msgs.push('Amount is required.');
            }
        }

        // Date checks
        if (newRecord.date && isFutureDate(newRecord.date)) {
            msgs.push('Date cannot be in the future.');
            // clear the invalid date so existing add handler's empty-date guard stops submission
            setNewRecord(nr => ({ ...nr, date: '' }));
        }

        const combined = msgs.join(' ');
        setValidationMessage(combined);
        // Surface validation messages in the same errorMessage UI used elsewhere
        // but keep precedence for server/total-exceeded messages set elsewhere by appending if needed.
        setErrorMessage(prev => {
            // if previous message mentions "exceed" keep it and append validation; otherwise replace
            if (prev && prev.toLowerCase().includes('exceed') && combined) {
                return prev + ' ' + combined;
            }
            return combined;
        });
    }, [newRecord]);

    // Validate editing record inputs similarly
    useEffect(() => {
        if (!editingRecord) {
            // clear validation for edit mode when not editing
            if (validationMessage) {
                setValidationMessage('');
                setErrorMessage('');
            }
            return;
        }

        const msgs = [];

        if (editingRecord.expenseAmount !== '' && editingRecord.expenseAmount != null) {
            const amt = Number(editingRecord.expenseAmount);
            if (isNaN(amt)) {
                msgs.push('Amount must be a valid number.');
                setEditingRecord(er => ({ ...er, expenseAmount: '' }));
            } else if (amt < 0) {
                msgs.push('Amount cannot be negative.');
                setEditingRecord(er => ({ ...er, expenseAmount: '' }));
            }
        } else {
            msgs.push('Amount is required.');
        }

        if (editingRecord.date && isFutureDate(editingRecord.date)) {
            msgs.push('Date cannot be in the future.');
            setEditingRecord(er => ({ ...er, date: '' }));
        }

        const combined = msgs.join(' ');
        setValidationMessage(combined);
        setErrorMessage(combined);
    }, [editingRecord]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 text-black">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Petty Cash Dashboard</h1>
                            <p className="text-yellow-300 mt-1">Manage and track your project expenses</p>
                        </div>
                    </div>
                </div>

                {/* Add New Record Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
                        <div className="flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold text-gray-800 text-lg">Add New Expense Record</h3>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <select
                                value={newRecord.pettyCashId}
                                onChange={e => setNewRecord({ ...newRecord, pettyCashId: e.target.value })}
                                className="border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                            >
                                <option value="">Select Petty Cash</option>
                                {pettyCashList.map(pc => (
                                    <option key={pc.pettyCashId} value={pc.pettyCashId}>
                                        {pc.projectId} - #{pc.pettyCashId}
                                    </option>
                                ))}
                            </select>
                            
                            <input
                                type="number"
                                placeholder="Expense Amount(LKR)"
                                value={newRecord.expenseAmount}
                                onChange={e => setNewRecord({ ...newRecord, expenseAmount: e.target.value })}
                                className="border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                            />
                            
                            <input
                                type="date"
                                value={newRecord.date}
                                onChange={e => setNewRecord({ ...newRecord, date: e.target.value })}
                                className="border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                            />
                            
                            <input
                                type="text"
                                placeholder="Description"
                                value={newRecord.description}
                                onChange={e => setNewRecord({ ...newRecord, description: e.target.value })}
                                className="border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                            />
                            
                            <button
                                onClick={handleAddRecord}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span>Add Record</span>
                            </button>
                        </div>
                        
                        {errorMessage && (
                            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 font-medium">{errorMessage}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Petty Cash List */}
                <div className="grid gap-6">
                    {pettyCashList.map(pc => {
                        const { totalSpent, remaining, percentage } = calculateTotals(pc);
                        const isLow = percentage > 80;
                        
                        return (
                            <div key={pc.pettyCashId} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-indigo-100">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                                <Receipt className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-gray-800">{pc.projectId}</h3>
                                                <p className="text-sm text-gray-600">Petty Cash ID: #{pc.pettyCashId}</p>
                                            </div>
                                        </div>
                                         
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {pc.date}
                                                </p>
                                                <p className="text-sm text-gray-600">Employee: {pc.employeeId}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Budget Overview */}
                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        <div className="bg-white rounded-xl p-4 shadow-sm">
                                            <p className="text-xs font-medium text-gray-600 uppercase mb-1">Total Budget</p>
                                            <p className="text-2xl font-bold text-gray-800">LKR {parseFloat(pc.amount).toFixed(2)}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 shadow-sm">
                                            <p className="text-xs font-medium text-gray-600 uppercase mb-1">Total Spent</p>
                                            <p className="text-2xl font-bold text-orange-600">LKR {totalSpent.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 shadow-sm">
                                            <p className="text-xs font-medium text-gray-600 uppercase mb-1">Remaining</p>
                                            <p className={`text-2xl font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                                                LKR {remaining.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600">Budget Usage</span>
                                            <span className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all ${
                                                    isLow ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'
                                                }`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Records Section */}
                                <div className="p-6">
                                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <Receipt className="w-5 h-5 text-gray-500" />
                                        Expense Records
                                    </h4>
                                    
                                    <div className="space-y-3">
                                        {pc.pettyCashRecords?.length > 0 ? pc.pettyCashRecords.map((record, index) => (
                                            <div key={record.recordId} className="border-2 border-gray-100 rounded-xl hover:border-indigo-200 transition-all overflow-hidden">
                                                {editingRecord?.recordId === record.recordId ? (
                                                    <div className="bg-blue-50 p-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                            <input
                                                                type="number"
                                                                value={editingRecord.expenseAmount}
                                                                onChange={e => setEditingRecord({ ...editingRecord, expenseAmount: e.target.value })}
                                                                className="border-2 border-blue-300 p-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                                                placeholder="Amount"
                                                            />
                                                            <input
                                                                type="date"
                                                                value={editingRecord.date}
                                                                onChange={e => setEditingRecord({ ...editingRecord, date: e.target.value })}
                                                                className="border-2 border-blue-300 p-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editingRecord.description}
                                                                onChange={e => setEditingRecord({ ...editingRecord, description: e.target.value })}
                                                                className="border-2 border-blue-300 p-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none md:col-span-1"
                                                                placeholder="Description"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={handleUpdateRecord} 
                                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md font-medium"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button 
                                                                    onClick={() => setEditingRecord(null)} 
                                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Amount</p>
                                                                <p className="text-lg font-bold text-gray-800">LKR {parseFloat(record.expenseAmount).toFixed(2)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Date</p>
                                                                <p className="text-sm text-gray-700 flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                                    {record.date}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Description</p>
                                                                <p className="text-sm text-gray-700">{record.description || 'No description'}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex gap-2 ml-4">
                                                            <button 
                                                                onClick={() => setEditingRecord(record)} 
                                                                className="p-2.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-all shadow-sm hover:shadow-md"
                                                                title="Edit record"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteRecord(record.recordId)} 
                                                                className="p-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-all shadow-sm hover:shadow-md"
                                                                title="Delete record"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                                <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 font-medium">No expense records found</p>
                                                <p className="text-sm text-gray-400 mt-1">Add your first expense record above</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {pettyCashList.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Petty Cash Records</h3>
                        <p className="text-gray-500">Start by creating your first petty cash entry</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PettyCash;