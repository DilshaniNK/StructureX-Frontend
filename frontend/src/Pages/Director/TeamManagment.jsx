import React, { useState, useEffect } from 'react';
import { Check, Users, Clock, MapPin, Phone, AlertCircle, X } from 'lucide-react';

export default function TeamAssignPage() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState({});
  const [expandedProject, setExpandedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('PM');
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showAlert = (title, text, type = 'warning') => {
    setAlert({ title, text, type });
  };

  const showConfirm = (title, text, onConfirm) => {
    setConfirmDialog({ title, text, onConfirm });
  };

  const fetchPendingProjects = async () => {
    try {
      const response = await fetch('http://localhost:8086/api/v1/director/get_pending_projects');
      if (!response.ok) {
        throw new Error('Failed to fetch pending projects');
      }
      const data = await response.json();
      console.log('Fetched pending projects:', data);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showAlert('Error', 'Failed to load pending projects. Please try again later.', 'error');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8086/api/v1/director/get_all_employee');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const responseData = await response.json();
      console.log('Fetched employees:', responseData);

      const data = responseData.map(e => ({
        id: e.employeeId,
        name: e.name,
        type: e.type?.trim(),
        projectCount: e.projectCount ?? 0,
        image: e.image || null,
      }));

      console.log('normalized', data);
      const grouped = {
        PM: data.filter(e => e.type === 'Project_Manager'),
        SQO: data.filter(e => e.type === 'Senior_QS_Officer'),
        SS: data.filter(e => e.type === 'Site_Supervisor')
      };
      setEmployees(grouped);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPendingProjects();
      await fetchEmployees();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAssignTeam = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
    setActiveTab('PM');
    if (!selectedEmployees[projectId]) {
      setSelectedEmployees(prev => ({
        ...prev,
        [projectId]: { pm_id: null, sq_id: null, ss_id: null }
      }));
    }
  };

  const handleSelectEmployee = (projectId, employee) => {
    const roleToKey = {
      'Project_Manager': 'pm_id',
      'Senior_QS_Officer': 'sq_id',
      'Site_Supervisor': 'ss_id'
    };
    const key = roleToKey[employee.type];

    setSelectedEmployees(prev => {
      const newState = {
        ...prev,
        [projectId]: {
          ...(prev[projectId] || {}),
          [key]: employee.id
        }
      };

      const selections = newState[projectId];
      console.log('Selected Team Members for Project:', projectId);
      console.log({
        pm_id: selections.pm_id,
        sq_id: selections.sq_id,
        ss_id: selections.ss_id
      });

      return newState;
    });
  };

  const isProjectReady = (projectId) => {
    const selected = selectedEmployees[projectId];
    return selected && selected.pm_id && selected.sq_id && selected.ss_id;
  };

  const handleStartProject = async (projectId) => {
    try {
      const selected = selectedEmployees[projectId];
      console.log(projectId);

      if (!selected?.pm_id || !selected?.sq_id || !selected?.ss_id) {
        showAlert('Incomplete Team', 'Please assign all required team members before starting the project', 'warning');
        return;
      }

      showConfirm(
        'Start Project?',
        'Are you sure you want to start this project? This action cannot be undone.',
        async () => {
          const payload = {
            qs_id: selected.sq_id,
            pm_id: selected.pm_id,
            ss_id: selected.ss_id,
            status: 'ongoing'
          };

          console.log('Starting project with payload:', payload);

          const response = await fetch(`http://localhost:8086/api/v1/director/start_project/${projectId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error('Failed to start project');
          }

          setProjects(prevProjects =>
            prevProjects.filter(p => p.project_id !== projectId)
          );

          setSelectedEmployees(prev => {
            const newState = { ...prev };
            delete newState[projectId];
            return newState;
          });

          showAlert('Success!', 'Project has been started successfully', 'success');
        }
      );
    } catch (error) {
      console.error('Error starting project:', error);
      showAlert('Error', 'Failed to start project. Please try again.', 'error');
    }
  };

  const getTabLabel = (tab) => {
    const labels = {
      'PM': 'Project Manager',
      'SQO': 'Senior QS Officer',
      'SS': 'Site Supervisor'
    };
    return labels[tab];
  };

  const DefaultAvatar = ({ name }) => (
    <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
      {name.charAt(0).toUpperCase()}
    </div>
  );

  const AlertModal = ({ alert, onClose }) => {
    if (!alert) return null;
    const bgColor = alert.type === 'success' ? 'bg-green-50 border-green-200' : alert.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
    const iconColor = alert.type === 'success' ? 'text-green-600' : alert.type === 'error' ? 'text-red-600' : 'text-yellow-600';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${bgColor} border rounded-lg p-6 max-w-sm w-full mx-4`}>
          <div className="flex items-start gap-4">
            <AlertCircle className={`w-6 h-6 ${iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{alert.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{alert.text}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmDialog = ({ dialog, onConfirm, onCancel }) => {
    if (!dialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-bold text-slate-900">{dialog.title}</h3>
          <p className="text-slate-600 mt-3">{dialog.text}</p>
          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
            >
              No, cancel
            </button>
            <button
              onClick={() => {
                dialog.onConfirm();
                onCancel();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Yes, start project!
            </button>
          </div>
        </div>
      </div>
    );
  };

   if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading clients...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AlertModal alert={alert} onClose={() => setAlert(null)} />
      <ConfirmDialog dialog={confirmDialog} onConfirm={() => {}} onCancel={() => setConfirmDialog(null)} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-2 flex items-center gap-3">
            <Clock className="w-10 h-10 text-[#FAAD00]" />
            Pending Projects
          </h1>
          <p className="text-slate-400">Assign team members to upcoming projects</p>
        </div>

        {/* No Pending Projects Message */}
        {projects.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No pending projects</h2>
              <p className="text-slate-500">All projects are currently assigned and active.</p>
            </div>
          </div>
        ) : (
          /* Projects Grid */
          <div className="space-y-6">
            {projects.map(project => (
              <div key={project.project_id} className="group">
                {/* Project Card */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 w-[1500px] ml-[-100px]">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                    {/* Project Image Placeholder */}
                    <div className="md:col-span-1 bg-slate-200 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">{project.name}</p>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="md:col-span-3 p-8 flex flex-col justify-between">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{project.name}</h2>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">Client:</span>
                            <span>{project.client_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="font-semibold">Location:</span>
                            <span>{project.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleAssignTeam(project.project_id)}
                          className="bg-[#FAAD00] text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                          Assign Team
                        </button>

                        <button
                          disabled={!isProjectReady(project.project_id)}
                          onClick={() => handleStartProject(project.project_id)}
                          className={`font-semibold py-2 px-5 rounded-lg transition-all duration-300 transform ${
                            isProjectReady(project.project_id)
                              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:scale-105 shadow-md hover:shadow-lg cursor-pointer'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Start Project
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee Selection Section */}
                {expandedProject === project.project_id && (
                  <div className="bg-white rounded-b-2xl px-8 py-8 border border-t-0 border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 w-[1500px] ml-[-100px]">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-[#FAAD00]" />
                        Select Team Members
                      </h3>

                      {/* Tabs */}
                      <div className="flex gap-2 border-b border-slate-200 mb-8">
                        {['PM', 'SQO', 'SS'].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-semibold text-sm transition-all duration-300 border-b-2 ${
                              activeTab === tab
                                ? 'text-[#FAAD00] border-black'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                            }`}
                          >
                            {getTabLabel(tab)}
                          </button>
                        ))}
                      </div>

                      {/* Employee Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {employees[activeTab]?.map(employee => {
                          const roleToKey = {
                            'Project_Manager': 'pm_id',
                            'Senior_QS_Officer': 'sq_id',
                            'Site_Supervisor': 'ss_id'
                          };
                          const key = roleToKey[employee.type];
                          const isSelected = selectedEmployees[project.project_id]?.[key] === employee.id;

                          return (
                            <div
                              key={employee.id}
                              onClick={() => handleSelectEmployee(project.project_id, employee)}
                              className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                isSelected
                                  ? 'border-[#FAAD00] bg-yellow-50 shadow-lg'
                                  : 'border-slate-200 bg-slate-50 hover:border-[#FAAD00]'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  {employee.image ? (
                                    <img
                                      src={employee.image}
                                      alt={employee.name}
                                      className="w-16 h-16 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <DefaultAvatar name={employee.name} />
                                  )}
                                </div>
                                {isSelected && (
                                  <div className="bg-[#FAAD00] text-white rounded-full p-1">
                                    <Check className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <h4 className="font-bold text-slate-900 text-lg mb-1">{employee.name}</h4>
                              <p className="text-black text-sm font-semibold mb-3">
                                {getTabLabel(activeTab)}
                              </p>
                              <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span>{employee.projectCount} Projects</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selection Summary */}
                      {expandedProject === project.project_id && (
                        <div className="mt-8 p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                          <h4 className="font-bold text-slate-900 mb-4">Selected Team</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { label: 'Project Manager', key: 'pm_id', tab: 'PM' },
                              { label: 'Senior QS Officer', key: 'sq_id', tab: 'SQO' },
                              { label: 'Site Supervisor', key: 'ss_id', tab: 'SS' }
                            ].map(role => {
                              const empId = selectedEmployees[project.project_id]?.[role.key];
                              const emp = employees[role.tab]?.find(e => e.id === empId);
                              return (
                                <div
                                  key={role.key}
                                  className={`p-4 rounded-lg text-center ${
                                    emp
                                      ? 'bg-green-100 border border-green-300'
                                      : 'bg-slate-100 border border-slate-300'
                                  }`}
                                >
                                  <p className="text-xs font-semibold text-slate-600 mb-1">{role.label}</p>
                                  <p className="text-sm font-bold text-slate-900">
                                    {emp ? emp.name : 'Not Selected'}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}