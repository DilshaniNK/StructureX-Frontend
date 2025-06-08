import React from 'react'
import { useState } from 'react';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { FaArrowAltCircleDown } from 'react-icons/fa';
import Layout from '../../Components/Financial_officer/Layout';
import PaymentPlanCreator from '../../Components/Financial_officer/PaymentPlan';
import PersonIcon from '@mui/icons-material/Person';
import PaymentsIcon from '@mui/icons-material/Payments';
import SummarizeIcon from '@mui/icons-material/Summarize';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';
import GroupsIcon from '@mui/icons-material/Groups';
import project5 from '../../assets/project5.jpg';


const ProjectDetails = () => {
    
      const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
      const [financeDropdownOpen, setFinanceDropdownOpen] = useState(false);
      const [paymentPlanDropdownOpen, setPaymentPlanDropdownOpen] = useState(false);
      const [chartsDropdownOpen, setChartsDropdownOpen] = useState(false);
      const [costDropdownOpen, setCostDropdownOpen] = useState(false);
      const [payHistoryDropdownOpen, setPayHistoryDropdownOpen] = useState(false);
      const [laborsDropdownOpen, setLaborsDropdownOpen] = useState(false);
    
      
  return (
    <Layout>
    <div className='p-8'>
        <h1 className="text-3xl font-bold text-amber-500 mb-6" >Housing Complex - "Green Meadows Residency"</h1>
        <div className='flex-1 min-w-[200px]    mb-8'>
            <div className='flex flex-col lg:flex-row gap-12'>
              
              <div className='flex flex-col gap-4 text-gray-700 flex-1 '>
                    <img src={project5} alt="Project" className='w-full h-64 object-cover rounded-lg shadow-md' />
                    <p>A premium gated community consisting of 250 modern apartments with eco-friendly infrastructure, solar power integration, 
                      and rainwater harvesting. Located in the suburbs with close access to schools and transport hubs </p>
                </div>
               <div className='flex flex-col gap-4 text-gray-700 p-6 shadow-lg rounded-2xl flex-1 bg-white'>
                    <label>Project name :</label><span></span>
                    <label>Owner name :</label><span></span>
                    <label>Location :</label><span></span>
                    <label>Estimated value :</label><span></span>
                    <label>Start-date :</label><span></span>
                    <label>Estimated end-date :</label><span></span>
                    <label>Remaining time :</label><span></span>
                </div>
                
            </div>
        </div>

        <div className='flex-1 min-w-[200px] bg-white p-3 rounded-2xl shadow-md mb-8 ' >
          <div className='flex justify-between items-center mb-2'>
              <div className='flex items-center gap-2 '><PersonIcon/>
                  <h1 className="text-lg font-semibold text-black">Owner details</h1>
              </div>
              <button
                  className="text-black"
                  onClick={() => setOwnerDropdownOpen(prev => !prev)}
                  title="Toggle Dropdown"
              >
              {ownerDropdownOpen ? <ArrowDropDownCircleIcon /> : <ArrowDropDownCircleIcon />}
              </button>
            </div>

            {ownerDropdownOpen && (
            <div className='flex flex-col gap-4 text-black flex-1 bg-white p-3 rounded-2xl'>
                <label>Full name:</label>
                <label>NIC:</label>
                <label>Address:</label>
                <label>Contact no.:</label>
                <label>Email:</label>
            </div>
            )}
        </div>

      {/* Financial Summary Card */}
      <div className='flex-1 min-w-[200px] bg-white p-3 rounded-2xl shadow-md mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2 '><SummarizeIcon/>
              <h1 className="text-lg font-semibold text-black">Financial Summary</h1>
          </div>
          
          <button
            className="text-black"
            onClick={() => setFinanceDropdownOpen(prev => !prev)}
            title="Toggle Dropdown"
          >
            {financeDropdownOpen ? <ArrowDropDownCircleIcon /> : <ArrowDropDownCircleIcon />}
          </button>
        </div>

        {financeDropdownOpen && (
          <div className='flex flex-col gap-4 text-black flex-1 bg-white p-3 rounded-2xl'>
            <label>Estimated value:</label>
            <label>Base Amount:</label>
            <label>Estimated Value:</label>
            <label>Amount Spent:</label>
            <label>Remaining Amount:</label>
          </div>
        )}
      </div>

      {/* Payment plan*/}
      <div className='flex-1 min-w-[200px] bg-white p-3 rounded-2xl shadow-md mb-8'>
        <div className='flex justify-between items-center mb-4'>
        
          <div className='flex items-center gap-2 '><PaymentsIcon/>
              <h1 className="text-lg font-semibold text-black">Payment plan</h1>
          </div>
          <button
            className="text-black"
            onClick={() => setPaymentPlanDropdownOpen(prev => !prev)}
            title="Toggle Dropdown"
          >
            {paymentPlanDropdownOpen ? <ArrowDropDownCircleIcon /> : <ArrowDropDownCircleIcon />}
          </button>
        </div>

        {paymentPlanDropdownOpen && (
          <div>
            <PaymentPlanCreator/>
          </div>
        )}
      </div>

      <div className='flex-1 min-w-[200px] bg-white p-3 rounded-2xl shadow-md mb-8'>
        <div className='flex justify-between items-center mb-4'>
          
          <div className='flex items-center gap-2 '><HistoryIcon/>
              <h1 className="text-lg font-semibold text-black">Payment History</h1>
          </div>
          <button
            className="text-black"
            onClick={() => setPayHistoryDropdownOpen(prev => !prev)}
            title="Toggle Dropdown"
          >
            {payHistoryDropdownOpen ? <ArrowDropDownCircleIcon /> : <ArrowDropDownCircleIcon />}
          </button>
        </div>

        {payHistoryDropdownOpen && (
          <div>
            {/* Placeholder for cost breakdown */}
          </div>
        )}
      </div>

      <div className='flex-1 min-w-[200px] bg-white p-3 rounded-2xl shadow-md mb-8'>
        <div className='flex justify-between items-center mb-4'>
          
          <div className='flex items-center gap-2 '><PaymentIcon/>
              <h1 className="text-lg font-semibold text-black">Cost breakdown</h1>
          </div>
          <button
            className="text-black"
            onClick={() => setCostDropdownOpen(prev => !prev)}
            title="Toggle Dropdown"
          >
            {costDropdownOpen ? <ArrowDropDownCircleIcon /> : <ArrowDropDownCircleIcon />}
          </button>
        </div>

        {costDropdownOpen && (
          <div>
            {/* Placeholder for cost breakdown */}
          </div>
        )}
      </div>

      <div className='flex-1 min-w-[200px] bg-white p-3 rounded-2xl shadow-md mb-8'>
        <div className='flex justify-between items-center mb-4'>
          
          <div className='flex items-center gap-2 '><GroupsIcon/>
              <h1 className="text-lg font-semibold text-black">Labors</h1>
          </div>
          <button
            className="text-black"
            onClick={() => setLaborsDropdownOpen(prev => !prev)}
            title="Toggle Dropdown"
          >
            {laborsDropdownOpen ? <ArrowDropDownCircleIcon /> : <ArrowDropDownCircleIcon />}
          </button>
        </div>

        {laborsDropdownOpen && (
          <div>
            {/* Placeholder for labors */}
          </div>
        )}
      </div>

      <div className='flex-1 min-w-[200px] bg-white p-3 rounded-2xl shadow-md mb-8'>
        <div className='flex justify-between items-center mb-4'>
       
          <div className='flex items-center gap-2 '><PaymentsIcon/>
              <h1 className="text-lg font-semibold text-black">Charts</h1>
          </div>
          <button
            className="text-black"
            onClick={() => setChartsDropdownOpen(prev => !prev)}
            title="Toggle Dropdown"
          >
            {chartsDropdownOpen ? <ArrowDropDownCircleIcon /> : <ArrowDropDownCircleIcon />}
          </button>
        </div>

        {chartsDropdownOpen && (
          <div>
            {/* Placeholder for charts */}
          </div>
        )}
      </div>
    </div>
    </Layout>
  )
}

export default ProjectDetails
