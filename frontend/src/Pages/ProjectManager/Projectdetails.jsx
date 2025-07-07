import React from 'react'
import ProjectDetails from '../../Components/Employee/ProjDetails'

const mockProject = {
  title: "Residential Towers",
  description: "A high-rise residential project in the city center.",
  image: null,
  ownerName: "John Doe",
  location: "Colombo",
  estimatedValue: "$1,200,000",
  startDate: "2025-01-01",
  endDate: "2025-06-30",
  remainingTime: "3 months",
  owner: {
    fullName: "John Doe",
    nic: "123456789V",
    address: "123 Main St, Colombo",
    phone: "0771234567",
    email: "john@example.com"
  },
  financials: {
    baseAmount: "$1,000,000",
    estimated: "$1,200,000",
    spent: "$600,000",
    remaining: "$600,000"
  },
  labors: [
    { date: "2025-06-01", roles: { mason: 5, plumbers: 2, helpers: 3 } },
    { date: "2025-06-02", roles: { mason: 4, plumbers: 1, helpers: 2 } }
  ]
};

const Projectdetails = () => {
    return (
        <>
         <ProjectDetails project={mockProject} userRole="ProjectManager" />
        </>
    )
}

export default Projectdetails