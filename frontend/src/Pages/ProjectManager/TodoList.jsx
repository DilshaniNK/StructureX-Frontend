import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Flag, Search, Filter, CheckCircle, Circle, AlertTriangle, Clock, Edit3, Trash2 } from 'lucide-react';
import axios from 'axios';

const TodoList = () => {
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
        <div className="fixed inset-0  backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter task description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
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
                    } catch (err) {
                      console.error('❌ Error creating todo:', err);
                      // optionally show UI feedback here
                    }
                  }}
                  className="flex-1 bg-primary-500 bg-amber-400 text-black rounded-lg py-2 hover:bg-primary-600 transition-colors"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0  backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Task</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter task description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
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
                      } else {
                        console.warn('Unexpected update response', res);
                      }
                    } catch (err) {
                      console.error('❌ Error updating todo:', err);
                    }
                  }}
                  className="flex-1 bg-primary-500 bg-amber-400 text-black rounded-lg py-2 hover:bg-primary-600 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50 transition-colors"
                >
                  Cancel
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
                    } else {
                      console.warn('Unexpected delete response', res);
                    }
                  } catch (err) {
                    console.error('❌ Error deleting todo:', err);
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
    </div>
  );
};

export default TodoList;