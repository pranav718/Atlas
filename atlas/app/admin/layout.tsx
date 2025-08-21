"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}