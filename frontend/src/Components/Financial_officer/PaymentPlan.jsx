import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function PaymentPlanCreator() {
  const [installments, setInstallments] = useState([{ dueDate: '', paidDate: '', amount: '', status: 'upcoming' }]);
  const [createdDate, setCreatedDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentPlanId, setPaymentPlanId] = useState(null);
  const [numberOfInstallments, setNumberOfInstallments] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = new URLSearchParams(useLocation().search);
  const projectId = query.get('id');

  useEffect(() => {
    if (!projectId) {
      setError('No project ID provided');
      setLoading(false);
      setIsEditing(true); // allow new input
      setIsSaved(false);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8086/api/v1/financial_officer/payment_plan/full/${projectId}`)
      .then((res) => {
        const plan = res.data;
        if (plan) {
          setInstallments(plan.installments || [{ dueDate: '', paidDate: '', amount: '', status: 'upcoming' }]);
          setCreatedDate(plan.createdDate ? plan.createdDate.split('T')[0] : '');
          setTotalAmount(plan.totalAmount || '');
          setStartDate(plan.startDate ? plan.startDate.split('T')[0] : '');
          setEndDate(plan.endDate ? plan.endDate.split('T')[0] : '');
          setNumberOfInstallments(plan.numberOfInstallments || 1);
          setIsSaved(true);
          setIsEditing(false); // disable inputs to view saved plan
          setError(null);
        } else {
          // No plan found, enable editing for new
          setInstallments([{ dueDate: '', paidDate: '', amount: '', status: 'upcoming' }]);
          setTotalAmount('');
          setStartDate('');
          setEndDate('');
          setNumberOfInstallments(1);
          setIsSaved(false);
          setIsEditing(true);
          setError(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load payment plan.');
        setLoading(false);
        setIsSaved(false);
        setIsEditing(true);
      });
  }, [projectId]);

  const handleAddInstallment = () => {
    setInstallments((prev) => [...prev, { dueDate: '', paidDate: '', amount: '', status: 'upcoming' }]);
  };

  const handleRemoveInstallment = (index) => {
    setInstallments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleInstallmentChange = (index, field, value) => {
    setInstallments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const fetchPaymentPlan = async () => {
  const { data } = await axios.get(`/api/v1/financial_officer/payment_plan/full/${projectId}`);
  setPaymentPlanId(data.paymentPlanId);
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
      const amountNumber = Number(item.amount);
      const amountDisplay = isNaN(amountNumber) ? 'N/A' : amountNumber.toFixed(2);
      const line = `${i + 1}. Due: ${item.dueDate || 'N/A'}, Paid: ${item.paidDate || 'N/A'}, Amount: ${amountDisplay}, Status: ${item.status}`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save('payment-plan.pdf');
  };

  const validatePlan = () => {
    if (!totalAmount || Number(totalAmount) <= 0) {
      alert('Total amount must be a positive number.');
      return false;
    }
    if (!numberOfInstallments || Number(numberOfInstallments) < 1) {
      alert('Number of installments must be at least 1.');
      return false;
    }
    if (!startDate) {
      alert('Start date is required.');
      return false;
    }
    if (!endDate) {
      alert('End date is required.');
      return false;
    }
    for (let i = 0; i < installments.length; i++) {
      const inst = installments[i];
      if (!inst.dueDate) {
        alert(`Due date is required for installment #${i + 1}`);
        return false;
      }
      const amountNum = Number(inst.amount);
      if (inst.amount === '' || isNaN(amountNum) || amountNum <= 0) {
        alert(`Amount must be a positive number for installment #${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSavePlan = () => {
    if (!validatePlan()) return;

    axios
      .post('http://localhost:8086/api/v1/financial_officer', {
        projectId,
        totalAmount: Number(totalAmount),
        createdDate: new Date().toISOString(),
        numberOfInstallments: Number(numberOfInstallments),
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        installments,
      })
      .then(() => {
        setIsSaved(true);
        setIsEditing(false);
        alert('Plan saved successfully!');
      })
      .catch(() => {
        alert('Failed to save plan');
      });
  };

  const handleUpdatePlan = () => {
    if (!validatePlan()) return;

    axios
      .put('http://localhost:8086/api/v1/financial_officer/payment_plan/full', {
        paymentPlanId,
        projectId,
        totalAmount: Number(totalAmount),
        numberOfInstallments: Number(numberOfInstallments),
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        installments,
      })
      .then(() => {
        setIsSaved(true);
        setIsEditing(false);
        console.log('paymentpalan id :', paymentPlanId);
        alert('Plan updated successfully!');
      })
      .catch((err) => {
        console.error('Update error', err);
        alert('Update failed: ' + (err.response?.data || err.message));
      });
  };

  const handleDeletePlan = () => {
    if (!window.confirm('Are you sure you want to delete this payment plan?')) return;

    axios
      .delete(`http://localhost:8086/api/v1/financial_officer/payment_plan/${projectId}`)
      .then(() => {
        setInstallments([{ dueDate: '', paidDate: '', amount: '', status: 'upcoming' }]);
        setTotalAmount('');
        setNumberOfInstallments(1);
        setStartDate('');
        setEndDate('');
        setIsSaved(false);
        setIsEditing(true);
        alert('Plan deleted!');
      })
      .catch(() => {
        alert('Failed to delete plan');
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 font-semibold">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded p-6">
      <h2 className="text-xl font-bold mb-4">Payment Plan Creator</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1">Total Amount</label>
          <input
            type="number"
            min="0"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Number of Installments</label>
          <input
            type="number"
            min="1"
            value={numberOfInstallments}
            onChange={(e) => setNumberOfInstallments(e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded w-full"
          />
        </div>
      </div>

      {installments.map((inst, idx) => (
        <div key={idx} className="grid grid-cols-5 gap-2 mb-2 items-center">
          <input
            type="date"
            value={inst.dueDate}
            onChange={(e) => handleInstallmentChange(idx, 'dueDate', e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded"
          />
          <input
            type="date"
            value={inst.paidDate}
            onChange={(e) => handleInstallmentChange(idx, 'paidDate', e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded"
          />
          <input
            type="number"
            min="0"
            value={inst.amount}
            onChange={(e) => handleInstallmentChange(idx, 'amount', e.target.value)}
            placeholder="Amount"
            disabled={!isEditing}
            className="border p-1 rounded"
          />
          <select
            value={inst.status}
            onChange={(e) => handleInstallmentChange(idx, 'status', e.target.value)}
            disabled={!isEditing}
            className="border p-1 rounded"
          >
            <option value="upcoming">upcoming</option>
            <option value="paid">paid</option>
            <option value="overdue">overdue</option>
            <option value="cancelled">cancelled</option>
          </select>
          {isEditing && (
            <button
              type="button"
              className="text-red-600"
              title="Remove installment"
              onClick={() => handleRemoveInstallment(idx)}
            >
              <RemoveCircleIcon />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <button
          type="button"
          onClick={handleAddInstallment}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          + Add Installment
        </button>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {!isSaved && !isEditing && (
          <button onClick={handleSavePlan} className="bg-blue-600 text-white px-4 py-2 rounded" type="button">
            Save
          </button>
        )}

        {isSaved && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-4 py-2 rounded" type="button">
            Edit
          </button>
        )}

        {isEditing && (
          <button onClick={isSaved ? handleUpdatePlan : handleSavePlan} className="bg-green-600 text-white px-4 py-2 rounded" type="button">
            {isSaved ? 'Update' : 'Save'}
          </button>
        )}

        <button onClick={handleDeletePlan} className="bg-red-500 text-white px-4 py-2 rounded" type="button">
          Delete
        </button>

        <button onClick={handleDownload} className="bg-gray-700 text-white px-4 py-2 rounded" type="button">
          Download Plan PDF
        </button>
      </div>
    </div>
  );
}
