"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { ViewType } from '../page';

interface HeaderProps {
  currentView: ViewType;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  return (
    <motion.header 
      className="bg-white shadow-sm p-6 flex justify-between items-center"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        key={currentView}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
          {currentView.toUpperCase()} MANAGEMENT
        </h2>
      </motion.div>
      
      <motion.button 
        className="w-12 h-12 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center shadow-sm transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <User className="w-6 h-6 text-purple-600" />
      </motion.button>
    </motion.header>
  );
};

export default Header;