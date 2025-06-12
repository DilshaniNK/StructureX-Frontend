import React, { useState } from 'react';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import PaymentPlanCreator from '../Financial_officer/PaymentPlan';
import PersonIcon from '@mui/icons-material/Person';
import PaymentsIcon from '@mui/icons-material/Payments';
import SummarizeIcon from '@mui/icons-material/Summarize';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';
import GroupsIcon from '@mui/icons-material/Groups';
import project5 from '../../assets/project5.jpg';

function Section({ title, icon, open, setOpen, children }) {
  return (
    <div className='my-4 border rounded-lg p-4 bg-gray-50 shadow-sm'>
      <div
        className='flex justify-between items-center cursor-pointer'
        onClick={() => setOpen(!open)}
      >
        <div className='flex items-center space-x-2 text-lg font-semibold'>
          {icon}
          <span>{title}</span>
        </div>
        <ArrowDropDownCircleIcon className={`${open ? 'rotate-180' : ''} transition-transform`} />
      </div>
      {open && <div className='mt-4 space-y-2'>{children}</div>}
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
    <div className='p-8 bg-gray-100 min-h-screen'>
      <h1 className="text-3xl font-bold text-black mb-6">{project.title}</h1>
      <p className='mb-4 text-gray-700'>{project.description}</p>

      <div className='flex flex-col lg:flex-row gap-8 mb-10'>
        <img
          src={project.image || project5}
          alt="Project"
          className='w-full lg:w-1/2 h-64 object-cover rounded-lg shadow-md'
        />
        {/*for both */}

        <div className='p-6 shadow-lg rounded-2xl bg-white text-gray-700 flex-1'>
          <p><strong>Owner name:</strong> {project.ownerName}</p>
          <p><strong>Location:</strong> {project.location}</p>
          <p><strong>Estimated value:</strong> {project.estimatedValue}</p>
          <p><strong>Start-date:</strong> {project.startDate}</p>
          <p><strong>Estimated end-date:</strong> {project.endDate}</p>
          <p><strong>Remaining time:</strong> {project.remainingTime}</p>
        </div>
      </div>

      <Section title="Owner Details" icon={<PersonIcon />} open={ownerDropdownOpen} setOpen={setOwnerDropdownOpen}>
        <p><strong>Full name:</strong> {project.owner?.fullName || 'N/A'}</p>
        <p><strong>NIC:</strong> {project.owner?.nic || 'N/A'}</p>
        <p><strong>Address:</strong> {project.owner?.address || 'N/A'}</p>
        <p><strong>Contact no.:</strong> {project.owner?.phone || 'N/A'}</p>
        <p><strong>Email:</strong> {project.owner?.email || 'N/A'}</p>
      </Section>

      <Section title="Financial Summary" icon={<SummarizeIcon />} open={financeDropdownOpen} setOpen={setFinanceDropdownOpen}>
        <p><strong>Base Amount:</strong> {project.financials?.baseAmount || 'N/A'}</p>
        <p><strong>Estimated Value:</strong> {project.financials?.estimated || 'N/A'}</p>
        <p><strong>Amount Spent:</strong> {project.financials?.spent || 'N/A'}</p>
        <p><strong>Remaining Amount:</strong> {project.financials?.remaining || 'N/A'}</p>
      </Section>


{/* only for financial manager */}
      {isFinancialOfficer && (
        <>

          <Section title="Payment Plan" icon={<PaymentsIcon />} open={paymentPlanDropdownOpen} setOpen={setPaymentPlanDropdownOpen}>
            <PaymentPlanCreator />
          </Section>

          <Section title="Payment History" icon={<HistoryIcon />} open={payHistoryDropdownOpen} setOpen={setPayHistoryDropdownOpen}>
            <p>Payment records will go here.</p>
          </Section>

          <Section title="Cost Breakdown" icon={<PaymentIcon />} open={costDropdownOpen} setOpen={setCostDropdownOpen}>
            <p>Cost items and totals will be displayed here.</p>
          </Section>

          <Section title="Charts" icon={<PaymentsIcon />} open={chartsDropdownOpen} setOpen={setChartsDropdownOpen}>
            <p>Charts go here</p>
          </Section>
        </>
      )}

      <Section title="Labors" icon={<GroupsIcon />} open={laborsDropdownOpen} setOpen={setLaborsDropdownOpen}>
        <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Masons</th>
            <th className="px-4 py-2 border">Plumbers</th>
            <th className="px-4 py-2 border">Helpers</th>
          </tr>
        </thead>
        <tbody>
          {project.labors?.map((entry, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{entry.date}</td>
              <td className="px-4 py-2 border">{entry.roles.mason || 0}</td>
              <td className="px-4 py-2 border">{entry.roles.plumbers || 0}</td>
              <td className="px-4 py-2 border">{entry.roles.helpers || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </Section>

      {isSiteSupervisor && (
        <Section title="Plan" icon={<PaymentsIcon />} open={planDropdownOpen} setOpen={setPlanDropdownOpen}>
          <p>Project plan goes here.</p>
        </Section>
      )}
    </div>
  );
}
