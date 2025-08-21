"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { Location } from '../page';

interface LocationsViewProps {
  locations: Location[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Location>) => void;
}

const LocationsView: React.FC<LocationsViewProps> = ({ locations, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleEdit = (location: Location) => {
    setEditingId(location.id);
    setEditName(location.name);
  };

  const handleSave = (id: number) => {
    onUpdate(id, { name: editName });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MAINTENANCE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CLOSE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl h-full p-8 overflow-y-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-4 gap-6 px-6 py-4 border-b-2 border-gray-100">
        <div className="font-bold text-gray-700 text-sm tracking-wider">NAME</div>
        <div className="font-bold text-gray-700 text-sm tracking-wider">CATEGORY</div>
        <div className="font-bold text-gray-700 text-sm tracking-wider">STATUS</div>
        <div className="font-bold text-gray-700 text-sm tracking-wider">ACTIONS</div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            className="grid grid-cols-4 gap-6 px-6 py-5 items-center hover:bg-purple-50/50 transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div>
              {editingId === location.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  autoFocus
                />
              ) : (
                <p className="font-medium text-gray-800">{location.name}</p>
              )}
            </div>
            
            <div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {location.category}
              </span>
            </div>
            
            <div>
              <select
                value={location.status}
                onChange={(e) => onUpdate(location.id, { status: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${getStatusColor(location.status)}`}
              >
                <option value="">Select Status</option>
                <option value="OPEN">OPEN</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="CLOSE">CLOSE</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              {editingId === location.id ? (
                <>
                  <motion.button
                    onClick={() => handleSave(location.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4" />
                    SAVE
                  </motion.button>
                  <motion.button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                    CANCEL
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => handleEdit(location)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className="w-4 h-4" />
                    EDIT
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(location.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    DELETE
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LocationsView;