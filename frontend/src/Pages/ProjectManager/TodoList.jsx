import React, { useState } from 'react';
import { Plus, Calendar, Flag, Search, Filter, CheckCircle, Circle, AlertTriangle, Clock } from 'lucide-react';

const TodoList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: 'Review foundation blueprints',
      description: 'Review and approve the updated foundation blueprints from the architect',
      priority: 'high',
      dueDate: '2024-11-25',
      completed: false,
      project: 'Downtown Office Complex',
      assignee: 'John Smith'
    },
    {
      id: 2,
      title: 'Schedule material delivery',
      description: 'Coordinate with suppliers for steel beam delivery next week',
      priority: 'high',
      dueDate: '2024-11-23',
      completed: false,
      project: 'Residential Towers',
      assignee: 'Sarah Johnson'
    },
    {
      id: 3,
      title: 'Update project timeline',
      description: 'Update the project timeline based on recent progress and delays',
      priority: 'medium',
      dueDate: '2024-11-28',
      completed: true,
      project: 'Shopping Mall Renovation',
      assignee: 'Mike Chen'
    },
    {
      id: 4,
      title: 'Safety equipment inspection',
      description: 'Conduct monthly safety equipment inspection across all sites',
      priority: 'high',
      dueDate: '2024-11-22',
      completed: false,
      project: 'All Projects',
      assignee: 'Lisa Wong'
    },
    {
      id: 5,
      title: 'Client meeting preparation',
      description: 'Prepare presentation materials for upcoming client meeting',
      priority: 'medium',
      dueDate: '2024-11-26',
      completed: false,
      project: 'Downtown Office Complex',
      assignee: 'David Park'
    },
    {
      id: 6,
      title: 'Invoice processing',
      description: 'Process and approve vendor invoices for October',
      priority: 'low',
      dueDate: '2024-11-30',
      completed: true,
      project: 'Administration',
      assignee: 'You'
    }
  ]);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-900">To-Do List</h1>
          <p className="text-gray-600 mt-2">Manage your tasks and stay organized</p>
        </div> */}
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

      {/* Todo List */}
      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className={`bg-white p-6 rounded-xl shadow-sm border transition-all duration-200 ${
            todo.completed 
              ? 'border-green-200 bg-green-50' 
              : isOverdue(todo.dueDate) 
                ? 'border-red-200 bg-red-50' 
                : 'border-gray-100 hover:shadow-md'
          }`}>
            <div className="flex items-start space-x-4">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`mt-1 flex-shrink-0 ${
                  todo.completed ? 'text-green-600' : 'text-gray-400 hover:text-primary-600'
                } transition-colors`}
              >
                {todo.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-lg font-medium ${
                    todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {todo.title}
                  </h3>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    {getPriorityIcon(todo.priority)}
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
                  <span>•</span>
                  <span>Project: {todo.project}</span>
                  <span>•</span>
                  <span>Assignee: {todo.assignee}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0  backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-400 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter task description"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Downtown Office Complex</option>
                  <option>Residential Towers</option>
                  <option>Shopping Mall Renovation</option>
                  <option>Administration</option>
                  <option>All Projects</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>You</option>
                  <option>John Smith</option>
                  <option>Sarah Johnson</option>
                  <option>Mike Chen</option>
                  <option>Lisa Wong</option>
                  <option>David Park</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
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
    </div>
  );
};

export default TodoList;