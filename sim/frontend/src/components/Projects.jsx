import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ExternalLink, Github, Code2, Sparkles } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND;
        const res = await axios.get(`${backendUrl}/project`);
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="pb-20 text-white">
        <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
          <motion.div 
            className="w-12 h-12 border-3 border-slate-300 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-slate-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading projects...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className='pb-20 text-white px-4 sm:px-6 lg:px-8'>
      {/* Enhanced Header with your color theme */}
      <motion.div 
        className="text-center mb-16 sm:mb-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className='text-3xl sm:text-4xl lg:text-5xl font-thin tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-blue-200 to-slate-300 mb-4'
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Projects
        </motion.h2>
        <motion.div 
          className="w-20 h-[2px] bg-gradient-to-r from-slate-400 to-slate-600 mx-auto rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.div>

      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project, index) => (
          <ProjectCard 
            key={project._id || project.id}
            project={project}
            index={index}
            itemVariants={itemVariants}
          />
        ))}
      </motion.div>
    </div>
  );
}

// Enhanced Project Card Component
const ProjectCard = ({ project, index, itemVariants }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Handle navigation to project
  const navigateToProject = () => {
    // You can customize the URL based on the project
    // For now, using your example URL for all projects
    window.open('https://real-estate-webiste-fullstack.vercel.app/', '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div 
      ref={ref}
      className={`mb-16 sm:mb-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
        index % 2 === 1 ? 'lg:flex-row-reverse' : ''
      }`}
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Enhanced Image Section - Clickable */}
      <motion.div 
        className='w-full lg:w-1/2 max-w-lg cursor-pointer'
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={navigateToProject}
      >
        <div className="relative group overflow-hidden rounded-3xl shadow-2xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300">
          <motion.img 
            className='w-full h-64 sm:h-72 lg:h-80 object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale filter' 
            src={project.image} 
            alt={project.title}
            loading="lazy"
            whileHover={{ scale: 1.02 }}
          />
          
          {/* Enhanced Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Click to visit indicator */}
          <motion.div 
            className="absolute top-4 left-4 bg-slate-700/90 backdrop-blur-sm text-slate-200 px-3 py-1 rounded-full text-xs font-semibold border border-slate-600/50"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            Click to visit
          </motion.div>
          
          {/* Project Links Overlay with enhanced animations */}
          {project.links && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {project.links.live && (
                <motion.a 
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full backdrop-blur-sm border border-slate-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={20} />
                </motion.a>
              )}
              {project.links.github && (
                <motion.a 
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full backdrop-blur-sm border border-slate-600/50 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={20} />
                </motion.a>
              )}
            </motion.div>
          )}

          {/* Project Number Badge */}
          <motion.div 
            className="absolute top-4 right-4 bg-slate-700/90 backdrop-blur-sm text-slate-200 px-3 py-1 rounded-full text-sm font-semibold border border-slate-600/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            #{String(index + 1).padStart(2, '0')}
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Content Section */}
      <motion.div 
        className='w-full lg:w-1/2 space-y-6'
        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Project Category */}
        <motion.div
          className="flex items-center gap-2 text-slate-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Code2 size={16} />
          <span className="text-sm font-medium uppercase tracking-wider">Featured Project</span>
        </motion.div>

        {/* Title - Clickable */}
        <motion.h3 
          className='font-bold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight hover:text-slate-200 transition-colors duration-300 cursor-pointer'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={navigateToProject}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {project.title}
        </motion.h3>

        {/* Description in enhanced card */}
        <motion.div 
          className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ 
            backgroundColor: "rgba(51, 65, 85, 0.2)",
            borderColor: "rgba(148, 163, 184, 0.3)",
            y: -2
          }}
        >
          <p className='text-slate-300 text-base sm:text-lg leading-relaxed'>
            {project.description}
          </p>
        </motion.div>

        {/* Enhanced Technologies */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles size={16} />
            <h4 className="text-sm font-semibold uppercase tracking-wider">Tech Stack</h4>
          </div>
          <motion.div 
            className="flex flex-wrap gap-2 sm:gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {project.technologies && project.technologies.map((tech, i) => (
              <motion.span 
                className='px-3 py-2 rounded-full bg-gradient-to-r from-slate-800/60 to-slate-700/60 text-xs sm:text-sm font-medium text-slate-200 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm cursor-default' 
                key={i}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  backgroundColor: "rgba(51, 65, 85, 0.8)"
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Action Buttons */}
        {project.links && (
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {project.links.live && (
              <motion.a 
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-full font-semibold border border-slate-500/50 shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink size={20} />
                Live Demo
              </motion.a>
            )}
            {project.links.github && (
              <motion.a 
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-800/60 hover:bg-slate-700/80 text-white rounded-full font-semibold border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={20} />
                Source Code
              </motion.a>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Projects;
