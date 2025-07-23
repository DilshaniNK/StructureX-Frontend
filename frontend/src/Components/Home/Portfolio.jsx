import React, { useState } from 'react';
import { Star, Calendar, MapPin, Users, Eye, ArrowRight, X } from 'lucide-react';

const Portfolio = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Sample construction projects data
  const projects = [
    {
      id: 1,
      title: "Luxury Residential Complex",
      category: "Residential",
      location: "Downtown District",
      completedDate: "March 2024",
      duration: "18 months",
      client: "Premium Developers Ltd",
      rating: 4.9,
      reviews: 24,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "A modern 50-unit luxury residential complex featuring sustainable design elements and premium amenities.",
      testimonial: "Exceptional quality and attention to detail. The project was completed on time and exceeded our expectations.",
      clientName: "Sarah Johnson, Project Manager"
    },
    {
      id: 2,
      title: "Corporate Office Tower",
      category: "Commercial",
      location: "Business Park",
      completedDate: "January 2024",
      duration: "24 months",
      client: "TechCorp Industries",
      rating: 4.8,
      reviews: 18,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "15-story state-of-the-art office tower with smart building technology and LEED Gold certification.",
      testimonial: "Professional team that delivered a world-class facility. The building systems are outstanding.",
      clientName: "Michael Chen, Facilities Director"
    },
    {
      id: 3,
      title: "Shopping Mall Renovation",
      category: "Retail",
      location: "City Center",
      completedDate: "November 2023",
      duration: "12 months",
      client: "Retail Spaces Inc",
      rating: 4.7,
      reviews: 31,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Complete renovation of 200,000 sq ft shopping mall with modern design and enhanced customer experience.",
      testimonial: "Transformed our aging mall into a modern shopping destination. Sales have increased by 40%.",
      clientName: "Lisa Rodriguez, Mall Manager"
    },
    {
      id: 4,
      title: "Industrial Warehouse Complex",
      category: "Industrial",
      location: "Industrial Zone",
      completedDate: "August 2023",
      duration: "15 months",
      client: "LogiCorp Solutions",
      rating: 4.9,
      reviews: 15,
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "500,000 sq ft automated warehouse facility with advanced logistics systems and energy-efficient design.",
      testimonial: "Incredible efficiency in both construction and final product. The facility exceeds all our operational needs.",
      clientName: "David Kim, Operations Manager"
    },
    {
      id: 5,
      title: "Healthcare Facility",
      category: "Healthcare",
      location: "Medical District",
      completedDate: "June 2023",
      duration: "20 months",
      client: "MedCenter Group",
      rating: 4.8,
      reviews: 22,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Modern medical facility with specialized equipment installation and compliance with healthcare regulations.",
      testimonial: "Built to the highest standards with attention to healthcare-specific requirements. Truly professional.",
      clientName: "Dr. Amanda Wilson, Chief Administrator"
    },
    {
      id: 6,
      title: "Educational Campus",
      category: "Educational",
      location: "University District",
      completedDate: "May 2023",
      duration: "22 months",
      client: "State University",
      rating: 4.9,
      reviews: 28,
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Multi-building campus expansion including classrooms, laboratories, and student facilities.",
      testimonial: "Outstanding project management and quality construction. The students love their new facilities.",
      clientName: "Prof. Robert Anderson, Campus Director"
    },
    {
      id: 7,
      title: "Luxury Hotel & Spa Resort",
      category: "Hospitality",
      location: "Beachfront Avenue",
      completedDate: "September 2024",
      duration: "30 months",
      client: "Paradise Resort Group",
      rating: 4.8,
      reviews: 42,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "A 5-star luxury resort featuring 150 suites, world-class spa facilities, multiple restaurants, and conference centers with stunning ocean views.",
      testimonial: "The construction quality is exceptional and the attention to luxury details is remarkable. Our guests are consistently impressed.",
      clientName: "Maria Santos, Resort Director"
    },
    {
      id: 8,
      title: "Smart Manufacturing Plant",
      category: "Industrial",
      location: "Technology Park East",
      completedDate: "December 2023",
      duration: "26 months", 
      client: "TechManufacturing Inc",
      rating: 4.9,
      reviews: 19,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "State-of-the-art automated manufacturing facility with IoT integration, renewable energy systems, and advanced safety protocols spanning 750,000 sq ft.",
      testimonial: "Cutting-edge facility that has revolutionized our production capabilities. The smart systems integration exceeded all expectations.",
      clientName: "James Mitchell, Plant Manager"
    }
  ];

  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  const ProjectModal = ({ project, onClose }) => (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900/95 border border-white/20 rounded-3xl max-w-5xl w-full max-h-[95vh] shadow-2xl backdrop-filter backdrop-blur-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="relative">
          <div className="h-80 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent"></div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/80 transition-all duration-200 border border-white/10 hover:scale-105"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-6 left-6">
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {project.category}
            </span>
          </div>
          
          <div className="absolute bottom-6 right-6 flex items-center bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="flex items-center text-yellow-400 mr-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(project.rating) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-white font-semibold text-sm">
              {project.rating}
            </span>
          </div>
        </div>
        
        <div 
          className="overflow-y-auto custom-scrollbar"
          style={{
            maxHeight: 'calc(95vh - 320px)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-4xl font-bold text-white mb-4 leading-tight">{project.title}</h3>
              <p className="text-white/70 text-lg leading-relaxed">{project.description}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-yellow-400 font-semibold text-sm uppercase tracking-wide">Location</p>
                    <p className="text-white font-medium text-lg">{project.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-yellow-400 font-semibold text-sm uppercase tracking-wide">Completed</p>
                    <p className="text-white font-medium text-lg">{project.completedDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-yellow-400 font-semibold text-sm uppercase tracking-wide">Client</p>
                    <p className="text-white font-medium text-lg">{project.client}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className="text-yellow-400 font-semibold mb-2 uppercase tracking-wide text-sm">Project Duration</p>
                <p className="text-white text-2xl font-bold">{project.duration}</p>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className="text-yellow-400 font-semibold mb-2 uppercase tracking-wide text-sm">Client Reviews</p>
                <div className="flex items-center">
                  <span className="text-white text-2xl font-bold mr-3">{project.rating}/5.0</span>
                  <span className="text-white/60">({project.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/15 to-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-yellow-400 text-2xl font-bold">"</span>
                </div>
                <div>
                  <blockquote className="text-white/95 italic mb-4 text-xl leading-relaxed">
                    {project.testimonial}
                  </blockquote>
                  <cite className="text-yellow-400 font-semibold text-lg">— {project.clientName}</cite>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: transparent;
          }
          
          .custom-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>
      </div>
    </div>
  );

  return (
    <div id='projects' className='w-full bg-white/5 backdrop-blur-sm'>
      <div className='py-16 flex flex-col justify-center items-center gap-6 mt-5'>
        <h1 className='text-yellow-500 text-xl font-semibold tracking-wider'>
          PORTFOLIO
        </h1>
        <h1 className='text-white uppercase text-4xl lg:text-5xl font-bold text-center max-w-4xl leading-tight'>
          OUR COMPLETED PROJECTS
        </h1>
        <div className='w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full'></div>
      </div>

      <div className='max-w-7xl mx-auto px-6 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-12'>
        {displayedProjects.map((project, index) => (
          <div
            key={project.id}
            className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:bg-white/15 transition-all duration-300 group hover:-translate-y-1'
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={project.image}
                alt={project.title}
                className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500'
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
              <div className="absolute top-3 right-3">
                <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  {project.category}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors mb-3 line-clamp-2">
                {project.title}
              </h3>
              
              <div className="flex items-center mb-2 text-white/70">
                <MapPin className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{project.location}</span>
              </div>
              
              <div className="flex items-center mb-3 text-white/70">
                <Calendar className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                <span className="text-sm">Completed: {project.completedDate}</span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 text-yellow-400 ${
                        i < Math.floor(project.rating) ? 'fill-current' : ''
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-white/70 text-sm font-medium">
                    {project.rating}
                  </span>
                </div>
                <span className="text-white/50 text-xs">
                  ({project.reviews} reviews)
                </span>
              </div>
              
              <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>
              
              <button
                onClick={() => setSelectedProject(project)}
                className="w-full bg-transparent border border-yellow-500/50 text-yellow-400 py-2.5 px-4 rounded-lg hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-300 flex items-center justify-center gap-2 font-medium group/btn"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12 pb-16">
        {!showAll && projects.length > 4 ? (
          <button
            onClick={() => setShowAll(true)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Show More Projects
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : showAll ? (
          <button
            onClick={() => setShowAll(false)}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Show Less
          </button>
        ) : null}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
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
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;