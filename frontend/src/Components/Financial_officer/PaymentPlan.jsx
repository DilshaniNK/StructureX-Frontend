import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function PaymentPlanCreator() {
  const [installments, setInstallments] = useState([
    { dueDate: '', milestone: '', amount: '', status: 'Pending' }
  ]);
  const [terms, setTerms] = useState({
    latePenalty: '',
    earlyDiscount: '',
    cancellation: '',
    paymentMethod: '',
  });
  const [isSaved, setIsSaved] = useState(false);

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
   doc.setFontSize(18);
  doc.setTextColor('#faad00');  // set text color

  const pageWidth = doc.internal.pageSize.getWidth();
  const title = 'Payment Plan';

  // Center the title at y = 15
  doc.text(title, pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor('#000000'); // Reset color to black for content

  let y = 25; // start below title


    installments.forEach((item, i) => {
      doc.text(
        `${i + 1}. Due: ${item.dueDate}, Milestone: ${item.milestone}, Amount: ${item.amount}, Status: ${item.status}`,
        10,
        20 + i * 10
      );
    });

    doc.text('Terms & Conditions:', 10, 30 + installments.length * 10);
    doc.text(`Late Penalty: ${terms.latePenalty}`, 10, 40 + installments.length * 10);
    doc.text(`Early Discount: ${terms.earlyDiscount}`, 10, 50 + installments.length * 10);
    doc.text(`Cancellation: ${terms.cancellation}`, 10, 60 + installments.length * 10);
    doc.text(`Payment Method: ${terms.paymentMethod}`, 10, 70 + installments.length * 10);

    doc.save('payment-plan.pdf');
  };

  const handleSavePlan = () => {
    setIsSaved(true);
    alert('Payment Plan Saved!');
    // Optional: send to backend/localStorage
  };

  const handleUpdatePlan = () => {
    setIsSaved(false);
  };

  const handleDeletePlan = () => {
    setInstallments([{ dueDate: '', milestone: '', amount: '', status: 'Pending' }]);
    setTerms({
      latePenalty: '',
      earlyDiscount: '',
      cancellation: '',
      paymentMethod: '',
    });
    setIsSaved(false);
    alert('Payment Plan Deleted.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 rounded-xl bg-white mb-5 overflow-x-auto">
  <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Plan Creator</h2>

  {installments.map((inst, index) => (
    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4 items-center">
      <input
        type="date"
        value={inst.dueDate}
        onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
        className="border p-2 rounded w-full"
        disabled={isSaved}
      />
      <input
        type="text"
        value={inst.milestone}
        onChange={(e) => handleInstallmentChange(index, 'milestone', e.target.value)}
        className="border p-2 rounded w-full"
        placeholder="Milestone"
        disabled={isSaved}
      />
      <input
        type="number"
        value={inst.amount}
        onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
        className="border p-2 rounded w-full"
        placeholder="Amount"
        disabled={isSaved}
      />
      <select
        value={inst.status}
        onChange={(e) => handleInstallmentChange(index, 'status', e.target.value)}
        className="border p-2 rounded w-full"
        disabled={isSaved}
      >
        <option>Pending</option>
        <option>Paid</option>
        <option>Overdue</option>
      </select>
      {!isSaved && (
        <button
          onClick={() => handleRemoveInstallment(index)}
          className="text-red-600 text-xl font-bold hover:text-red-800 justify-self-start"
          title="Remove"
        >
          <RemoveCircleIcon />
        </button>
      )}
    </div>
  ))}

  {!isSaved && (
    <button
      onClick={handleAddInstallment}
      className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 transition w-full sm:w-auto"
    >
      + Add Installment
    </button>
  )}

  

  <div className="flex flex-col sm:flex-row gap-4 mb-4">
    {!isSaved && (
      <button
        onClick={handleSavePlan}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
      >
        Save
      </button>
    )}
    {isSaved && (
      <button
        onClick={handleUpdatePlan}
        className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 w-full sm:w-auto"
      >
        Update
      </button>
    )}
    <button
      onClick={handleDeletePlan}
      className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
    >
      Delete
    </button>
    <button
      onClick={handleDownload}
      className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 w-full sm:w-auto"
    >
      Download
    </button>
  </div>
</div>

  );
}
