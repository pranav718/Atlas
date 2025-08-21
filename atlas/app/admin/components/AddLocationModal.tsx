"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Tag } from 'lucide-react';
import { Location } from '../page';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (location: Omit<Location, 'id'>) => void;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && category) {
      onAdd({ name, category, status: '' });
      setName('');
      setCategory('');
    }
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Add New Location</h2>
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
                    <MapPin className="w-4 h-4 inline mr-2 text-purple-500" />
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter location name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-2 text-purple-500" />
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="Academic">Academic</option>
                    <option value="Food">Food</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
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
                    Add Location
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

export default AddLocationModal;