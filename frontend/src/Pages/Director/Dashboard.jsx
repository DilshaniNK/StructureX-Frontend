// pages/Director/Overview.jsx
import React, { useEffect, useState } from 'react';
import OverviewStats from '../../Components/Director/OverviewStats';
import RecentProjects from '../../Components/Director/RecentProjects';
import UpcomingSiteVisits from '../../Components/Director/UpcomingSiteVisits';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects,setProjects] = useState([]);
  const[loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () =>{
      try{
        const res = await fetch('http://localhost:8086/api/v1/director/get_all_projects');
        const data = await res.json();
        setProjects(data);
      }catch(err){
        alert("failed ti load projects")
      }finally{
        setLoading(false);
      }
    };
    fetchProject();
  }, []);
  const siteVisits = [
    { id: 1, project: "Green Heights Apartments", date: "2024-06-11", inspector: "Sarah Davis", status: "scheduled" },
  ];
  const navigate = useNavigate();
  if(loading) return <div>Loading ...</div>
  return (
  

    
    
    
 


    
    <div className=" space-y-6">
      <OverviewStats projects={projects} />
        <button className="bg-[#FAAD00] hover:bg-black text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
        onClick={() => navigate('/directorcont/clientdetails', {state: {showForm: true}})}
        >
        Register Client
        </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects projects={projects} />
        <UpcomingSiteVisits siteVisits={siteVisits} />
      </div>
     
    </div>
   
   
    
    
  );
    

    
};

export default Dashboard;
