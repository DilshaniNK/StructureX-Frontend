import React, { useEffect, useState } from "react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    paymentId: "",
    projectId: "",
    amount: "",
    comment: "",
    date: "",
    receipt: null,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [clientPayments, setClientPayments] = useState([]);


  const [confirmations, setConfirmations] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [formConfirmation, setFormConfirmation] = useState({
    confirmation_id: "",
    payment_id: "",
    project_id: "",
    amount: "",
    document_id: "",
    status: "Pending",
    confirmation_date: "",
  });

  const [activeTab, setActiveTab] = useState("labor");

  useEffect(() => {
    const fetchClientPayments = async () => {
      try {
        const res = await fetch("http://localhost:8086/api/v1/financial_officer/payments");
        const data = await res.json();
        setClientPayments(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClientPayments();
  }, []);


  // --- FETCH FUNCTIONS ---
  const fetchPayments = async () => {
    try {
      const res = await fetch(
        "http://localhost:8086/api/v1/financial_officer/labor_payment"
      );
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        "http://localhost:8086/api/v1/financial_officer/orders"
      );
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:8086/api/v1/financial_officer");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConfirmations = async () => {
    try {
      const res = await fetch(
        "http://localhost:8086/api/v1/financial_officer/payment_confirmation"
      );
      const data = await res.json();
      setConfirmations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchByProject = async (projectId) => {
    if (!projectId) {
      fetchConfirmations();
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8086/api/v1/financial_officer/payment_confirmation/${projectId}`
      );
      const data = await res.json();
      setConfirmations(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchOrders();
    fetchProjects();
    fetchConfirmations();
  }, []);

  // --- PAYMENT HANDLERS ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (isEditing) formData.append("paymentId", form.paymentId);
    formData.append("projectId", form.projectId);
    formData.append("amount", form.amount);
    formData.append("comment", form.comment);
    formData.append("date", form.date);
    if (form.receipt) formData.append("receipt", form.receipt);

    try {
      if (isEditing) {
        await fetch(
          "http://localhost:8086/api/v1/financial_officer/labor_payment",
          {
            method: "PUT",
            body: formData
          }
        );
        alert("Payment updated successfully!");
      } else {
        await fetch(
          "http://localhost:8086/api/v1/financial_officer/labor_payment",
          {
            method: "POST",
            body: formData
          }
        );
        alert("Payment added successfully!");
      }
      setForm({ paymentId: "", projectId: "", amount: "", comment: "", date: "", receipt: null });
      setIsEditing(false);
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert("Error saving payment.");
    }
  };

  const handleEdit = (payment) => {
    setForm({
      paymentId: payment.paymentId,
      projectId: payment.projectId,
      amount: payment.amount,
      comment: payment.comment,
      date: payment.date,
      receipt: null,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await fetch(`http://localhost:8086/api/v1/financial_officer/labor_payment/${id}`, {
        method: "DELETE"
      });
      alert("Payment deleted!");
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch("http://localhost:8086/api/v1/financial_officer/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentStatus: newStatus })
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // --- CONFIRMATION HANDLERS ---
  const handleChangeConfirmation = (e) => {
    const { name, value } = e.target;
    setFormConfirmation({ ...formConfirmation, [name]: value });
  };

  const handleSubmitConfirmation = async (e) => {
  e.preventDefault();

  const payload = {
    payment_id: Number(formConfirmation.payment_id),
    project_id: formConfirmation.project_id,
    amount: Number(formConfirmation.amount),
    document_id: Number(formConfirmation.document_id),
    status: formConfirmation.status,
    confirmation_date: formConfirmation.confirmation_date,
  };

  try {
    if (isEditing) {
      // Use PUT for editing
      payload.confirmation_id = Number(formConfirmation.confirmation_id);

      const res = await fetch("http://localhost:8086/api/v1/financial_officer/payment_confirmation", {
        method: "PUT", // <-- was POST before
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updatedConfirmation = await res.json();
      // Update state with updated confirmation
      setConfirmations(prev => prev.map(c =>
        c.confirmation_id === updatedConfirmation.confirmation_id ? updatedConfirmation : c
      ));
      console.log(updatedConfirmation)
      alert("Confirmation updated!");
    } else {
      // POST for new confirmation
      const res = await fetch("http://localhost:8086/api/v1/financial_officer/payment_confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setFormConfirmation(prev => ({
        ...prev,
        confirmation_id: data.confirmationId || data.confirmation_id // depending on backend
      }));
      setConfirmations(prev => [...prev, data]);
      alert("Confirmation added!");
    }

    setFormConfirmation({ confirmation_id: "", payment_id: "", project_id: "", amount: "", document_id: "", status: "Pending", confirmation_date: "" });
    setIsEditing(false);
  } catch (err) {
    console.error(err);
    alert("Error saving confirmation.");
  }
};



  const handleEditConfirmation = (c) => {
    setFormConfirmation(c);
    setIsEditing(true);
  };

  const handleDeleteConfirmation = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`http://localhost:8086/api/v1/financial_officer/payment_confirmation/${id}`, {
        method: "DELETE"
      });
      fetchConfirmations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
  };

  // Filter data by selected project
  const filteredPayments = selectedProjectId
    ? payments.filter(p => p.projectId === selectedProjectId)
    : payments;

  const filteredOrders = selectedProjectId
    ? orders.filter(o => o.projectId === selectedProjectId)
    : orders;

  const filteredConfirmations = selectedProjectId
    ? confirmations.filter(c => c.project_id === selectedProjectId)
    : confirmations;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">Manage payments, orders, and confirmations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Project Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Project
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectSelect(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p.projectId} value={p.projectId}>
                {p.name} (ID: {p.projectId})
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("labor")}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === "labor"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Labor Payments
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === "orders"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Order Purchasing
              </button>
              <button
                onClick={() => setActiveTab("confirmations")}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === "confirmations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Payment Confirmations
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* LABOR PAYMENTS TAB */}
            {activeTab === "labor" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {isEditing ? "Edit Payment" : "Add New Payment"}
                </h2>
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment ID</label>
                        <input
                          type="text"
                          value={form.paymentId}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="projectId"
                        value={form.projectId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map(p => (
                          <option key={p.projectId} value={p.projectId}>
                            {p.name} (ID: {p.projectId})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                      <input
                        type="text"
                        name="comment"
                        value={form.comment}
                        onChange={handleChange}
                        placeholder="Add any notes..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Receipt</label>
                      <input
                        type="file"
                        name="receipt"
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {isEditing ? "Update Payment" : "Add Payment"}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ paymentId: "", projectId: "", amount: "", comment: "", date: "", receipt: null });
                          setIsEditing(false);
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Project</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Comment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Receipt</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPayments.map(p => (
                        <tr key={p.paymentId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{p.paymentId}</td>
                          <td className="px-4 py-3 text-sm">{p.projectId}</td>
                          <td className="px-4 py-3 text-sm font-medium">${p.amount}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.comment}</td>
                          <td className="px-4 py-3 text-sm">{p.date}</td>
                          <td className="px-4 py-3 text-sm">
                            {p.receiptData ? (
                              <a
                                href={`data:application/octet-stream;base64,${p.receiptData}`}
                                download={`receipt_${p.paymentId}`}
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                Download
                              </a>
                            ) : (
                              <span className="text-gray-400">No receipt</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(p)}
                                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors text-xs font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(p.paymentId)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredPayments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No payments found{selectedProjectId ? " for this project" : ""}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Management</h2>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading orders...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Project</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredOrders.map(o => (
                          <tr key={o.orderId} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{o.orderId}</td>
                            <td className="px-4 py-3 text-sm">{o.projectId}</td>
                            <td className="px-4 py-3 text-sm font-medium">${o.amount}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${o.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                                o.paymentStatus === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                {o.paymentStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <select
                                value={o.paymentStatus}
                                onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="partial">Partial</option>
                                <option value="paid">Paid</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No orders found{selectedProjectId ? " for this project" : ""}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CONFIRMATIONS TAB */}
            {activeTab === "confirmations" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {isEditing ? "Edit Confirmation" : "Add New Confirmation"}
                </h2>
                <form onSubmit={handleSubmitConfirmation} className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation ID</label>
                        <input
                          type="text"
                          value={formConfirmation.confirmation_id}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment ID <span className="text-red-500">*</span>
                      </label>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Payment <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="payment_id"
                          value={formConfirmation.payment_id}
                          onChange={(e) => {
                            const selectedPayment = payments.find(p => p.paymentId === Number(e.target.value));
                            setFormConfirmation({
                              ...formConfirmation,
                              payment_id: selectedPayment.paymentId,
                              project_id: selectedPayment.projectId,
                              amount: selectedPayment.amount,
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Payment</option>
                          {payments.map(p => (
                            <option key={p.paymentId} value={p.paymentId}>
                              {p.paymentId} - {p.projectId} (${p.amount})
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="project_id"
                        value={formConfirmation.project_id}
                        onChange={handleChangeConfirmation}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map(p => (
                          <option key={p.projectId} value={p.projectId}>
                            {p.projectName} (ID: {p.projectId})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formConfirmation.amount}
                        onChange={handleChangeConfirmation}
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="document_id"
                        value={formConfirmation.document_id}
                        onChange={handleChangeConfirmation}
                        placeholder="Enter document ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={formConfirmation.status}
                        onChange={handleChangeConfirmation}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Date</label>
                      <input
                        type="date"
                        name="confirmation_date"
                        value={formConfirmation.confirmation_date || ""}
                        onChange={handleChangeConfirmation}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {isEditing ? "Update Confirmation" : "Add Confirmation"}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormConfirmation({ confirmation_id: "", payment_id: "", project_id: "", amount: "", document_id: "", status: "Pending", confirmation_date: "" });
                          setIsEditing(false);
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Payment ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Project</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Document ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredConfirmations.map((c, index) => (
                        <tr key={c.confirmation_id || index} className="hover:bg-gray-50">

                          <td className="px-4 py-3 text-sm">{c.confirmation_id}</td>
                          <td className="px-4 py-3 text-sm">{c.payment_id}</td>
                          <td className="px-4 py-3 text-sm">{c.project_id}</td>
                          <td className="px-4 py-3 text-sm font-medium">${c.amount}</td>
                          <td className="px-4 py-3 text-sm">{c.document_id}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === "Approved" ? "bg-green-100 text-green-800" :
                              c.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{c.confirmation_date}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditConfirmation(c)}
                                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors text-xs font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteConfirmation(c.confirmation_id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredConfirmations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No confirmations found{selectedProjectId ? " for this project" : ""}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;