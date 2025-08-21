"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, FileText } from 'lucide-react';
import { Event } from '../page';

interface EventsViewProps {
  events: Event[];
}

const EventsView: React.FC<EventsViewProps> = ({ events }) => {
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl h-full p-8 overflow-y-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-5 gap-6 px-6 py-4 border-b-2 border-gray-100">
        <div className="font-bold text-gray-700 text-sm tracking-wider">NAME</div>
        <div className="font-bold text-gray-700 text-sm tracking-wider">DATE & TIME</div>
        <div className="font-bold text-gray-700 text-sm tracking-wider">LOCATION</div>
        <div className="font-bold text-gray-700 text-sm tracking-wider">HOST</div>
        <div className="font-bold text-gray-700 text-sm tracking-wider">DESCRIPTION</div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {events.length === 0 ? (
          <motion.div 
            className="text-center text-gray-500 p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No events have been added yet.</p>
            <p className="text-sm mt-2">Click the ADD NEW button to create your first event.</p>
          </motion.div>
        ) : (
          events.map((event, index) => (
            <motion.div
              key={event.id}
              className="grid grid-cols-5 gap-6 px-6 py-5 items-center hover:bg-purple-50/50 transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div>
                <p className="font-medium text-gray-800">{event.name}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-purple-500" />
                <p className="text-sm">{formatDateTime(event.time)}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-purple-500" />
                <p className="text-sm">{event.location}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-purple-500" />
                <p className="text-sm">{event.host}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4 text-purple-500" />
                <p className="text-sm truncate">{event.desc}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default EventsView;