import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // or your routing lib
import axios from 'axios';
import ProjDetails from '../../Components/Employee/ProjDetails';

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get query params
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();
  const projectId = query.get('id');  // extract 'id' from URL

  useEffect(() => {
    if (!projectId) {
      setError('No project ID provided in URL');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8086/api/v1/financial_officer/project/${projectId}`)
      .then(response => {
        setProject(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching project:", err);
        setError('Failed to fetch project');
        setLoading(false);
      });
  }, [projectId]);

  if (loading) return <div>Loading project details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>No project found.</div>;

  return (
    <div>
      <ProjDetails project={project} userRole="financialOfficer" />
    </div>
  );
};

export default ProjectDetails;
