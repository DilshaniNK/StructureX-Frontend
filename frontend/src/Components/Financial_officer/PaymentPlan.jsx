import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function PaymentPlanCreator() {
  const [installments, setInstallments] = useState([
    { dueDate: '', milestone: '', amount: '', status: 'Pending' }
  ]);

  const [createdDate, setCreatedDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfInstallments, setNumberOfInstallments] = useState(1);

  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();
  const projectId = query.get('id');

  useEffect(() => {
    if (!projectId) {
      setError('No project ID provided');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:8086/api/v1/financial_officer/payment_plan/full/${projectId}`)
      .then((res) => {
        if (res.data) {
          const plan = res.data;
          setInstallments(plan.installments || []);
          setCreatedDate(plan.createdDate?.split('T')[0] || '');
          setTotalAmount(plan.totalAmount || '');
          setStartDate(plan.startDate?.split('T')[0] || '');
          setEndDate(plan.endDate?.split('T')[0] || '');
          setNumberOfInstallments(plan.numberOfInstallments || 1);
          setIsSaved(true);
          setIsEditing(false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  const handleAddInstallment = () => {
    setInstallments([...installments, { dueDate: '', milestone: '', amount: '', status: 'Pending' }]);
  };

  const handleRemoveInstallment = (index) => {
    const updated = [...installments];
    updated.splice(index, 1);
    setInstallments(updated);
  };

  const handleInstallmentChange = (index, field, value) => {
    const updated = [...installments];
    updated[index] = { ...updated[index], [field]: value };
    setInstallments(updated);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor('#faad00');
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text('Payment Plan', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor('#000');
    let y = 25;

    installments.forEach((item, i) => {
      doc.text(
        `${i + 1}. Due: ${item.dueDate}, Milestone: ${item.milestone}, Amount: ${item.amount}, Status: ${item.status}`,
        10,
        y
      );
      y += 10;
    });

    doc.save('payment-plan.pdf');
  };

  const handleSavePlan = () => {
    axios.post('http://localhost:8086/api/v1/financial_officer/payment_plan/full', {
      projectId,
      totalAmount: Number(totalAmount),
      numberOfInstallments: Number(numberOfInstallments),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      installments
    })
      .then(() => {
        setIsSaved(true);
        setIsEditing(false);
        alert('Plan saved!');
      })
      .catch(() => alert('Failed to save plan'));
  };

  const handleUpdatePlan = () => {
    axios.put('http://localhost:8086/api/v1/financial_officer/payment_plan/full', {
      projectId,
      totalAmount: Number(totalAmount),
      numberOfInstallments: Number(numberOfInstallments),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      installments
    })
      .then(() => {
        setIsSaved(true);
        alert('Plan updated!');
        window.location.reload();
      })
      .catch(err => {
        console.error('Update error', err);
        alert('Update failed: ' + (err.response?.data || err.message));
      });
  };

  const handleDeletePlan = () => {
    axios.delete(`http://localhost:8086/api/v1/financial_officer/payment_plan/full/${projectId}`)
      .then(() => {
        setInstallments([{ dueDate: '', milestone: '', amount: '', status: 'Pending' }]);
        setIsSaved(false);
        setIsEditing(false);
        alert('Deleted!');
      })
      .catch(() => alert('Failed to delete plan'));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded p-6">
      <h2 className="text-xl font-bold mb-4">Payment Plan Creator</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block">Total Amount</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block">Number of Installments</label>
          <input
            type="number"
            value={numberOfInstallments}
            onChange={(e) => setNumberOfInstallments(e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded w-full"
          />
        </div>
      </div>

      {installments.map((inst, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 mb-2">
          <input
            type="date"
            value={inst.dueDate}
            onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
            className="border p-1 rounded"
            disabled={!isEditing}
          />
          <input
            type="text"
            value={inst.milestone}
            onChange={(e) => handleInstallmentChange(index, 'milestone', e.target.value)}
            placeholder="Milestone"
            className="border p-1 rounded"
            disabled={!isEditing}
          />
          <input
            type="number"
            value={inst.amount}
            onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
            placeholder="Amount"
            className="border p-1 rounded"
            disabled={!isEditing}
          />
          <select
            value={inst.status}
            onChange={(e) => handleInstallmentChange(index, 'status', e.target.value)}
            className="border p-1 rounded"
            disabled={!isEditing}
          >
            <option>Pending</option>
            <option>Paid</option>
            <option>Overdue</option>
          </select>
          {isEditing && (
            <button onClick={() => handleRemoveInstallment(index)} className="text-red-600">
              <RemoveCircleIcon />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <button onClick={handleAddInstallment} className="bg-green-500 text-white px-4 py-2 rounded">
          + Add Installment
        </button>
      )}

      <div className="flex gap-2 mt-4">
        {!isSaved && !isEditing && (
          <button onClick={handleSavePlan} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        )}

        {isSaved && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Edit
          </button>
        )}

        {isEditing && (
          <button onClick={handleUpdatePlan} className="bg-green-600 text-white px-4 py-2 rounded">
            Update
          </button>
        )}

        <button onClick={handleDeletePlan} className="bg-red-500 text-white px-4 py-2 rounded">
          Delete
        </button>

        <button onClick={handleDownload} className="bg-gray-700 text-white px-4 py-2 rounded">
          Download
        </button>
      </div>
    </div>
  );
}




