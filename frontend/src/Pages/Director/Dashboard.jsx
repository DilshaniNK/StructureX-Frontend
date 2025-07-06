// pages/Director/Overview.jsx
import React from 'react';
import OverviewStats from '../../Components/Director/OverviewStats';
import RecentProjects from '../../Components/Director/RecentProjects';
import UpcomingSiteVisits from '../../Components/Director/UpcomingSiteVisits';

const Dashboard = () => {
  const projects = [
    {
      id: 1, name: "Sunset Villa Complex", status: "ongoing", progress: 75, manager: "John Smith", location: "Downtown"
    },
    {
      id: 2, name: "Green Heights Apartments", status: "ongoing", progress: 45, manager: "Sarah Davis", location: "North Side"
    },
    {
      id: 3, name: "Commercial Plaza", status: "hold", progress: 30, manager: "Robert Brown", location: "Business District"
    },
    {
      id: 4, name: "Riverside Homes", status: "finished", progress: 100, manager: "Emily Chen", location: "Riverside"
    }
  ];

  const siteVisits = [
    { id: 1, project: "Green Heights Apartments", date: "2024-06-11", inspector: "Sarah Davis", status: "scheduled" },
  ];

  return (
  

    
    
    
 


    
    <div className=" space-y-6">
      <OverviewStats projects={projects} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects projects={projects} />
        <UpcomingSiteVisits siteVisits={siteVisits} />
      </div>
    </div>
   
   
    
    
  );
    

    
};

export default Dashboard;
