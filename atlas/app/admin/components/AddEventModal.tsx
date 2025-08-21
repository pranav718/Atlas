"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, User, FileText } from 'lucide-react';
import { Event } from '../page';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<Event, 'id'>) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    location: '',
    host: '',
    desc: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every(value => value)) {
      onAdd(formData);
      setFormData({ name: '', time: '', location: '', host: '', desc: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Add New Event</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-gray-500" />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter event name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2 text-purple-500" />
                                            Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2 text-purple-500" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Event location"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2 text-purple-500" />
                    Host
                  </label>
                  <input
                    type="text"
                    name="host"
                    value={formData.host}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Event host"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2 text-purple-500" />
                    Description
                  </label>
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Event description"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-purple-200 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Event
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddEventModal;