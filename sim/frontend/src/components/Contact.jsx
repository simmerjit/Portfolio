import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    setIsSubmitting(true);
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND;
     const response = await axios.post(`${process.env.REACT_APP_BACKEND}/contact`, form);

      setStatus('Message sent! Check your email for confirmation.');
      setForm({ name: '', email: '', message: '' });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus('');
      }, 5000);
      
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('Failed to send message. Please try again.');
      
      // Auto-hide error message after 4 seconds
      setTimeout(() => {
        setStatus('');
      }, 4000);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="border-t border-stone-900 pb-20 text-white min-h-screen flex items-center justify-center">
      <motion.div
        className="w-full max-w-2xl px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="my-16 text-center text-4xl sm:text-5xl font-thin tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-blue-200 to-slate-300"
          variants={itemVariants}
        >
          Get In Touch
        </motion.h2>

        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <p className="text-slate-400 text-lg">
            Have a project in mind? Let's work together to bring your ideas to life.
          </p>
        </motion.div>

        <motion.form
          className="mx-auto flex w-full max-w-lg flex-col gap-8 bg-gradient-to-br from-slate-900/80 via-stone-900/70 to-slate-800/80 p-10 rounded-[2rem] border border-slate-600/30 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-[2rem]" />

          <motion.div className="relative" variants={itemVariants}>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                className="w-full rounded-2xl bg-slate-800/60 border border-slate-600/40 pl-12 pr-4 py-5 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-400/30 transition-all duration-500 hover:bg-slate-800/80"
                type="text"
                name="name"
                value={form.name}
                placeholder="Your Name"
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </motion.div>

          <motion.div className="relative" variants={itemVariants}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                className="w-full rounded-2xl bg-slate-800/60 border border-slate-600/40 pl-12 pr-4 py-5 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-400/30 transition-all duration-500 hover:bg-slate-800/80"
                type="email"
                name="email"
                value={form.email}
                placeholder="Your Email"
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </motion.div>

          <motion.div className="relative" variants={itemVariants}>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-6 text-slate-400 w-5 h-5" />
              <textarea
                className="w-full rounded-2xl bg-slate-800/60 border border-slate-600/40 pl-12 pr-4 py-5 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/70 focus:ring-2 focus:ring-blue-400/30 transition-all duration-500 resize-none hover:bg-slate-800/80"
                name="message"
                value={form.message}
                placeholder="Tell me about your project..."
                onChange={handleChange}
                rows={6}
                required
                disabled={isSubmitting}
                minLength={10}
                maxLength={500}
              />
            </div>
            <div className="text-right text-xs text-slate-500 mt-1">
              {form.message.length}/500
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="relative mt-6 rounded-2xl bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 px-8 py-5 font-bold text-slate-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-slate-400/40 transform hover:scale-[1.02] active:scale-[0.98] border border-slate-300/60 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="relative flex items-center justify-center gap-3">
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </div>
          </motion.button>

          {status && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2">
                {status.includes('sent') ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <p className={`text-sm font-medium tracking-wide ${
                  status.includes('sent') ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {status}
                </p>
              </div>
            </motion.div>
          )}
        </motion.form>

        {/* Additional Contact Info */}
        <motion.div 
          className="text-center mt-12"
          variants={itemVariants}
        >
          <p className="text-slate-400 text-sm">
            Or reach out directly at{' '}
            <a 
              href="mailto:simmerjits3@gmail.com" 
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-300"
            >
              simmerjits3@gmail.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
