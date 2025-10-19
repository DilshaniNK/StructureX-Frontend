import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';
import SuccessAlert from '../../Components/Employee/SuccessAlert';
import ErrorAlert from '../../Components/Employee/ErrorAlert';

// Define the API base URL
const API_BASE_URL = 'http://localhost:8086/api/v1/legal_officer'; // Adjust this based on your backend URL

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Fetch distinct project IDs from the backend
  useEffect(() => {
    const fetchProjectIds = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/distinct-project-ids`);
        
        // Transform the data to match our component's expected format
        const projectData = response.data.map(projectId => ({
          id: projectId,
          status: 'Pending', // Default status, update this based on your requirements
          date: new Date().toISOString().split('T')[0] // Current date as placeholder
        }));
        
        setProjects(projectData);
        setError(null);
        setSuccessMessage('Projects loaded successfully!');
        setShowSuccessAlert(true);
      } catch (err) {
        console.error('Error fetching project IDs:', err);
        const errorMsg = 'Failed to load projects. Please try again later.';
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setShowErrorAlert(true);
        // Keep the dummy data as fallback in case of API failure
        // setProjects([
        //   { id: 'P1', status: 'In Progress', date: '2025-08-15' },
        //   { id: 'P2', status: 'Pending', date: '2025-07-22' },
        //   { id: 'P3', status: 'Completed', date: '2025-06-30' },
        // ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectIds();
  }, []);

  const handleProjectClick = (projectId) => {
    try {
      navigate(`/legalofficer/${employeeId}/action/${projectId}`);
      setSuccessMessage(`Navigating to project ${projectId} details`);
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error navigating to project:', err);
      setErrorMessage('Failed to navigate to project details');
      setShowErrorAlert(true);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Projects Requiring Legal Review</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-amber-300"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="p-5 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-3 border-2 border-amber-100">
                      <FileText className="h-8 w-8 text-amber-600" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-amber-600 mb-2">{project.id}</h3>
                    
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No projects available for review at this time.
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            Click on a project card to view details and manage legal documents
          </div>
        </>
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
}
