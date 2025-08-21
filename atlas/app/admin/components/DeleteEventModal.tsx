"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [dontWarnAgain, setDontWarnAgain] = useState(false);

  const handleConfirm = () => {
    if (dontWarnAgain) {
      localStorage.setItem('dontWarnDelete', 'true');
    }
    onConfirm();
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
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </motion.div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Confirm Deletion
              </h2>
              
              <p className="text-gray-600 text-center mb-8">
                Are you sure you want to delete this location? This action cannot be undone.
              </p>
              
              <div className="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
                <input
                  id="dont-warn-checkbox"
                  type="checkbox"
                  checked={dontWarnAgain}
                  onChange={(e) => setDontWarnAgain(e.target.checked)}
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="dont-warn-checkbox" className="ml-3 text-sm text-gray-700">
                  Don't warn me again
                </label>
              </div>
              
              <div className="flex justify-end space-x-4">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;