import React from 'react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const navVariants = {
    hidden: { 
      y: -50, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      y: -20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/simmerjit/",
      src: "/link2.png",
      alt: "LinkedIn",
      height: "h-[45px]"
    },
    {
      href: "https://twitter.com/simmerjit", // Update with your Twitter
      src: "/x1.png",
      alt: "X (Twitter)",
      height: "h-[28px]"
    },
    {
      href: "https://github.com/simmerjit",
      src: "/git2.png",
      alt: "GitHub",
      height: "h-[38px]"
    }
  ]

  return (
    <>
      <motion.nav 
        className='flex items-center justify-between py-6 px-4 sm:px-6 lg:px-8 h-auto bg-black/20 backdrop-blur-sm border-b border-stone-800/30'
        variants={navVariants}
        initial="hidden"
        animate="visible"
      > 
        {/* Logo */}
        <motion.div 
          className='flex flex-shrink-0 items-center'
          variants={itemVariants}
        >
          <motion.a 
            href="/" 
            className='text-white font-pricedown text-2xl sm:text-3xl tracking-wider hover:text-stone-300 transition-colors duration-300'
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 8px rgba(255,255,255,0.6)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            simmerjit
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          className='flex items-center justify-center gap-3 sm:gap-4 lg:gap-6'
          variants={itemVariants}
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className='group relative'
              whileHover={{ 
                scale: 1.1,
                rotate: 5
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={link.src} 
                alt={link.alt}  
                className={`${link.height} object-contain transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-lg`}
              />
              
              {/* Tooltip */}
              <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none'>
                {link.alt}
              </div>
            </motion.a>
          ))}
        </motion.div>
      </motion.nav>

      {/* Mobile Navigation Indicator */}
      <motion.div 
        className='w-full h-[2px] bg-gradient-to-r from-transparent via-stone-600 to-transparent'
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </>
  )
}

export default Navbar
