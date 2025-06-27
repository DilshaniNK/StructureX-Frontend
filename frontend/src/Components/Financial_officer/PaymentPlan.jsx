// PaymentPlanCreator.js
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function PaymentPlanCreator() {
  const [project, setProject] = useState(null);
  const [installments, setInstallments] = useState([{ dueDate: '', milestone: '', amount: '', status: 'Pending' }]);
  const [terms, setTerms] = useState({ latePenalty: '', earlyDiscount: '', cancellation: '', paymentMethod: '' });
  const [isSaved, setIsSaved] = useState(false);
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

    axios.get(`http://localhost:8086/api/v1/financial_officer/payment_plan/${projectId}`)
      .then(res => {
        if (res.data) {
          setProject(res.data.project);
          setInstallments(res.data.installments);
          setTerms(res.data.terms);
          setIsSaved(true);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
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
    updated[index][field] = value;
    setInstallments(updated);
  };

  const handleTermChange = (field, value) => {
    setTerms({ ...terms, [field]: value });
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor('#faad00');
    const title = 'Payment Plan';
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(title, pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor('#000');
    let y = 25;

    installments.forEach((item, i) => {
      doc.text(`${i + 1}. Due: ${item.dueDate}, Milestone: ${item.milestone}, Amount: ${item.amount}, Status: ${item.status}`, 10, y);
      y += 10;
    });

    doc.text('Terms & Conditions:', 10, y + 10);
    doc.text(`Late Penalty: ${terms.latePenalty}`, 10, y + 20);
    doc.text(`Early Discount: ${terms.earlyDiscount}`, 10, y + 30);
    doc.text(`Cancellation: ${terms.cancellation}`, 10, y + 40);
    doc.text(`Payment Method: ${terms.paymentMethod}`, 10, y + 50);

    doc.save('payment-plan.pdf');
  };

  const handleSavePlan = () => {
    axios.post('http://localhost:8086/api/v1/financial_officer/payment_plan', {
      projectId,
      installments,
      terms
    }).then(() => {
      setIsSaved(true);
      alert('Plan saved!');
    });
  };

  const handleUpdatePlan = () => {
    axios.put(`http://localhost:8086/api/v1/financial_officer/payment_plan/${projectId}`, {
      installments,
      terms
    }).then(() => {
      setIsSaved(true);
      alert('Plan updated!');
    });
  };

  const handleDeletePlan = () => {
    axios.delete(`http://localhost:8086/api/v1/financial_officer/payment_plan/${projectId}`)
      .then(() => {
        setInstallments([{ dueDate: '', milestone: '', amount: '', status: 'Pending' }]);
        setTerms({ latePenalty: '', earlyDiscount: '', cancellation: '', paymentMethod: '' });
        setIsSaved(false);
        alert('Deleted!');
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded p-6">
      <h2 className="text-xl font-bold mb-4">Payment Plan Creator</h2>
      {installments.map((inst, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 mb-2">
          <input type="date" value={inst.dueDate} onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)} className="border p-1 rounded" disabled={isSaved} />
          <input type="text" value={inst.milestone} onChange={(e) => handleInstallmentChange(index, 'milestone', e.target.value)} placeholder="Milestone" className="border p-1 rounded" disabled={isSaved} />
          <input type="number" value={inst.amount} onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)} placeholder="Amount" className="border p-1 rounded" disabled={isSaved} />
          <select value={inst.status} onChange={(e) => handleInstallmentChange(index, 'status', e.target.value)} className="border p-1 rounded" disabled={isSaved}>
            <option>Pending</option><option>Paid</option><option>Overdue</option>
          </select>
          {!isSaved && (
            <button onClick={() => handleRemoveInstallment(index)} className="text-red-600"><RemoveCircleIcon /></button>
          )}
        </div>
      ))}
      {!isSaved && <button onClick={handleAddInstallment} className="bg-green-500 text-white px-4 py-2 rounded">+ Add Installment</button>}
     {/* <div className="my-4">
        <input type="text" placeholder="Late Penalty" value={terms.latePenalty} onChange={(e) => handleTermChange('latePenalty', e.target.value)} className="border p-1 mr-2" disabled={isSaved} />
        <input type="text" placeholder="Early Discount" value={terms.earlyDiscount} onChange={(e) => handleTermChange('earlyDiscount', e.target.value)} className="border p-1 mr-2" disabled={isSaved} />
        <input type="text" placeholder="Cancellation" value={terms.cancellation} onChange={(e) => handleTermChange('cancellation', e.target.value)} className="border p-1 mr-2" disabled={isSaved} />
        <input type="text" placeholder="Payment Method" value={terms.paymentMethod} onChange={(e) => handleTermChange('paymentMethod', e.target.value)} className="border p-1" disabled={isSaved} />
      </div>*/}
      <div className="flex gap-2">
        {!isSaved && <button onClick={handleSavePlan} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>}
        {isSaved && <button onClick={handleUpdatePlan} className="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>}
        <button onClick={handleDeletePlan} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        <button onClick={handleDownload} className="bg-gray-700 text-white px-4 py-2 rounded">Download</button>
      </div>
    </div>
  );
}
