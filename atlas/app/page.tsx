"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Building, Users } from 'lucide-react';
import Card from './components/Card';
import SearchBar from './components/SearchBar';
import UserMenu from './components/UserMenu';
import InteractiveButton from './components/InteractiveButton';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <motion.header
      className="relative z-50" // Add z-50 to ensure header is above other content
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top bar with auth buttons */}
      <div className="h-[50px] bg-white/90 backdrop-blur-sm flex items-center justify-between px-8 shadow-sm relative"> {/* Add relative positioning */}
        <div className="flex items-center gap-2">
<<<<<<< Updated upstream
          <motion.img 
            src="/uniway_new.svg" 
            alt="Uniway" 
=======
          <motion.img
            src="/uniway.svg"
            alt="Uniway"
>>>>>>> Stashed changes
            className="h-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>
        <div className="flex gap-3 items-center relative z-50"> {/* Add relative z-50 */}
          {status === 'loading' ? (
            <div className="text-purple-600 text-sm">Loading...</div>
          ) : session ? (
            <UserMenu />
          ) : (
            <>
              <InteractiveButton text="Login" route="/login" />
              <InteractiveButton text="Sign Up" route="/register" />
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

const HeroSection: React.FC = () => {
  return (
<<<<<<< Updated upstream
    <section className="relative bg-gradient-to-br from-blue-700 via-[#369be1] to-cyan-300 text-white overflow-hidden">
=======
    <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white"> {/* Remove overflow-hidden */}
>>>>>>> Stashed changes
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10 overflow-hidden"> {/* Add overflow-hidden here instead */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative" // Add relative positioning
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Navigate MUJ with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
                Uniway
              </span>
            </h1>
            <p className="text-xl text-white mb-8 leading-relaxed">
              Your smart campus companion. Find buildings, discover shortest routes, 
              and explore every corner of Manipal University Jaipur with ease.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: MapPin, text: "Real-time Navigation" },
                { icon: Building, text: "Building Information" },
                { icon: Navigation, text: "Shortest Routes" },
                { icon: Users, text: "Popular Destinations" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                  <span className="text-white">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Search bar in hero - with overflow visible container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative z-40" // Increase z-index
              style={{ minHeight: '60px' }} // Add min-height to prevent layout shift
            >
              <SearchBar variant="hero" />
            </motion.div>
          </motion.div>

          {/* Right content - Logo */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="relative z-0" // Lower z-index for logo
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
              <img 
                src="/uniway_new.svg" 
                alt="Uniway Logo" 
                className="h-64 lg:h-80 relative z-10"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0 z-0"> {/* Add z-0 */}
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f3f4f6"/>
        </svg>
      </div>
    </section>
  );
};


const BuildingsSection: React.FC = () => {
  const buildings = [
    {
      title: "Academic Block 1 (AB1)",
      imageUrl: "/ab1.jpeg",
      coordinates: [26.84252267769878, 75.56475881089028] as [number, number],
      mostVisited: ["Classrooms", "Labs", "Cafeteria"]
    },
    {
      title: "Academic Block 2 (AB2)",
      imageUrl: "/ab2.jpeg",
      coordinates: [26.843009041165054, 75.56583836911558] as [number, number],
      mostVisited: ["Ramdas Pai Ampitheatre", "Sharda Pai Auditorium", "Quess Outlet"]
    },
    {
      title: "Academic Block 3 (AB3)",
      imageUrl: "/ab3-1.jpeg",
      coordinates: [26.844502393826332, 75.56476082808086] as [number, number],
      mostVisited: ["Design Studios", "Tech Labs", "Project Rooms"]
    },
    {
      title: "Lecture Hall Complex",
      imageUrl: "/LHC.jpeg",
      coordinates: [26.84432342141948, 75.56480585671513] as [number, number],
      mostVisited: ["Auditoriums", "Conference Rooms", "Foyer"]
    }
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Explore Campus Buildings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover key locations across MUJ campus. Click on any building to learn more about its facilities and find the best routes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {buildings.map((building, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card {...building} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <motion.footer 
    className="bg-blue-700 text-white py-12"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="max-w-7xl mx-auto px-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img src="/uniway.svg" alt="Uniway" className="h-10" />
          <span className="text-lg font-semibold text-white">Uniway</span>
        </div>
        <p className="text-white text-sm">
          Made with love by team Atlas
        </p>
      </div>
    </div>
  </motion.footer>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <BuildingsSection />
      <Footer />
    </div>
  );
}