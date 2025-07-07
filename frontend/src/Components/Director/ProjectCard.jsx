// pages/Director/components/ProjectCard.jsx
import React, { useState } from 'react';
import { Eye, UserPlus } from 'lucide-react';
import ChangeTeam from './ChangeTeam';



import ErrorAlert from '../Employee/ErrorAlert';



const getStatusColor = (status) => {
  switch (status) {
    case 'ongoing': return 'bg-green-500';
    case 'hold': return 'bg-red-500';
    case 'finished': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'ongoing': return <span className="mr-1">▶</span>;
    case 'hold': return <span className="mr-1">⏸</span>;
    case 'finished': return <span className="mr-1">✔</span>;
    default: return <span className="mr-1">⏳</span>;
  }
};

const ProjectCard = ({ project, onViewDetails, onTeamUpdate }) => {
  const [showTeamModel, setshowTeamModel] = useState(false);
  const[showAlert, setShowAlert] =useState(false);

  
  // const handleSend = (project)=>{
  //   console.log("Sending to QS officer", project)
  // };

  return (
    
    <>
  {showAlert && (
    <ErrorAlert
      show={showAlert}
      onClose={()=>setShowAlert(false)}
      title="Action Denied"
      message="You can't take actions on a finished project."
    />
  )}
    <div className="bg-white rounded-xl border border-gray-200 p-6 transition-transform duration-300 hover:-translate-y-1 hover:scale-105 shadow-sm hover:shadow-lg cursor-pointer"
      key={project.id}
      onClick={()=>{
        if(project.status === 'finished'){
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          return;
        }
        onViewDetails();
      }}
    >

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
          {getStatusIcon(project.status)}
          <span className="ml-1 capitalize">{project.status}</span>
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#FAAD00] h-2 rounded-full transition-all duration-300" style={{ width: `${project.progress}%` }}></div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex justify-between"><span>Manager:</span><span className="font-medium">{project.manager}</span></div>
        <div className="flex justify-between"><span>Supervisor:</span><span className="font-medium">{project.supervisor}</span></div>
        <div className="flex justify-between"><span>Budget:</span><span className="font-medium">{project.budget}</span></div>
        <div className="flex justify-between"><span>Location:</span><span className="font-medium">{project.location}</span></div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          
          onClick={(e)=>{
            e.stopPropagation();
            onViewDetails();
          }}
          className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
        <button 
        onClick={(e)=>{

          e.stopPropagation();
          setshowTeamModel(true)
        }}
        className="bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
          <UserPlus className="w-4 h-4" />
        </button>
      </div>
     
    </div>
     {showTeamModel && (
      <ChangeTeam project={project} onClose={()=> setshowTeamModel(false)} onUpdateTeam={onTeamUpdate}/>
    )}
    
    </>
    
  
  );
};

export default ProjectCard;

