import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/QS/Layout';
import CalendarCard from '../../Components/Financial_officer/CalenderCard';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

function Dashboard() {
  const navigate = useNavigate();

  // Navigation handlers for quick links
  const handleQuickLinkNavigation = (page) => {
    switch(page) {
      case 'projects':
        navigate('/qs/projects');
        break;
      case 'boqs':
        navigate('/qs/boq');
        break;
      case 'material-requests':
        navigate('/qs/requests');
        break;
      case 'purchasing':
        navigate('/qs/purchasing');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {/* Quick Links Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => handleQuickLinkNavigation('projects')}
                className="bg-yellow-50 p-12 rounded-lg shadow-lg border-l-4 border-amber-500 flex flex-col items-center justify-center hover:bg-yellow-100 cursor-pointer transition-all hover:shadow-2xl min-h-[250px]"
              >
                <HomeWorkIcon className="text-amber-500 text-7xl mb-4" />
                <span className="text-gray-700 font-semibold text-xl">Projects</span>
              </div>
              
              <div 
                onClick={() => handleQuickLinkNavigation('boqs')}
                className="bg-yellow-50 p-12 rounded-lg shadow-lg border-l-4 border-amber-500 flex flex-col items-center justify-center hover:bg-yellow-100 cursor-pointer transition-all hover:shadow-2xl min-h-[250px]"
              >
                <DescriptionIcon className="text-amber-500 text-7xl mb-4" />
                <span className="text-gray-700 font-semibold text-xl">BOQs</span>
              </div>
              
              <div 
                onClick={() => handleQuickLinkNavigation('material-requests')}
                className="bg-yellow-50 p-12 rounded-lg shadow-lg border-l-4 border-amber-500 flex flex-col items-center justify-center hover:bg-yellow-100 cursor-pointer transition-all hover:shadow-2xl min-h-[250px]"
              >
                <ShoppingCartIcon className="text-amber-500 text-7xl mb-4" />
                <span className="text-gray-700 font-semibold text-xl">Material Requests</span>
              </div>
              
              <div 
                onClick={() => handleQuickLinkNavigation('purchasing')}
                className="bg-yellow-50 p-12 rounded-lg shadow-lg border-l-4 border-amber-500 flex flex-col items-center justify-center hover:bg-yellow-100 cursor-pointer transition-all hover:shadow-2xl min-h-[250px]"
              >
                <ShoppingBagIcon className="text-amber-500 text-7xl mb-4" />
                <span className="text-gray-700 font-semibold text-xl">Purchasing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Calendar Section */}
        <div className="lg:w-1/4 w-full">
          <CalendarCard />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
