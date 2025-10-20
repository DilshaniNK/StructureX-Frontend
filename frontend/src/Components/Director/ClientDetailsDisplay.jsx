import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Link,Lock } from 'lucide-react';
import NewProjectForm from './NewProjectForm';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const ClientDetailsDisplay = () => {
  const [clientsWithPlan, setClientsWithPlan] = useState([]);
  const [clientsWithoutPlan, setClientsWithoutPlan] = useState([]);
  const[showProjectForm,setShowProjectForm] = useState(false);
  const [selectedClient,setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('withPlan'); // New state for active tab
  const navigate = useNavigate()
  const EMPLOYEE_ID = useParams();

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInitializeProject = (client) =>{
    setSelectedClient(client);
    setShowProjectForm(true);

  }

  const handleProjectFormClose = () =>{
    setShowProjectForm(false)
    setSelectedClient(null);
  }

  const handleAddProject = async (projectData) =>{
    try{
      const response = await fetch("http://localhost:8086/api/v1/director/initiate_project",{
        method: 'POST',
        headers: {
          'Content-type' : 'application/json'
        },
        body: JSON.stringify({
          ...projectData,
          client_id: selectedClient.client_id
        }),
      });
      console.log(selectedClient.client_id);
      if(response.ok){
        const result = await response.json(); // contains full project details
        console.log("Created project:", result); // ✅ result.project_id etc.
  
        setShowProjectForm(false);
        setSelectedClient(null);
        const confirmAssignment = window.confirm(
          'Project created successfully ! Would you like to assign team members to this project now?'
        );

        if(confirmAssignment){
          navigate(`/director/${EMPLOYEE_ID}/teammanagment`,{
            state:{
              highlightedProjectId: result.project_id,
              fromNewProject: true
            }
          });
        }

      }else{
        alert("error")
      }
    }catch(err){
      alert(err.message);
    }
  }

  const fetchClients = async () => {
    try {
      setLoading(true);
      const[withPlanRes,withoutPlanRes] = await Promise.all([
        fetch("http://localhost:8086/api/v1/director/get_all_client_withplan"),
        fetch("http://localhost:8086/api/v1/director/get_all_client_withoutplan")
      ]);
      
      if (!withPlanRes.ok || !withoutPlanRes.ok) {
        throw new Error('Failed to fetch clients');
      }
      
      const withPlanData = await withPlanRes.json();
      const withoutPlanData = await withoutPlanRes.json();

      console.log(withPlanData);
      setClientsWithPlan(withPlanData);
      setClientsWithoutPlan(withoutPlanData);
      
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ClientTable = ({ clients, title, planStatus }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {clients.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No clients found in this category</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Design Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client, index) => (
                <tr key={client.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {client.name} 
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Link className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 cursor-pointer">{client.design_link}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{client.phone_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 capitalize">{client.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                   {planStatus ? (
                    <button
                      className='bg-[#FAAD00] hover:bg-black text-black hover:text-white cursor-pointer font-semibold px-4 py-2 rounded-full shadow transition-colors'
                      onClick={() => handleInitializeProject(client)}
                      >
                        Initialize Project
                      </button>
                   ):(
                    <button
                    className="bg-gray-300 text-gray-500 cursor-not-allowed font-semibold px-4 py-2 rounded-full shadow flex items-center gap-2"
                    disabled
                    >
                        <Lock className="w-4 h-4" />
                        Initialize Project
                    </button>
                   )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading clients</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchClients}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Overview of all registered clients</h2>
        
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#FAAD00' }}>
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-800">
                {clientsWithPlan.length + clientsWithoutPlan.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">With Plan</p>
              <p className="text-2xl font-bold text-gray-800">{clientsWithPlan.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-500">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Without Plan</p>
              <p className="text-2xl font-bold text-gray-800">{clientsWithoutPlan.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('withPlan')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'withPlan'
                ? 'border-black text-[#FAAD00]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2 bg-[#FAAD00]"
                
              ></div>
              Clients with Plan ({clientsWithPlan.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('withoutPlan')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'withoutPlan'
                ? 'border-[#FAAD00] text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2 bg-black"
                
              ></div>
              Clients without Plan ({clientsWithoutPlan.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'withPlan' && (
          <ClientTable 
            clients={clientsWithPlan} 
            title="Clients with Plan" 
            planStatus={true}
          />
        )}
        
        {activeTab === 'withoutPlan' && (
          <ClientTable 
            clients={clientsWithoutPlan} 
            title="Clients without Plan" 
            planStatus={false}
          />
        )}
      </div>
      {showProjectForm && (
        <NewProjectForm 
          onClose={handleProjectFormClose}
          onAdd={handleAddProject}
          client={selectedClient}
        />
      )}
    </div>
  );
};

export default ClientDetailsDisplay;