import React, { useState, useEffect } from 'react';
import { Plus, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Project11 from '../../assets/Projects/P1.jpg';
import Project12 from '../../assets/Projects/P1_1.jpg';
import Project13 from '../../assets/Projects/P1_2.jpg';

const Project = () => {
  const [activeCategory, setActiveCategory] = useState('ongoing');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Building a modern e-commerce solution with advanced features",
      progress: 65,
      status: "ongoing",
      images: [Project11, Project12, Project13],
      totalbudget: "Rs. 250,000,000",
      sitesupervisor: "Ethan Carte",
      projectmanager: "Shopia Clark",
      qsofficer: "Jemis Piris",
      designer: "Smith Josan",
      engineers: [
      { name: "Eng. Nimal Perera", company: "SoftWorks Pvt Ltd", contact: "+94 77 112 3344" },
      { name: "Eng. Tharushi Silva", company: "IT Lanka Solutions", contact: "+94 71 998 7766" }
      ],
      suppliers: [
      { material: "Server Hardware", company: "TechGlobal Ltd", contact: "+94 77 123 4567" },
      { material: "Cloud Hosting", company: "CloudNet Pvt", contact: "+94 71 987 6543" }
      ]
    },
    {
      id: 2,
      title: "Mobile Banking App",
      description: "Secure and user-friendly mobile banking application",
      progress: 78,
      status: "ongoing",
      images: [
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
      ],
      totalbudget: "Rs. 250,000,000",
      sitesupervisor: "Ethan Carte",
      projectmanager: "Shopia Clark",
      qsofficer: "Jemis Piris",
      designer: "Smith Josan",
      engineers: [
      { name: "Eng. Nimal Perera", company: "SoftWorks Pvt Ltd", contact: "+94 77 112 3344" },
      { name: "Eng. Tharushi Silva", company: "IT Lanka Solutions", contact: "+94 71 998 7766" }
      ],
      suppliers: [
      { material: "Server Hardware", company: "TechGlobal Ltd", contact: "+94 77 123 4567" },
      { material: "Cloud Hosting", company: "CloudNet Pvt", contact: "+94 71 987 6543" }
      ]
    },
    {
      id: 4,
      title: "Restaurant Management",
      description: "Complete restaurant management and POS system",
      progress: 100,
      status: "finished",
      images: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
      ],
      totalbudget: "Rs. 250,000,000",
      sitesupervisor: "Ethan Carte",
      projectmanager: "Shopia Clark",
      qsofficer: "Jemis Piris",
      designer: "Smith Josan",
      engineers: [
      { name: "Eng. Nimal Perera", company: "SoftWorks Pvt Ltd", contact: "+94 77 112 3344" },
      { name: "Eng. Tharushi Silva", company: "IT Lanka Solutions", contact: "+94 71 998 7766" }
      ],
      suppliers: [
      { material: "Server Hardware", company: "TechGlobal Ltd", contact: "+94 77 123 4567" },
      { material: "Cloud Hosting", company: "CloudNet Pvt", contact: "+94 71 987 6543" }
      ]
    },
    {
      id: 6,
      title: "Social Media Dashboard",
      description: "Analytics dashboard for social media management",
      progress: 25,
      status: "hold",
      images: [
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
      ],
      totalbudget: "Rs. 250,000,000",
      sitesupervisor: "Ethan Carte",
      projectmanager: "Shopia Clark",
      qsofficer: "Jemis Piris",
      designer: "Smith Josan",
      engineers: [
      { name: "Eng. Nimal Perera", company: "SoftWorks Pvt Ltd", contact: "+94 77 112 3344" },
      { name: "Eng. Tharushi Silva", company: "IT Lanka Solutions", contact: "+94 71 998 7766" }
      ],
      suppliers: [
      { material: "Server Hardware", company: "TechGlobal Ltd", contact: "+94 77 123 4567" },
      { material: "Cloud Hosting", company: "CloudNet Pvt", contact: "+94 71 987 6543" }
      ]
    },
  ];

  const categories = [
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'finished', label: 'Finished' },
    { key: 'hold', label: 'Hold' }
  ].map(category => ({
    ...category,
    count: projects.filter(project => project.status === category.key).length
  }));

  const handleCategoryChange = (category) => {
    if (category !== activeCategory) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveCategory(category);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const ProjectCard = ({ project, index }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      let interval;
      if (isHovered && project.images.length > 1) {
        interval = setInterval(() => {
          setCurrentImageIndex((prev) =>
            prev === project.images.length - 1 ? 0 : prev + 1
          );
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isHovered, project.images.length]);

    return (
      <div
        className={`bg-white shadow-lg hover:shadow-2xl  ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          animationDelay: `${index * 100}ms`,
          animation: !isTransitioning ? 'slideInUp 0.6s ease-out forwards' : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.images[currentImageIndex]}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {project.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {project.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentImageIndex ? 'bg-yellow-400' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-yellow-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => navigate(`/directorcont/project/${project.id}`, { state: { project } })}
            className="w-full bg-black hover:bg-yellow-400 text-white hover:text-black font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
          >
            <Eye className="w-4 h-4 mr-2" />
            View More
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    );
  };

  const filteredProjects = projects.filter((project) => project.status === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Overview</h1>
            <p className="text-gray-600">Manage and track all your projects in one place</p>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Plus className="w-5 h-5 mr-2" />
            Add Project
          </button>
        </div>

        <div className="flex space-x-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryChange(category.key)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeCategory === category.key
                  ? 'bg-yellow-400 text-black shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
              }`}
            >
              <span>{category.label}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeCategory === category.key
                    ? 'bg-black text-yellow-400'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
            <p className="text-gray-500">There are no {activeCategory} projects at the moment.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Project;
