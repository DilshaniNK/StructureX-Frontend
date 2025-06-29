import React, { useState } from 'react';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import PaymentPlanCreator from '../Financial_officer/PaymentPlan';
import PersonIcon from '@mui/icons-material/Person';
import PaymentsIcon from '@mui/icons-material/Payments';
import SummarizeIcon from '@mui/icons-material/Summarize';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import project5 from '../../assets/project5.jpg';

function Section({ title, icon, open, setOpen, children, badge = null }) {
  return (
    <div className='mb-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200'>
      <div
        className='flex justify-between items-center cursor-pointer p-6 hover:bg-gray-50 rounded-t-xl transition-colors duration-200'
        onClick={() => setOpen(!open)}
      >
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-blue-50 rounded-lg text-blue-600'>
            {icon}
          </div>
          <div className='flex items-center space-x-2'>
            <span className='text-lg font-semibold text-gray-800'>{title}</span>
            {badge && (
              <span className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
                {badge}
              </span>
            )}
          </div>
        </div>
        <ArrowDropDownCircleIcon 
          className={`${open ? 'rotate-180' : ''} transition-transform duration-300 text-gray-400 hover:text-gray-600`} 
        />
      </div>
      {open && (
        <div className='px-6 pb-6 border-t border-gray-100'>
          <div className='mt-4'>{children}</div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200'>
      <div className='flex items-center space-x-3'>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className='text-sm font-medium text-gray-500'>{label}</p>
          <p className='text-lg font-semibold text-gray-900'>{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProjDetails({ project, userRole }) {
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const [financeDropdownOpen, setFinanceDropdownOpen] = useState(false);
  const [paymentPlanDropdownOpen, setPaymentPlanDropdownOpen] = useState(false);
  const [chartsDropdownOpen, setChartsDropdownOpen] = useState(false);
  const [costDropdownOpen, setCostDropdownOpen] = useState(false);
  const [payHistoryDropdownOpen, setPayHistoryDropdownOpen] = useState(false);
  const [laborsDropdownOpen, setLaborsDropdownOpen] = useState(false);
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);

  const isFinancialOfficer = userRole === 'financialOfficer';
  const isSiteSupervisor = userRole === 'siteSupervisor';

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header Section */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <p className='text-lg text-gray-600 max-w-3xl leading-relaxed'>{project.description}</p>
            </div>
            <div className='px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium'>
              Active Project
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Project Overview Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <InfoCard
            icon={<BusinessIcon />}
            label="Owner"
            value={project.ownerName}
            color="blue"
          />
          <InfoCard
            icon={<LocationOnIcon />}
            label="Location"
            value={project.location}
            color="green"
          />
          <InfoCard
            icon={<AttachMoneyIcon />}
            label="Estimated Value"
            value={project.estimatedValue}
            color="orange"
          />
          <InfoCard
            icon={<CalendarTodayIcon />}
            label="Remaining Time"
            value={project.remainingTime}
            color="purple"
          />
        </div>

        {/* Project Image and Key Details */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
          <div className='lg:col-span-2'>
            <img
              src={project.image || project5}
              alt="Project"
              className='w-full h-80 object-cover rounded-xl shadow-lg'
            />
          </div>
          
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
            <h3 className='text-xl font-semibold text-gray-900 mb-4'>Project Timeline</h3>
            <div className='space-y-4'>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-gray-600'>Start Date</span>
                <span className='font-semibold'>{project.startDate}</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-gray-600'>End Date</span>
                <span className='font-semibold'>{project.endDate}</span>
              </div>
              <div className='flex justify-between items-center py-2'>
                <span className='text-gray-600'>Status</span>
                <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className='space-y-4'>
          <Section 
            title="Owner Details" 
            icon={<PersonIcon />} 
            open={ownerDropdownOpen} 
            setOpen={setOwnerDropdownOpen}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <div className='flex justify-between py-2 border-b border-gray-100'>
                  <span className='text-gray-600 font-medium'>Full Name</span>
                  <span className='text-gray-900'>{project.owner?.fullName || 'N/A'}</span>
                </div>
                <div className='flex justify-between py-2 border-b border-gray-100'>
                  <span className='text-gray-600 font-medium'>NIC</span>
                  <span className='text-gray-900'>{project.owner?.nic || 'N/A'}</span>
                </div>
                <div className='flex justify-between py-2 border-b border-gray-100'>
                  <span className='text-gray-600 font-medium'>Contact</span>
                  <span className='text-gray-900'>{project.owner?.phone || 'N/A'}</span>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between py-2 border-b border-gray-100'>
                  <span className='text-gray-600 font-medium'>Email</span>
                  <span className='text-gray-900'>{project.owner?.email || 'N/A'}</span>
                </div>
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600 font-medium'>Address</span>
                  <span className='text-gray-900 text-right'>{project.owner?.address || 'N/A'}</span>
                </div>
              </div>
            </div>
          </Section>

          <Section 
            title="Financial Summary" 
            icon={<SummarizeIcon />} 
            open={financeDropdownOpen} 
            setOpen={setFinanceDropdownOpen}
            badge="Overview"
          >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                <div className='text-sm text-blue-600 font-medium mb-1'>Base Amount</div>
                <div className='text-2xl font-bold text-blue-900'>
                  {project.financials?.baseAmount || 'N/A'}
                </div>
              </div>
              <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
                <div className='text-sm text-green-600 font-medium mb-1'>Estimated Value</div>
                <div className='text-2xl font-bold text-green-900'>
                  {project.financials?.estimated || 'N/A'}
                </div>
              </div>
              <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
                <div className='text-sm text-red-600 font-medium mb-1'>Amount Spent</div>
                <div className='text-2xl font-bold text-red-900'>
                  {project.financials?.spent || 'N/A'}
                </div>
              </div>
              <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
                <div className='text-sm text-purple-600 font-medium mb-1'>Remaining</div>
                <div className='text-2xl font-bold text-purple-900'>
                  {project.financials?.remaining || 'N/A'}
                </div>
              </div>
            </div>
          </Section>

          {/* Financial Officer Sections */}
          {isFinancialOfficer && (
            <>
              <Section 
                title="Payment Plan" 
                icon={<PaymentsIcon />} 
                open={paymentPlanDropdownOpen} 
                setOpen={setPaymentPlanDropdownOpen}
                badge="Manage"
              >
                <div className='bg-gray-50 p-6 rounded-lg'>
                  <PaymentPlanCreator />
                </div>
              </Section>

              <Section 
                title="Payment History" 
                icon={<HistoryIcon />} 
                open={payHistoryDropdownOpen} 
                setOpen={setPayHistoryDropdownOpen}
                badge="Records"
              >
                <div className='bg-gray-50 p-6 rounded-lg text-center'>
                  <HistoryIcon className='text-gray-400 text-4xl mb-2' />
                  <p className='text-gray-600'>Payment records will be displayed here.</p>
                  <button className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                    View All Records
                  </button>
                </div>
              </Section>

              <Section 
                title="Cost Breakdown" 
                icon={<PaymentIcon />} 
                open={costDropdownOpen} 
                setOpen={setCostDropdownOpen}
                badge="Analysis"
              >
                <div className='bg-gray-50 p-6 rounded-lg text-center'>
                  <PaymentIcon className='text-gray-400 text-4xl mb-2' />
                  <p className='text-gray-600'>Detailed cost breakdown and analysis.</p>
                  <button className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                    Generate Report
                  </button>
                </div>
              </Section>

              <Section 
                title="Analytics & Charts" 
                icon={<TrendingUpIcon />} 
                open={chartsDropdownOpen} 
                setOpen={setChartsDropdownOpen}
                badge="Insights"
              >
                <div className='bg-gray-50 p-6 rounded-lg text-center'>
                  <TrendingUpIcon className='text-gray-400 text-4xl mb-2' />
                  <p className='text-gray-600'>Financial charts and analytics dashboard.</p>
                  <button className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                    View Dashboard
                  </button>
                </div>
              </Section>
            </>
          )}

          <Section 
            title="Labor Management" 
            icon={<GroupsIcon />} 
            open={laborsDropdownOpen} 
            setOpen={setLaborsDropdownOpen}
            badge={`${project.labors?.length || 0} entries`}
          >
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Masons</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Plumbers</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Helpers</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {project.labors?.map((entry, index) => {
                      const total = (entry.roles.mason || 0) + (entry.roles.plumbers || 0) + (entry.roles.helpers || 0);
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.date}</td>
                          <td className="px-6 py-4 text-sm text-center text-gray-700">
                            <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full'>
                              {entry.roles.mason || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-gray-700">
                            <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full'>
                              {entry.roles.plumbers || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-gray-700">
                            <span className='px-2 py-1 bg-orange-100 text-orange-800 rounded-full'>
                              {entry.roles.helpers || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-center font-semibold text-gray-900">
                            {total}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {(!project.labors || project.labors.length === 0) && (
                <div className='text-center py-8 text-gray-500'>
                  <GroupsIcon className='text-4xl mb-2' />
                  <p>No labor records available</p>
                </div>
              )}
            </div>
          </Section>

          {isSiteSupervisor && (
            <Section 
              title="Project Plan" 
              icon={<BusinessIcon />} 
              open={planDropdownOpen} 
              setOpen={setPlanDropdownOpen}
              badge="Supervisor"
            >
              <div className='bg-gray-50 p-6 rounded-lg text-center'>
                <BusinessIcon className='text-gray-400 text-4xl mb-2' />
                <p className='text-gray-600'>Project plans and blueprints will be displayed here.</p>
                <button className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                  View Plans
                </button>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}