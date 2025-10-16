import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Flag, Search, Filter, CheckCircle, Circle, AlertTriangle, Clock, Edit3, Trash2 } from 'lucide-react';
import axios from 'axios';
import SuccessAlert from '../../Components/Employee/SuccessAlert';
import ErrorAlert from '../../Components/Employee/ErrorAlert';

const TodoList = () => {
  // Custom CSS animations
  const customStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }

    .animate-scaleIn {
      animation: scaleIn 0.3s ease-out forwards;
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0;
    }
  `;

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [getTodo, setGetTodo] = useState(false);
  const [todos, setTodos] = useState([]);


  // New form state for creating a todo
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStatus, setNewStatus] = useState('Pending');

  // Edit state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState('Pending');
  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState('');

  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // helper to map server TodoDTO -> UI todo shape used in this component
  const mapTodoFromServer = (t) => ({
    // preserve server id separately so we always call backend with the correct id
    serverId: t.taskId ?? t.id ?? t.task_id ?? t.taskID ?? null,
    id: (t.taskId ?? t.id) || Math.floor(Math.random() * 1000000),
    title: t.title ?? (t.description ? t.description.substring(0, 30) : `Task ${t.taskId ?? ''}`),
    description: t.description ?? '',
    priority: t.priority ?? (t.status ? t.status.toLowerCase() : 'low'),
    dueDate: t.date ?? t.dueDate ?? new Date().toISOString().split('T')[0],
    completed: t.status ? (String(t.status).toLowerCase() === 'completed') : false,
    project: t.project ?? '',
    assignee: t.assignee ?? ''
  });

  const userid = "EMP_001"; // Hardcoded user ID for demonstration

  useEffect(() => {
    if (userid) {
      axios
        .get(`http://localhost:8086/api/v1/project_manager/todo/${userid}`)
        .then((response) => {
          console.log("✅ Data from backend:", response.data);
          setGetTodo(response.data);
          // if server returned an array of todos, map them into the UI shape
          const data = response.data;
          if (Array.isArray(data)) {
            setTodos(data.map(mapTodoFromServer));
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching todos:", error);
          setErrorMessage('Failed to fetch todo list');
          setShowErrorAlert(true);
        });
    }
  }, [userid]);


  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'medium':
        return <Flag size={16} className="text-yellow-600" />;
      case 'low':
        return <Circle size={16} className="text-green-600" />;
      default:
        return <Circle size={16} className="text-gray-600" />;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && !todos.find(t => t.dueDate === dueDate)?.completed;
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.project.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'pending' && !todo.completed);

    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const pendingTodos = todos.filter(t => !t.completed).length;
  const overdueTodos = todos.filter(t => isOverdue(t.dueDate) && !t.completed).length;

  return (
    <div className="space-y-8">
      {/* Inject custom CSS animations */}
      <style>{customStyles}</style>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTodos}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTodos}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTodos}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <Clock className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueTodos}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-primary-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className={`bg-white p-6 rounded-xl shadow-sm border transition-all duration-200 ${todo.completed
            ? 'border-green-200 bg-green-50'
            : isOverdue(todo.dueDate)
              ? 'border-red-200 bg-red-50'
              : 'border-gray-100 hover:shadow-md'
            }`}>
            <div className="flex items-start space-x-4">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`mt-1 flex-shrink-0 ${todo.completed ? 'text-green-600' : 'text-gray-400 hover:text-primary-600'
                  } transition-colors`}
              >
                {todo.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-lg font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                    {todo.title}
                  </h3>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    {getPriorityIcon(todo.priority)}
                    <button
                      onClick={() => {
                        // open edit modal and populate fields
                        // prefer serverId when available
                        setEditTodoId(todo.serverId ?? todo.id);
                        setEditDescription(todo.description || '');
                        setEditDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
                        setEditStatus(todo.completed ? 'Completed' : 'Pending');
                        setShowEditForm(true);
                      }}
                      className="ml-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTargetId(todo.serverId ?? todo.id);
                        setDeleteTargetTitle(todo.title || todo.description || 'this task');
                        setShowDeleteConfirm(true);
                      }}
                      className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>

                <p className={`text-gray-600 mb-3 ${todo.completed ? 'opacity-60' : ''}`}>
                  {todo.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span className={isOverdue(todo.dueDate) && !todo.completed ? 'text-red-600 font-medium' : ''}>
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                      {isOverdue(todo.dueDate) && !todo.completed && ' (Overdue)'}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-400 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out animate-scaleIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="inline-block w-1.5 h-6 bg-amber-400 rounded-full mr-3"></span>
                Add New Task
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>

            <form className="p-6 space-y-6">
              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter detailed task description..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 border-gray-300 placeholder-gray-400 shadow-sm"
                />
              </div>

              {/* Date Field */}
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="due_date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 border-gray-300 shadow-sm"
                />
              </div>

              {/* Status Field */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 border-gray-300 appearance-none bg-white shadow-sm"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem"
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={async (e) => {
                    e.preventDefault();
                    // Build payload expected by your controller/DAO
                    const payload = {
                      // controller sets employeeId from path variable, but include for clarity
                      employeeId: userid,
                      status: newStatus,
                      description: newDescription,
                      date: newDate
                    };
                    try {
                      const res = await axios.post(`http://localhost:8086/api/v1/project_manager/todo/${userid}`, payload);
                      console.log('✅ Created todo:', res.data);
                      // map returned DTO into the UI shape and prepend to list
                      const created = mapTodoFromServer(res.data);
                      setTodos(prev => [created, ...prev]);
                      // reset form and close
                      setNewDescription('');
                      setNewDate('');
                      setNewStatus('Pending');
                      setShowAddForm(false);
                      // Show success alert
                      setSuccessMessage('Task added successfully!');
                      setShowSuccessAlert(true);
                    } catch (err) {
                      console.error('❌ Error creating todo:', err);
                      setErrorMessage('Failed to add task. Please try again.');
                      setShowErrorAlert(true);
                    }
                  }}
                  className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-md font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-400 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out animate-scaleIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="inline-block w-1.5 h-6 bg-amber-400 rounded-full mr-3"></span>
                Edit Task
              </h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>

            <form className="p-6 space-y-6">
              {/* Description Field */}
              <div>
                <label htmlFor="edit_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit_description"
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter detailed task description..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 border-gray-300 placeholder-gray-400 shadow-sm"
                />
              </div>

              {/* Date Field */}
              <div>
                <label htmlFor="edit_due_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="edit_due_date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 border-gray-300 shadow-sm"
                />
              </div>

              {/* Status Field */}
              <div>
                <label htmlFor="edit_status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit_status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 border-gray-300 appearance-none bg-white shadow-sm"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem"
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={async (e) => {
                    e.preventDefault();
                    const taskId = editTodoId;
                    const payload = {
                      // controller will set taskId from path; include fields that update
                      status: editStatus,
                      description: editDescription,
                      date: editDate
                    };
                    try {
                      const res = await axios.put(`http://localhost:8086/api/v1/project_manager/todo/${taskId}`, payload);
                      if (res.status === 200) {
                        // update local todo with edited values
                        setTodos(prev => prev.map(t => (t.serverId === taskId || t.id === taskId) ? {
                          ...t,
                          description: editDescription,
                          dueDate: editDate,
                          completed: String(editStatus).toLowerCase() === 'completed'
                        } : t));
                        setShowEditForm(false);
                        setEditTodoId(null);
                        console.log('✅ Todo updated');
                        // Show success alert
                        setSuccessMessage('Task updated successfully!');
                        setShowSuccessAlert(true);
                      } else {
                        console.warn('Unexpected update response', res);
                        setErrorMessage('Failed to update task. Please try again.');
                        setShowErrorAlert(true);
                      }
                    } catch (err) {
                      console.error('❌ Error updating todo:', err);
                      setErrorMessage('An error occurred while updating the task.');
                      setShowErrorAlert(true);
                    }
                  }}
                  className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-md font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-900">Confirm delete</h4>
            <p className="text-sm text-gray-600 mt-2">Are you sure you want to delete <span className="font-medium text-gray-800">{deleteTargetTitle}</span>? This action cannot be undone.</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetId(null);
                  setDeleteTargetTitle('');
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!deleteTargetId) return;
                  try {
                    const res = await axios.delete(`http://localhost:8086/api/v1/project_manager/todo/${deleteTargetId}`);
                    if (res.status === 200) {
                      setTodos(prev => prev.filter(t => !(t.serverId === deleteTargetId || t.id === deleteTargetId)));
                      console.log('✅ Todo deleted');
                      // Show success alert
                      setSuccessMessage('Task deleted successfully!');
                      setShowSuccessAlert(true);
                    } else {
                      console.warn('Unexpected delete response', res);
                      setErrorMessage('Failed to delete task. Please try again.');
                      setShowErrorAlert(true);
                    }
                  } catch (err) {
                    console.error('❌ Error deleting todo:', err);
                    setErrorMessage('An error occurred while deleting the task.');
                    setShowErrorAlert(true);
                  } finally {
                    setShowDeleteConfirm(false);
                    setDeleteTargetId(null);
                    setDeleteTargetTitle('');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      <SuccessAlert
        show={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        title="Success!"
        message={successMessage}
      />

      {/* Error Alert */}
      <ErrorAlert
        show={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        title="Error!"
        message={errorMessage}
      />
    </div>
  );
};

export default TodoList;