"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/app/admin/components/Sidebar';
import Header from '@/app/admin/components/Header';
import LocationsView from '@/app/admin/components/LocationsView';
import EventsView from '@/app/admin/components/EventsView';
import AddLocationModal from '@/app/admin/components/AddLocationModal';
import AddEventModal from '@/app/admin/components/AddEventModal';
import DeleteEventModal from '@/app/admin/components/DeleteEventModal';
import { Plus } from 'lucide-react';

export type ViewType = 'locations' | 'events';

export interface Location {
  id: number;
  name: string;
  category: string;
  status: string;
}

export interface Event {
  id: number;
  name: string;
  time: string;
  location: string;
  host: string;
  desc: string;
}

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('locations');
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: 'Academic Block 1', category: 'Academic', status: 'OPEN' },
    { id: 2, name: 'Food Court 1', category: 'Food', status: 'CLOSE' }
  ]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleAddLocation = (location: Omit<Location, 'id'>) => {
    setLocations([...locations, { ...location, id: Date.now() }]);
    setShowLocationModal(false);
  };

  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    setEvents([...events, { ...event, id: Date.now() }]);
    setShowEventModal(false);
  };

  const handleDeleteLocation = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setLocations(locations.filter(loc => loc.id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleUpdateLocation = (id: number, updates: Partial<Location>) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, ...updates } : loc
    ));
  };

  return (
    <div className="flex h-screen">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col">
        <Header currentView={currentView} />
        
        <div className="flex-1 p-8 relative">
          {currentView === 'locations' ? (
            <LocationsView 
              locations={locations} 
              onDelete={handleDeleteLocation}
              onUpdate={handleUpdateLocation}
            />
          ) : (
            <EventsView events={events} />
          )}
          
          {/* Floating Add Button */}
          <motion.button
            onClick={() => currentView === 'locations' ? setShowLocationModal(true) : setShowEventModal(true)}
            className="absolute bottom-12 right-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-full shadow-lg flex items-center group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            ADD NEW
          </motion.button>
        </div>
      </main>

      {/* Modals */}
      <AddLocationModal 
        isOpen={showLocationModal} 
        onClose={() => setShowLocationModal(false)}
        onAdd={handleAddLocation}
      />
      <AddEventModal 
        isOpen={showEventModal} 
        onClose={() => setShowEventModal(false)}
        onAdd={handleAddEvent}
      />
      <DeleteEventModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}