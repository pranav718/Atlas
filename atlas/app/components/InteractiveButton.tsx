"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface InteractiveButtonProps {
  text: string;
  route: string;
  variant?: 'primary' | 'secondary';
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({ 
  text, 
  route, 
  variant = 'secondary' 
}) => {
  const router = useRouter();

  const isPrimary = variant === 'primary';

  return (
    <motion.button
      className={`px-6 py-2 rounded-full font-medium transition-all ${
        isPrimary
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white'
      }`}
      onClick={() => router.push(route)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {text}
    </motion.button>
  );
};

export default InteractiveButton;