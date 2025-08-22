"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { ViewType } from '../page';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'locations' as ViewType, label: 'Locations', icon: MapPin },
    { id: 'events' as ViewType, label: 'Events', icon: Calendar },
  ];

  return (
    <motion.aside 
      className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col shadow-2xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-blue-700/30">
        <motion.h1 
          className="text-3xl font-bold tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          UNIWAY
        </motion.h1>
        <motion.p 
          className="text-sm text-blue-200 mt-1 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ADMIN DASHBOARD
        </motion.p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
            >
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
                  currentView === item.id
                    ? 'bg-white text-blue-700 shadow-lg'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className={`w-5 h-5 transform transition-transform ${
                  currentView === item.id ? 'rotate-90' : 'group-hover:translate-x-1'
                }`} />
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;