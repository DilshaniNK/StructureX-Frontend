import React from 'react';
import ProjDetails from '../../Components/Employee/ProjDetails';

const ProjectDetails = () => {
  const sampleProject = {
    title: 'New Construction Site A',
    location: 'Colombo, Sri Lanka',
    startDate: '2025-01-15',
    endDate: '2025-12-30',
    status: 'Ongoing',
    description: 'Construction of a 10-story commercial building.',
    image: '', // fallback to default image
    ownerName: 'Mr. Kamal Perera',
    estimatedValue: 'Rs 120,000,000',
    remainingTime: '6 months',

    owner: {
      fullName: 'Kamal Perera',
      nic: '762345789V',
      address: 'No 12, Main Street, Colombo',
      phone: '0771234567',
      email: 'kamal@example.com'
    },

    financials: {
      baseAmount: 'Rs 100,000,000',
      estimated: 'Rs 120,000,000',
      spent: 'Rs 70,000,000',
      remaining: 'Rs 50,000,000'
    },
    labors: [
    {
      date: '2025-06-10',
      roles: {
        mason: 40,
        plumbers: 29,
        helpers: 50
      }
    },
    {
      date: '2025-06-11',
      roles: {
        mason: 38,
        plumbers: 30,
        helpers: 47
      }
    }
  ]
  };

  return (
    <div>
      <ProjDetails project={sampleProject} userRole="financialOfficer" />
    </div>
  );
};

export default ProjectDetails;
