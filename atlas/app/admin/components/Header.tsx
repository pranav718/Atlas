// app/admin/components/Header.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { User, Home, LogOut } from 'lucide-react';
import { ViewType } from '../page';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  currentView: ViewType;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

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
      
      <div className="flex items-center gap-3">
        <motion.button 
          onClick={() => router.push('/')}
          className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center gap-2 text-blue-600 font-medium transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-4 h-4" />
          Home
        </motion.button>
        
        <motion.button 
          onClick={handleSignOut}
          className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 flex items-center gap-2 text-red-600 font-medium transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
        
        <motion.button 
          className="w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center shadow-sm transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <User className="w-6 h-6 text-blue-600" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;