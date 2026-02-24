import React from 'react'
import { motion } from "framer-motion"

const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.15, // faster, smoother stagger
            ease: "easeOut"
        }
    }
}

const childVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { duration: 0.45, ease: "easeOut" }
    }
}

const Hero = () => {
    return (
        <div className='pb-4 lg:mb-36 text-white'>
            <div className='flex flex-wrap lg:flex-row-reverse'>

                {/* Image Section */}
                <div className='w-full lg:w-1/2'>
                    <div className='flex justify-center lg:p-8'>
                        <motion.img 
                            src="/sim.jpg"
                            alt="Simmerjit Singh Sethi"
                            className='h-[20rem] sm:h-[25rem] lg:h-[30rem] rounded-3xl mt-6 border-2 border-stone-300 shadow-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500'
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Content Section */}
                <motion.div 
                    className='w-full lg:w-1/2'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className='flex flex-col items-center lg:items-start mt-10 px-4 lg:px-8'>
                        
                        <motion.h1 
                            className='pb-2 text-3xl sm:text-4xl lg:text-6xl xl:text-8xl tracking-tighter font-thin text-center lg:text-left'
                            variants={childVariants}
                        >
                            Simmerjit Singh Sethi
                        </motion.h1>
                        
                        <motion.span 
                            className='bg-gradient-to-r from-stone-300 to-stone-600 bg-clip-text text-xl sm:text-2xl lg:text-3xl tracking-tight text-transparent font-semibold mb-4'
                            variants={childVariants}
                        >
                            Full Stack Developer
                        </motion.span>
                        
                        <motion.p 
                            className='my-2 max-w-lg py-6 text-base sm:text-lg lg:text-xl leading-relaxed tracking-tight text-stone-300 text-center lg:text-left'
                            variants={childVariants}
                        >
                            Passionate full-stack developer with expertise in React, Node.js, and modern web technologies. I create seamless user experiences and robust backend solutions. Always eager to learn new technologies and solve complex problems through innovative coding solutions.
                        </motion.p>

                        <motion.a 
                            href="/resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className='bg-white hover:bg-stone-100 text-stone-800 hover:text-stone-900 rounded-full px-8 py-4 text-sm font-semibold mb-10 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
                            variants={childVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Download Resume
                        </motion.a>

                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Hero
