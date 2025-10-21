import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SuccessAlert from '../../Components/Employee/SuccessAlert';
import ErrorAlert from '../../Components/Employee/ErrorAlert';

function Projects() {
  const [activeTab, setActiveTab] = useState('ongoing')
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateFormData, setUpdateFormData] = useState({
    id: '',
    name: '',
    date: '',
    location: '',
    tools: ''
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [nullLocationProjects, setNullLocationProjects] = useState([])
  const [isLoadingInitiatedProjects, setIsLoadingInitiatedProjects] = useState(false)
  const [initiatedProjectsError, setInitiatedProjectsError] = useState(null)
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [projectDesigns, setProjectDesigns] = useState([])
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(false)
  const [projectwbs, setProjectwbs] = useState([])
  const [isLoadingWBS, setIsLoadingWBS] = useState(false)
  const [projectboq, setProjectboq] = useState([])
  const [isLoadingBOQ, setIsLoadingBOQ] = useState(false)
  const [projectpayments, setProjectpayments] = useState([])
  const [isLoadingPayments, setIsLoadingPayments] = useState(false)
  const [projectMaterials, setProjectMaterials] = useState([])
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false)
  
  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { employeeId } = useParams();
  console.log("🚀 ProjectManager Projects - UserID from params:", employeeId);

  // Function to copy design link to clipboard
  const copyDesignLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      console.log('✅ Design link copied to clipboard');
      setSuccessMessage('Design link copied to clipboard!');
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('❌ Failed to copy link:', error);
      setErrorMessage('Failed to copy link. Please try again.');
      setShowErrorAlert(true);
    }
  };

const fetchProjectMaterials = async (projectId) =>{
  if (!projectId) {
    console.warn("⚠️ No project ID provided for fetching materials");
    return;
  }
  console.log("🔍 Fetching materials for project ID:", projectId)
  setIsLoadingMaterials(true)
  try {
    const response = await axios.get(
      `http://localhost:8086/api/v1/project_manager/materials/${projectId}`
    )
    console.log("✅ Materials data from backend:", response.data);
    const data = response.data;
    let arr = [];
    if (Array.isArray(data)) {
      arr = data;
    } else if (data && typeof data === "object" && Array.isArray(data.updates)) {
      arr = data.updates;
    } else if (data && typeof data === "object") {
      arr = [data];
    }
    console.log("📋 Processed materials data:", arr)
    setProjectMaterials(arr)
  } catch (error) {
    console.error("❌ Error fetching project materials:", error)
    setProjectMaterials([])
    setErrorMessage('Failed to load project materials. Please try again.');
    setShowErrorAlert(true);
  } finally {
    setIsLoadingMaterials(false)
  }
}

 const fetchProjectPayments = async (projectId) =>{
    if (!projectId) {
      console.warn("⚠️ No project ID provided for fetching payments");
      return;
    }
    console.log("🔍 Fetching payments for project ID:", projectId)
    setIsLoadingPayments(true)
    try {
      const response = await axios.get(
        `http://localhost:8086/api/v1/project_manager/payment/${projectId}`
      )
      console.log("✅ Payments data from backend:", response.data);
      const data = response.data;
      let arr = [];
      if (Array.isArray(data)) {
        arr = data;
      } else if (data && typeof data === "object" && Array.isArray(data.updates)) {
        arr = data.updates;
      } else if (data && typeof data === "object") {
        arr = [data];
      }
      console.log("📋 Processed payments data:", arr)
      setProjectpayments(arr)
    } catch (error) {
      console.error("❌ Error fetching project payments:", error)
      setProjectpayments([])
      setErrorMessage('Failed to load project payments. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setIsLoadingPayments(false)
    }
 }

  // Fetch project BOQ when a project is selected
  const fetchProjectBOQ = async (projectId) => {
    if (!projectId) {
      console.warn("⚠️ No project ID provided for fetching BOQ");
      return;
    }
    console.log("🔍 Fetching BOQ for project ID:", projectId)
    setIsLoadingBOQ(true)
    try {
      const response = await axios.get(
        `http://localhost:8086/api/v1/project_manager/boq/${projectId}`
      )
      console.log("✅ BOQ data from backend:", response.data);
      const data = response.data;
      let arr = [];
      if (Array.isArray(data)) {
        arr = data;
      } else if (data && typeof data === "object" && Array.isArray(data.updates)) {
        arr = data.updates;
      } else if (data && typeof data === "object") {
        arr = [data];
      }
      console.log("📋 Processed boq data:", arr)
      setProjectboq(arr)
    } catch (error) {
      console.error("❌ Error fetching project boq:", error)
      setProjectboq([])
      setErrorMessage('Failed to load project BOQ. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setIsLoadingBOQ(false)
    }
  };

  // Fetch project WBS when a project is selected
  const fetchProjectswbs = async (projectId) => {
    if (!projectId) {
      console.warn("⚠️ No project ID provided for fetching WBS");
      return;
    }

    console.log("🔍 Fetching WBS for project ID:", projectId);
    setIsLoadingWBS(true);
    try {
      const response = await axios.get(
        `http://localhost:8086/api/v1/project_manager/wbs/${projectId}`
      );
      console.log("✅ WBS data from backend:", response.data);
      const data = response.data;
      let arr = [];

      if (Array.isArray(data)) {
        arr = data;
      } else if (data && typeof data === "object" && Array.isArray(data.updates)) {
        arr = data.updates;
      } else if (data && typeof data === "object") {
        arr = [data];
      }
      console.log("📋 Processed wbs data:", arr);
      setProjectwbs(arr);
    } catch (error) {
      console.error("❌ Error fetching project wbs:", error);
      setProjectwbs([]);
      setErrorMessage('Failed to load project WBS. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setIsLoadingWBS(false);
    }
  };



  // Fetch project designs when a project is selected
  const fetchProjectDesigns = async (projectId) => {
    if (!projectId) {
      console.warn("⚠️ No project ID provided for fetching designs");
      return;
    }

    console.log("🔍 Fetching designs for project ID:", projectId);
    setIsLoadingDesigns(true);
    try {
      const response = await axios.get(
        `http://localhost:8086/api/v1/project_manager/design-link/${projectId}`
      );
      console.log("✅ Design data from backend:", response.data);

      // Normalize the response into an array
      const data = response.data;
      let arr = [];

      if (Array.isArray(data)) {
        arr = data;
      } else if (data && typeof data === "object" && Array.isArray(data.updates)) {
        arr = data.updates;
      } else if (data && typeof data === "object") {
        arr = [data];
      } else if (typeof data === "string" && data.trim() !== "") {
        // Handle string URL response
        arr = [{
          design_link: data,
          description: "Design Link",
          created_at: new Date().toISOString()
        }];
      } else if (data) {
        // Handle any other non-empty data type
        arr = [{
          design_link: data.toString(),
          description: "Design Link",
          created_at: new Date().toISOString()
        }];
      }

      console.log("📋 Processed design data:", arr);
      setProjectDesigns(arr);
    } catch (error) {
      console.error("❌ Error fetching project designs:", error);
      setProjectDesigns([]);
      setErrorMessage('Failed to load project designs. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setIsLoadingDesigns(false);
    }
  };

  // Function to refresh project data
  const refreshProjectData = async () => {
    if (!employeeId) return;

    setIsLoadingProjects(true);

    try {
      // Fetch both ongoing and completed projects
      const [ongoingResponse, completedResponse] = await Promise.all([
        axios.get(`http://localhost:8086/api/v1/project_manager/projects/${employeeId}/ongoing`),
        axios.get(`http://localhost:8086/api/v1/project_manager/projects/${employeeId}/completed`)
      ]);

      // Process ongoing projects
      const ongoingData = ongoingResponse.data;
      let ongoingArr = [];
      if (Array.isArray(ongoingData)) {
        ongoingArr = ongoingData;
      } else if (ongoingData && typeof ongoingData === "object" && Array.isArray(ongoingData.updates)) {
        ongoingArr = ongoingData.updates;
      } else if (ongoingData && typeof ongoingData === "object") {
        ongoingArr = [ongoingData];
      }
      setOngoingProjects(ongoingArr);

      // Process completed projects
      const completedData = completedResponse.data;
      let completedArr = [];
      if (Array.isArray(completedData)) {
        completedArr = completedData;
      } else if (completedData && typeof completedData === "object" && Array.isArray(completedData.updates)) {
        completedArr = completedData.updates;
      } else if (completedData && typeof completedData === "object") {
        completedArr = [completedData];
      }
      setCompletedProjects(completedArr);

      console.log("✅ Project data refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing project data:", error);
      setErrorMessage('Failed to refresh project data. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    refreshProjectData();
  }, [employeeId]);

  // Auto hide success alert after 3 seconds
  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  // Auto hide error alert after 5 seconds
  useEffect(() => {
    if (showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorAlert]);

  useEffect(() => {
    if (employeeId) {
      setIsLoadingInitiatedProjects(true)
      setInitiatedProjectsError(null)
      axios
        .get(
          `http://localhost:8086/api/v1/project_manager/null-location-projects/${employeeId}`
        )
        .then((response) => {
          console.log("✅ Data from backend:", response.data);
          // Normalize the response into an array so callers can safely use array methods
          const data = response.data;
          let arr = [];
          if (Array.isArray(data)) {
            arr = data;
          } else if (data && typeof data === "object" && Array.isArray(data.updates)) {
            // some APIs wrap results in an `updates` field
            arr = data.updates;
          } else if (data && typeof data === "object") {
            // single object -> wrap in array
            arr = [data];
          }
          setNullLocationProjects(arr);
        })
        .catch((error) => {
          console.error("❌ Error fetching initiated projects:", error);
          setInitiatedProjectsError("Failed to load initiated projects");
          setErrorMessage('Failed to load initiated projects. Please try again.');
          setShowErrorAlert(true);
        })
        .finally(() => {
          setIsLoadingInitiatedProjects(false)
        });
    } else {
      console.warn("⚠️ No user ID provided, skipping fetch.");
    }
  }, [employeeId]);


  // Sample data - replace with actual API calls
  const projectsData = {
    ongoing: [],
    finished: []
  }

  const handleProjectSelect = (project) => {
    console.log('🎯 Selected project:', project)
    setSelectedProject(project)
    setActiveSection('overview')

    // Fetch project designs when a project is selected
    const projectId = project.code || project.project_id || project.id || project.projectId;
    if (projectId) {
      fetchProjectDesigns(projectId);
      fetchProjectswbs(projectId);
      fetchProjectBOQ(projectId);
      fetchProjectPayments(projectId);
      fetchProjectMaterials(projectId);
    }
  }

  const handleUpdateClick = (project) => {
    setUpdateFormData({
      id: project.code || project.project_id || project.id || project.projectId,
      name: project.name || project.projectName,
      date: project.startDate || project.createdDate,
      location: project.location || '',
      tools: project.tools || ''
    })
    setShowUpdateForm(true)
  }

  const handleUpdateFormSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // API 1: Update project location
      const locationUpdateResponse = await axios.put(
        `http://localhost:8086/api/v1/project_manager/update-location/${updateFormData.id}?location=${encodeURIComponent(updateFormData.location)}`
      )

      if (locationUpdateResponse.status === 200) {
        console.log('✅ Location updated successfully')

        // API 2: Send project data to material system
        const materialDataResponse = await axios.post(
          `http://localhost:8086/api/v1/project_manager/add-project-material`,
          {
            project_id: updateFormData.id,
            tools: updateFormData.tools,
          }
        )

        if (materialDataResponse.status === 200) {
          console.log('✅ Project data sent to materials successfully')
          setSuccessMessage('Project updated successfully and sent to materials system!');
          setShowSuccessAlert(true);

          // Refresh the projects list to get updated data
          if (employeeId) {
            const response = await axios.get(
              `http://localhost:8086/api/v1/project_manager/null-location-projects/${employeeId}`
            )
            const data = response.data;
            let arr = [];
            if (Array.isArray(data)) {
              arr = data;
            } else if (data && typeof data === "object" && Array.isArray(data.updates)) {
              arr = data.updates;
            } else if (data && typeof data === "object") {
              arr = [data];
            }
            setNullLocationProjects(arr);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error updating project:', error)
      setErrorMessage('Failed to update project. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setIsUpdating(false)
      setShowUpdateForm(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setUpdateFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Get all projects for the main table
  const getAllProjects = () => {
    // Combine static projects with initiated projects from API
    const staticProjects = [
      ...projectsData.ongoing,
      ...projectsData.finished
    ]

    // Add initiated projects directly without formatting
    return [
      ...staticProjects,
      ...nullLocationProjects
    ]
  }

  const toggleMilestone = (taskId, isSubTask = false, parentId = null) => {
    setWbsData(prevData => {
      return prevData.map(task => {
        if (!isSubTask && task.id === taskId) {
          return { ...task, isMilestone: !task.isMilestone }
        } else if (isSubTask && task.id === parentId) {
          return {
            ...task,
            subTasks: task.subTasks.map(subTask =>
              subTask.id === taskId
                ? { ...subTask, isMilestone: !subTask.isMilestone }
                : subTask
            )
          }
        }
        return task
      })
    })
  }

  const toggleExpanded = (taskId) => {
    setWbsData(prevData => {
      return prevData.map(task => {
        if (task.id === taskId) {
          return { ...task, isExpanded: !task.isExpanded }
        }
        return task
      })
    })
  }

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toLowerCase()) {
      case 'in progress':
      case 'ongoing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
      case 'complete':
        return 'bg-green-100 text-green-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'not started':
        return 'bg-yellow-100 text-yellow-800'
      case 'initiated':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderProjectList = () => {
    // Get the projects based on active tab
    const projects = activeTab === 'ongoing' ? ongoingProjects : completedProjects;
    console.log('renderProjectList - activeTab:', activeTab, 'projects:', projects);

    // Show loading state
    if (isLoadingProjects) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <span className="ml-2 text-gray-600">Loading projects...</span>
        </div>
      );
    }

    // Show empty state if no projects
    if (!projects || projects.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">
            No {activeTab === 'ongoing' ? 'ongoing' : 'completed'} projects found
          </div>
          <p className="text-gray-400">
            {activeTab === 'ongoing' ? 'All projects have been completed' : 'No projects have been completed yet'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.project_id || project.id || index}
            className="bg-white border border-gray-200 rounded-lg p-4 transition duration-200 transform hover:shadow-lg cursor-pointer hover:-translate-y-1"
            onClick={() => handleProjectSelect(project)}
          >
            {/* Project Image - use default if not available */}
            <img
              src={project.image || project.projectImage || 'https://edenchristianacademy.co.nz/wp-content/uploads/2013/11/dummy-image-square.jpg'}
              alt={project.project_names || project.name || 'Project'}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = 'https://edenchristianacademy.co.nz/wp-content/uploads/2013/11/dummy-image-square.jpg'; // fallback image
              }}
            />

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {project.project_names || project.name || 'Unnamed Project'}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-bold">ID:</span> {project.project_id || project.code || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-bold">Location:</span> {project.location || 'Not specified'}
              </p>
              {project.start_date && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-bold">Start Date:</span> {new Date(project.start_date).toLocaleDateString()}
                </p>
              )}
              {project.end_date && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-bold">End Date:</span> {new Date(project.end_date).toLocaleDateString()}
                </p>
              )}

              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status || activeTab)}`}>
                  {project.status || (activeTab === 'ongoing' ? 'In Progress' : 'Completed')}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderSectionContent = () => {
    switch (activeSection) {

      case 'design':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Design / Plan </h3>
              <span className="text-sm text-gray-500">
                {projectDesigns.length} design(s) available
              </span>
            </div>

            {/* Loading state */}
            {isLoadingDesigns && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading designs...</span>
              </div>
            )}

            {/* Design links display */}
            <div className="space-y-4">
              {!isLoadingDesigns && projectDesigns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No designs available</p>
                  <p className="text-sm">Design links will appear here once uploaded.</p>
                </div>
              ) : (
                projectDesigns.map((design, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <div>
                          <div className='flex flex-col font-'>
                            <span className="text-gray-900 font-medium text-2xl">
                              {design.name || `Design Link ${index + 1}`}
                            </span>
                            <span className='text-gray-600 text-sm'>
                              {design.description || `Design Link ${index + 1}`}
                            </span>
                          </div>
                          {design.due_date && (
                            <p className="text-sm text-gray-500">
                              Due Date: {new Date(design.due_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <a
                        href={design.design_link || design.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        Open Link
                      </a>
                      <button
                        onClick={() => copyDesignLink(design.design_link || design.link)}
                        className="text-gray-600 hover:text-gray-800 text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )

      case 'wbs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Work Breakdown Structure (WBS)</h3>
              <span className="text-sm text-gray-500">
                {projectwbs.length} WBS item(s) available
              </span>
            </div>

            {/* Loading state */}
            {isLoadingWBS && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading WBS data...</span>
              </div>
            )}

            {/* WBS Items Display */}
            <div className="space-y-4">
              {!isLoadingWBS && projectwbs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <p className="text-lg font-medium">No WBS items available</p>
                  <p className="text-sm">Work breakdown structure items will appear here once created.</p>
                </div>
              ) : (
                projectwbs.map((wbsItem, index) => (
                  <div key={wbsItem.taskId || index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* Header with milestone indicator */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            {/* Parent ID Badge */}
                            {wbsItem.parentId && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Parent: {wbsItem.parentId}
                              </span>
                            )}

                            {/* Milestone Badge */}
                            {wbsItem.milestone && (
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Milestone
                              </span>
                            )}
                          </div>

                          {/* WBS Item Name */}
                          <h4 className="text-lg font-semibold text-gray-900 mt-2">
                            {wbsItem.name || wbsItem.taskName || `WBS Item ${index + 1}`}
                          </h4>

                          {/* Description if available */}
                          {wbsItem.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {wbsItem.description}
                            </p>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${wbsItem.status === 'Completed' || wbsItem.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : wbsItem.status === 'In Progress' || wbsItem.status === 'in_progress' || wbsItem.status === 'ongoing'
                                ? 'bg-blue-100 text-blue-800'
                                : wbsItem.status === 'Pending' || wbsItem.status === 'pending' || wbsItem.status === 'not_started'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                            {wbsItem.status || 'Not Set'}
                          </span>
                        </div>
                      </div>

                      {/* WBS Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        {/* ID/Code */}
                        <div>
                          <span className="text-gray-500 font-medium">WBS ID:</span>
                          <p className="text-gray-900 font-mono">
                            {wbsItem.taskId || wbsItem.wbsId || wbsItem.code || 'N/A'}
                          </p>
                        </div>

                        {/* Parent ID */}
                        <div>
                          <span className="text-gray-500 font-medium">Parent ID:</span>
                          <p className="text-gray-900 font-mono">
                            {wbsItem.parentId || 'Root Level'}
                          </p>
                        </div>

                        {/* Status */}
                        <div>
                          <span className="text-gray-500 font-medium">Status:</span>
                          <p className="text-gray-900">
                            {wbsItem.status || 'Not Set'}
                          </p>
                        </div>

                        {/* Milestone */}
                        <div>
                          <span className="text-gray-500 font-medium">Milestone:</span>
                          <p className="text-gray-900">
                            {wbsItem.milestone ? 'Yes' : 'No'}
                          </p>
                        </div>

                        {/* Additional fields if available */}
                        {wbsItem.startDate && (
                          <div>
                            <span className="text-gray-500 font-medium">Start Date:</span>
                            <p className="text-gray-900">
                              {new Date(wbsItem.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {wbsItem.endDate && (
                          <div>
                            <span className="text-gray-500 font-medium">End Date:</span>
                            <p className="text-gray-900">
                              {new Date(wbsItem.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {wbsItem.assignedTo && (
                          <div>
                            <span className="text-gray-500 font-medium">Assigned To:</span>
                            <p className="text-gray-900">
                              {wbsItem.assignedTo}
                            </p>
                          </div>
                        )}

                        {wbsItem.priority && (
                          <div>
                            <span className="text-gray-500 font-medium">Priority:</span>
                            <p className="text-gray-900">
                              {wbsItem.priority}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Progress bar if available */}
                      {wbsItem.progress !== undefined && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm text-gray-500">{wbsItem.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${wbsItem.progress >= 100 ? 'bg-green-500' :
                                  wbsItem.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}
                              style={{ width: `${Math.min(100, Math.max(0, wbsItem.progress || 0))}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Milestone Summary */}
            {projectwbs.length > 0 && (
              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Milestone Summary ({projectwbs.filter(item => item.milestone).length} milestones)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projectwbs.filter(item => item.milestone).map((milestone, index) => (
                    <div key={milestone.id || index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-yellow-200">
                      <div className={`w-3 h-3 rounded-full ${milestone.status === 'Completed' || milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'In Progress' || milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-yellow-900 truncate">
                          {milestone.name || milestone.taskName || `Milestone ${index + 1}`}
                        </p>
                        <p className="text-xs text-yellow-700">
                          Status: {milestone.status || 'Not Set'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {projectwbs.filter(item => item.milestone).length === 0 && (
                    <div className="col-span-full text-center py-4 text-yellow-700">
                      No milestones marked in current WBS items
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case 'boq':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Bill of Quantities (BOQ)</h3>
              <span className="text-sm text-gray-500">
                {projectboq.length} BOQ item(s) available
              </span>
            </div>

            {/* Loading state */}
            {isLoadingBOQ && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading BOQ data...</span>
              </div>
            )}

            {/* Total Value Summary */}
            {!isLoadingBOQ && projectboq.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-900">Total Project Value</h4>
                    <p className="text-sm text-blue-700">Complete Bill of Quantities Summary</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-900">
                      Rs {projectboq.reduce((total, item) => {
                        const amount = parseFloat(item.amount || 0);
                        return total + (isNaN(amount) ? 0 : amount);
                      }, 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-blue-600">Including all materials and quantities</p>
                  </div>
                </div>
              </div>
            )}

            {/* BOQ Items Display */}
            <div className="space-y-4">
              {!isLoadingBOQ && projectboq.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No BOQ items available</p>
                  <p className="text-sm">Bill of Quantities items will appear here once created.</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            BOQ ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rate (LKR)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount (LKR)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projectboq.map((item, index) => (
                          <tr key={item.boqId || item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.boqId || item.id || `BOQ-${index + 1}`}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                              <div className="truncate" title={item.itemDescription || item.description || 'No description'}>
                                {item.itemDescription || item.description || 'No description'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {item.unit || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {item.quantity || '0'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              Rs {parseFloat(item.rate || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              Rs {parseFloat(item.amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {projectboq.length > 0 && (
                        <tfoot className="bg-gray-100">
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                              Grand Total:
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                              Rs {projectboq.reduce((total, item) => {
                                const amount = parseFloat(item.amount || 0);
                                return total + (isNaN(amount) ? 0 : amount);
                              }, 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* BOQ Summary Statistics */}
            {projectboq.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800">Total Items</p>
                      <p className="text-2xl font-bold text-green-900">{projectboq.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Average Rate</p>
                      <p className="text-2xl font-bold text-blue-900">
                        Rs {projectboq.length > 0 ? 
                          (projectboq.reduce((total, item) => total + parseFloat(item.rate || 0), 0) / projectboq.length)
                          .toLocaleString('en-LK', { minimumFractionDigits: 2 }) : '0.00'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-purple-800">Avg. Amount</p>
                      <p className="text-2xl font-bold text-purple-900">
                        Rs {projectboq.length > 0 ? 
                          (projectboq.reduce((total, item) => total + parseFloat(item.amount || 0), 0) / projectboq.length)
                          .toLocaleString('en-LK', { minimumFractionDigits: 2 }) : '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'financial':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Financial Overview & Payments</h3>
              <span className="text-sm text-gray-500">
                {projectpayments.length} payment(s) available
              </span>
            </div>

            {/* Loading state */}
            {isLoadingPayments && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading payment data...</span>
              </div>
            )}

            {/* Financial Summary Cards */}
            {!isLoadingPayments && projectpayments.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-green-900">Payments Received</h4>
                      <p className="text-2xl font-bold text-green-700">
                        Rs {projectpayments
                          .filter(p => p.status?.toLowerCase() === 'paid' || p.status?.toLowerCase() === 'completed')
                          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
                          .toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-yellow-900">Payments Pending</h4>
                      <p className="text-2xl font-bold text-yellow-700">
                        Rs {projectpayments
                          .filter(p => p.status?.toLowerCase() === 'pending' || p.status?.toLowerCase() === 'due')
                          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
                          .toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-900">Total Amount</h4>
                      <p className="text-2xl font-bold text-blue-700">
                        Rs {projectpayments
                          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
                          .toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-purple-900">Total Payments</h4>
                      <p className="text-2xl font-bold text-purple-700">{projectpayments.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Table */}
            <div className="space-y-4">
              {!isLoadingPayments && projectpayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <p className="text-lg font-medium">No payment records available</p>
                  <p className="text-sm">Payment information will appear here once created.</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900">Payment Records</h4>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount (LKR)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Paid Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {projectpayments.map((payment, index) => (
                          <tr key={payment.paymentId || payment.id || index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payment.paymentId || payment.id || `PAY-${index + 1}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              Rs {parseFloat(payment.amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                                payment.status?.toLowerCase() === 'paid' || payment.status?.toLowerCase() === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status?.toLowerCase() === 'pending' || payment.status?.toLowerCase() === 'due'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : payment.status?.toLowerCase() === 'overdue'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {payment.status || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {payment.due_date || payment.dueDate ? 
                                new Date(payment.due_date || payment.dueDate).toLocaleDateString('en-GB') : 
                                'Not specified'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {payment.paid_date || payment.paidDate ? 
                                new Date(payment.paid_date || payment.paidDate).toLocaleDateString('en-GB') : 
                                payment.status?.toLowerCase() === 'paid' || payment.status?.toLowerCase() === 'completed' ? 
                                'Date not recorded' : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Status Summary */}
            {projectpayments.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Payments Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {projectpayments.filter(p => p.status?.toLowerCase() === 'paid' || p.status?.toLowerCase() === 'completed').length}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Payments Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {projectpayments.filter(p => p.status?.toLowerCase() === 'pending' || p.status?.toLowerCase() === 'due').length}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold text-blue-600">{projectpayments.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'materials':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Material Management</h3>
              <span className="text-sm text-gray-500">
                {projectMaterials.length} material record(s) available
              </span>
            </div>

            {/* Loading state */}
            {isLoadingMaterials && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading materials data...</span>
              </div>
            )}

            {/* Materials Display */}
            <div className="space-y-4">
              {!isLoadingMaterials && projectMaterials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-lg font-medium">No material records available</p>
                  <p className="text-sm">Material information will appear here once created.</p>
                </div>
              ) : (
                <>
                  {/* Materials Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectMaterials.map((material, index) => (
                      <div key={material.materialsId || material.id || index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Material Record</h4>
                              <p className="text-sm text-gray-500">ID: {material.materialsId || material.id || `MAT-${index + 1}`}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Materials ID */}
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Materials ID:</span>
                            <span className="text-sm font-mono text-gray-900">{material.materialsId || material.id || 'N/A'}</span>
                          </div>

                          {/* Project ID */}
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Project ID:</span>
                            <span className="text-sm font-mono text-gray-900">{material.projectId || material.project_id || 'N/A'}</span>
                          </div>

                          {/* Tools */}
                          <div className="py-2">
                            <span className="text-sm font-medium text-gray-600 block mb-2">Tools:</span>
                            <div className="bg-gray-50 rounded-lg p-3">
                              {material.tools ? (
                                <p className="text-sm text-gray-900 leading-relaxed">{material.tools}</p>
                              ) : (
                                <p className="text-sm text-gray-500 italic">No tools specified</p>
                              )}
                            </div>
                          </div>

                          {/* Additional fields if available */}
                          {material.createdAt && (
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-600">Created:</span>
                              <span className="text-sm text-gray-900">
                                {new Date(material.createdAt).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                          )}

                          {material.updatedAt && (
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm font-medium text-gray-600">Updated:</span>
                              <span className="text-sm text-gray-900">
                                {new Date(material.updatedAt).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Materials Table */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900">Materials Overview</h4>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Materials ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Project ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tools
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {projectMaterials.map((material, index) => (
                            <tr key={material.materialsId || material.id || index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {material.materialsId || material.id || `MAT-${index + 1}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                                {material.projectId || material.project_id || 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                <div className="truncate" title={material.tools || 'No tools specified'}>
                                  {material.tools || 'No tools specified'}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Materials Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-800">Total Records</p>
                          <p className="text-2xl font-bold text-blue-900">{projectMaterials.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <svg className="w-8 h-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-green-800">With Tools</p>
                          <p className="text-2xl font-bold text-green-900">
                            {projectMaterials.filter(m => m.tools && m.tools.trim() !== '').length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center">
                        <svg className="w-8 h-8 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-purple-800">Unique Projects</p>
                          <p className="text-2xl font-bold text-purple-900">
                            {new Set(projectMaterials.map(m => m.projectId || m.project_id).filter(Boolean)).size}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )

      default:
        return <div>Select a section to view details</div>
    }
  }

  const renderProjectDetails = () => {
    console.log('renderProjectDetails called, selectedProject:', selectedProject)
    if (!selectedProject) return null

    return (

      <div className="space-y-6">
        <button
          onClick={() => setSelectedProject(null)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Projects
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Only show image for non-pending projects */}
            {selectedProject.status !== 'Pending' && (
              <img
                src={selectedProject.image || selectedProject.projectImage || 'https://edenchristianacademy.co.nz/wp-content/uploads/2013/11/dummy-image-square.jpg'}
                alt={selectedProject.project_names || selectedProject.name || 'Project'}
                className="w-full lg:w-80 h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://edenchristianacademy.co.nz/wp-content/uploads/2013/11/dummy-image-square.jpg'; // fallback image
                }}
              />
            )}
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedProject.project_names || selectedProject.name || 'Unnamed Project'}
              </h2>

              {/* Show description for pending projects */}
              {selectedProject.description && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Project Description</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">{selectedProject.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Project ID:</span>
                  <p className="text-gray-600">{selectedProject.project_id || selectedProject.code || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <p className="text-gray-600">{selectedProject.location || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Start Date:</span>
                  <p className="text-gray-600">
                    {selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString() :
                      selectedProject.startDate || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">End Date:</span>
                  <p className="text-gray-600">
                    {selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString() :
                      selectedProject.estimatedEndDate || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(selectedProject.status || (activeTab === 'ongoing' ? 'In Progress' : 'Completed'))}`}>
                    {selectedProject.status || (activeTab === 'ongoing' ? 'In Progress' : 'Completed')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px space-x-8">
              {[
                { id: 'design', label: 'Design/Plans' },
                { id: 'wbs', label: 'WBS & Milestones' },
                { id: 'boq', label: 'BOQ Summary' },
                { id: 'financial', label: 'Financial' },
                { id: 'materials', label: 'Materials' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    )
  }

  console.log('Main render - selectedProject:', selectedProject, 'activeSection:', activeSection);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedProject ? (
          <>
            {/* Main Projects Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">All Projects</h2>
                {isLoadingInitiatedProjects && (
                  <div className="flex items-center text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Loading initiated projects...
                  </div>
                )}
              </div>

              {initiatedProjectsError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {initiatedProjectsError}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getAllProjects().map((project, index) => (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.code || project.project_id || project.id || project.projectId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.name || project.projectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {project.start_date || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleUpdateClick(project)}
                            className="bg-amber-400 hover:bg-amber-200 text-black px-3 py-1 rounded text-xs transition duration-200"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Update Form Modal */}
            {showUpdateForm && (
              <div className="fixed inset-0   backdrop-blur-[2px] h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5  w-96 shadow-lg border-2 border-amber-400 rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Update Project & Send to Materials</h3>
                    <p className="text-sm text-gray-600 mb-4">Add location and tools information to proceed with material planning.</p>
                    <form onSubmit={handleUpdateFormSubmit}>
                      <div className="space-y-4">
                        {/* Project ID (readonly) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project ID <span className="text-xs text-gray-500">(Read-only)</span>
                          </label>
                          <input
                            type="text"
                            value={updateFormData.id}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                        </div>

                        {/* Project Name (readonly) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Name <span className="text-xs text-gray-500">(Read-only)</span>
                          </label>
                          <input
                            type="text"
                            value={updateFormData.name}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                        </div>

                        {/* Location (editable) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={updateFormData.location}
                            onChange={handleFormChange}
                            placeholder="Enter project location (required)"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Tools (editable) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tools
                          </label>
                          <textarea
                            name="tools"
                            value={updateFormData.tools}
                            onChange={handleFormChange}
                            placeholder="Enter tools (e.g., Machine A, Machine B, etc.)"
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowUpdateForm(false)}
                          disabled={isUpdating}
                          className={`px-4 py-2 rounded-md transition duration-200 ${isUpdating
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                            }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdating || !updateFormData.location.trim()}
                          className={`px-4 py-2 rounded-md transition duration-200 flex items-center ${isUpdating || !updateFormData.location.trim()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-amber-400 hover:bg-amber-200 text-black'
                            }`}
                        >
                          {isUpdating && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          )}
                          {isUpdating ? 'Updating...' : 'Update & Send to Materials'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('ongoing')}
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${activeTab === 'ongoing'
                    ? 'bg-amber-400 text-white'
                    : 'bg-white text-amber-400 border border-amber-400 hover:bg-blue-50'
                    }`}
                >
                  Ongoing Projects
                </button>
                <button
                  onClick={() => setActiveTab('complete')}
                  className={`px-4 py-2 rounded-md font-medium transition duration-200 ${activeTab === 'complete'
                    ? 'bg-amber-400 text-white'
                    : 'bg-white text-amber-400 border border-amber-400 hover:bg-blue-50'
                    }`}
                >
                  Finished Projects
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeTab === 'ongoing' ? 'Ongoing Projects' : 'Completed Projects'}
                </h2>
                <button
                  onClick={refreshProjectData}
                  disabled={isLoadingProjects}
                  className="flex items-center px-3 py-2 text-sm font-medium text-amber-600 bg-white border border-amber-600 rounded-md hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingProjects ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
              </div>

              {renderProjectList()}
            </div>
          </>
        ) : (
          renderProjectDetails()
        )}
      </div>

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
  )
}

export default Projects