import React from 'react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.05, // Reduced from 0.1 to 0.05
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3, // Reduced from 0.5 to 0.3
      ease: "easeOut"
    }
  }
}

// Floating animation for automatic up/down movement
const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const Tech = () => {
  const technologies = [
    { src: "/react.png", alt: "React" },
    { src: "/nextjs.png", alt: "Next.js" },
    { src: "/js.webp", alt: "JavaScript" },
    { src: "/tail.png", alt: "Tailwind CSS" },
    { src: "./nodejs.png", alt: "Node.js" },
    { src: "./mongo.webp", alt: "MongoDB" },
    { src: "/express.png", alt: "Express" },
    { src: "./type.png", alt: "TypeScript" },
    { src: "./post.png", alt: "PostgreSQL" },
    { src: "./redis.png", alt: "Redis" },
    { src: "./cpp.png", alt: "C++" },
  ]

  // Generate different floating patterns with reduced delays
  const getFloatingAnimation = (index) => ({
    y: [0, -15, 0],
    transition: {
      duration: 2 + (index * 0.1), // Reduced multiplier from 0.3 to 0.1
      repeat: Infinity,
      ease: "easeInOut",
      delay: index * 0.1 // Reduced from 0.2 to 0.1
    }
  })

  return (
    <div className='pb-24 text-white'>
      <motion.h2 
        className='my-20 text-center text-4xl'
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} // Reduced from 0.6 to 0.4
      >
        Technologies
      </motion.h2>
      
      <motion.div 
        className='flex flex-wrap items-center justify-center gap-6'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            animate={getFloatingAnimation(index)}
            whileHover={{ 
              scale: 1.2, 
              rotate: 5,
              y: -20, // Override floating on hover
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <img 
              src={tech.src} 
              alt={tech.alt} 
              className='w-16 h-16 object-contain hover:drop-shadow-lg transition-all duration-300' 
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Tech
