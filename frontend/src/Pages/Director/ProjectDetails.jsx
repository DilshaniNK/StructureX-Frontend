import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, DollarSign, Users, Phone, Building, Tag } from 'lucide-react';
import axios from 'axios';

const ProjectDetails = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const[projectManager,setProjectManager] = useState(null);
    const[seniorQsOfficer,setSeniorQsOfficer] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [project,setProject] = useState(null);
    const[loading,setLoading] = useState(true);
    const { id } = useParams();
    
    const fetchEmployeeById = async (employeeId) => {
        if(!employeeId || employeeId === 'none'){
            return null;
        }
        try{
            const response = await axios.get(`http://localhost:8086/api/v1/admin/${employeeId}`);
            return response.data;
        }catch(err){
            console.log('failed to fetch employee', err);
            return null;
        }
    };

    useEffect(() =>{
        const fetchProject = async () =>{
            
            try{
                const response = await axios.get(`http://localhost:8086/api/v1/director/get_project_by_id/${id}`);
                const projectData = {
                    ...response.data,
                    images: response.data.image_url ? 
                        Array.isArray(response.data.image_url) ?
                        response.data.image_url :
                        [response.data.image_url]
                    : []
                };
                setProject(projectData);
                console.log(projectData);
                if(response.data.pm_id){
                    const pmData = await fetchEmployeeById(response.data.pm_id);
                    setProjectManager(pmData);
                }else{
                    setProjectManager(null)
                }

                if(response.data.qs_id){
                    const qsData = await fetchEmployeeById(response.data.qs_id);
                    setSeniorQsOfficer(qsData);
                }
                else{
                    setSeniorQsOfficer(null);
                }
            }catch(err){
                alert("faild to load project")
            }finally{
                setLoading(false);
            }
        };
        fetchProject()
    },[id]);

    if(loading) return <div className='p-6 text-center'>Loading ...</div>;
    if(!project)return <div className='p-6 text-center text-red-500'>No project found</div>

    const nextImage = () =>{
        setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    };

    const prevImage = () =>{
        setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    };
    
    const openFullscreen = () => {
        setIsFullscreen(true);
    };
    const closeFullscreen = () => {
        setIsFullscreen(false)
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'ongoing': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'completed': return 'bg-green-50 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (!project) {
        return <p className="text-center mt-10 text-red-500 font-semibold">No project data found. Try navigating from the main page.</p>;
    }

    return (
        <div className="min-h-screen bg-white mt-[50px]">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        {/* Status Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 rounded border text-sm font-medium ${getStatusColor(project.status)}`}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                            <span className="px-3 py-1 rounded border bg-gray-50 text-gray-700 border-gray-200 text-sm">
                                Buildings
                            </span>
                            <span className="px-3 py-1 rounded border bg-gray-50 text-gray-700 border-gray-200 text-sm">
                                Commercial
                            </span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-light text-gray-900 mb-6">{project.title}</h1>
                    
                    {/* Key Project Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                        <div>
                            <span className="font-medium text-gray-900">Client:</span>
                            <p className="text-gray-600 mt-1">{project.first_name || 'Asia Leisure / Belluna Co. Ltd.'}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-900">Completion Date:</span>
                            <p className="text-gray-600 mt-1">{project.expectedCompletion || 'July 2018'}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-900">Location:</span>
                            <p className="text-gray-600 mt-1">{project.location || 'Kaluwella, Galle'}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-900">Project Manager:</span>
                            <p className="text-gray-600 mt-1">{project.projectmanager}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    
                    {/* Left Column - Images */}
                    <div className="lg:col-span-2">
                        {/* Main Image */}
                        <div className="relative mb-6">
                            {project.images && project.images.length > 0 ? (
                                <img 
                                    src={project.images[currentImageIndex]}
                                    alt={`Project ${currentImageIndex + 1}`}
                                    className='w-full h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity'
                                    onClick={openFullscreen}
                                    onError={(e) =>{
                                        console.log("Image failed to load :", e);

                                    }}
                                />

                            ):(
                                <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                                    <p className="text-gray-500">No image available</p>
                                </div>
                            )}
                           
                            
                            {/* Navigation Buttons */}
                            {project.images && project.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-full transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 rounded-full transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Image Dots Navigation */}
                        { project.images &&  project.images.length > 1 && (
                            <div className="flex justify-center space-x-2 mb-8">
                                {project.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            index === currentImageIndex 
                                                ? 'bg-gray-800' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Project Details Sidebar */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Budget</h3>
                                <p className="text-gray-600">{project.totalbudget}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Progress</h3>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div 
                                        className="bg-gray-800 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600">{project.progress}% Complete</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="lg:col-span-3">
                        
                        {/* Project Description */}
                        <div className="mb-12">
                            <p className="text-gray-700 leading-relaxed text-base">
                                {project.description}
                            </p>
                            
                            <div className="mt-8 text-gray-700 leading-relaxed">
                                <p className="mb-4">
                                    Completed in 2018, this project's scope of work included construction of the entire 
                                    superstructure. The property is founded on hard rock strata at ground level and 
                                    construction work ensured that the nearby coastal environment was protected throughout. 
                                    Embracing the natural landscape, the building follows a 'without boundaries' concept, 
                                    employing environmentally conscious design and construction techniques.
                                </p>
                                
                                <p>
                                    The project is now a choice destination positioned as an urban 
                                    resort and lifestyle destination that welcomes a variety of travelers.
                                </p>
                            </div>
                        </div>

                        {/* Project Team */}
                        <div className="mb-12">
                            <h2 className="text-xl font-light text-gray-900 mb-6">Project Team</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border-l-4 border-gray-200 pl-4">
                                    <h4 className="font-medium text-gray-900">Project Manager</h4>
                                    <p className="text-gray-600 mt-1">{projectManager?.name || 'Not Assigned'}</p>
                                </div>
                                {/* <div className="border-l-4 border-gray-200 pl-4">
                                    <h4 className="font-medium text-gray-900">Site Supervisor</h4>
                                    <p className="text-gray-600 mt-1">{seniorQsOfficer?.name || 'Not assigend'}</p>
                                </div> */}
                                <div className="border-l-4 border-gray-200 pl-4">
                                    <h4 className="font-medium text-gray-900">QS Officer</h4>
                                    <p className="text-gray-600 mt-1">{seniorQsOfficer?.name || 'Not Assigned'}</p>
                                </div>
                                <div className="border-l-4 border-gray-200 pl-4"> 
                                    <h4 className="font-medium text-gray-900">Designer</h4>
                                    <p className="text-gray-600 mt-1">{project.designer}</p>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>  
                        {/* Engineers Table */}
            <div className="mb-12 ml-[40px]">
                    <h2 className="text-xl font-light text-gray-900 mb-6 ">Engineers</h2>
                    <hr></hr>
                    <div className="border-none">
                        <table className="min-w-full ">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                         Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                        Company
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                        Contact
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {(project.engineers || []).map((engineer, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{engineer.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-700">{engineer.company}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-700">{engineer.contact}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>

                        {/* Materials & Suppliers Table */}
            <div className="mb-12 ml-[40px]">
                <h2 className="text-xl font-light text-gray-900 mb-6">Materials & Suppliers</h2>
                <hr></hr>
                <div className="border-none">
                    <table className="min-w-full">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                    Material
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                    Supplier
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                    Contact
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {(project.suppliers || []).map((supplier, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{supplier.material}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-700">{supplier.company}</div>
                                    </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-700">{supplier.contact}</div>
                                        </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>
            </div>

                        
                    
                
            

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={project.images && project.images.length > 0 ? project.images[currentImageIndex] : 'not images available'}
                            alt={`Project ${currentImageIndex + 1}`}
                            className="max-w-full max-h-screen object-contain"
                        />
                        
                        {/* Close Button */}
                        <button
                            onClick={closeFullscreen}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        >
                            <X size={32} />
                        </button>
                        
                        {/* Navigation in Fullscreen */}
                        {project.image && project.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                                >
                                    <ChevronLeft size={48} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                                >
                                    <ChevronRight size={48} />
                                </button>
                            </>
                        )}
                        
                        {/* Image Counter in Fullscreen */}
                        {project.images && (

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded">
                            {currentImageIndex + 1} / {project.images.length}
                        </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;