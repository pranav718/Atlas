// app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
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
  id: string;
  name: string;
  time: string;
  location: string;
  host: string;
  desc: string;
}

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('locations');
  const [locations, setLocations] = useState<Location[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      const response = await fetch('/admin/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data.map((loc: any) => ({
          id: loc.locationId,
          name: loc.name,
          category: 'General', // You might want to add category to your schema
          status: loc.status
        })));
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/admin/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchLocations(), fetchEvents()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleAddLocation = async (location: Omit<Location, 'id'>) => {
    try {
      const response = await fetch('/admin/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location)
      });

      if (response.ok) {
        await fetchLocations();
        setShowLocationModal(false);
      }
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleAddEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const response = await fetch('/admin/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      if (response.ok) {
        await fetchEvents();
        setShowEventModal(false);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleDeleteLocation = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`/admin/api/locations/${itemToDelete}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchLocations();
          setShowDeleteModal(false);
          setItemToDelete(null);
        }
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  const handleUpdateLocation = async (id: number, updates: Partial<Location>) => {
    try {
      const response = await fetch(`/admin/api/locations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await fetchLocations();
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-blue-600 text-xl">Loading...</div>
      </div>
    );
  }

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
            className="absolute bottom-12 right-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-full shadow-lg flex items-center group"
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