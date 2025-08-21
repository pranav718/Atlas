"use client";

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from './components/Card';
import SearchBar from './components/SearchBar';
import UserMenu from './components/UserMenu';
import InteractiveButton from './components/InteractiveButton'; // 👈 Import the new button

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    console.log('Auth Status:', status);
    console.log('Session:', session);
  }, [status, session]);

  return (
    <header className="relative">
      {/* Blue header strip with auth buttons */}
      <div className="h-[40px] bg-[#7A96D5] flex items-center justify-between px-4">
        <div></div> {/* Empty div for spacing */}
        <div className="flex gap-3 items-center">
          
          {status === 'loading' ? (
            <div className="text-white text-sm">Loading...</div>
          ) : session ? (
            <UserMenu />
          ) : (
            <>
              {/* 👇 Replace the old buttons with the new interactive ones */}
              <InteractiveButton text="Login" route="/login" />
              <InteractiveButton text="Sign Up" route="/register" />
            </>
          )}
        </div>
      </div>
      {/* Cyan background with centered logo */}
      <div className="h-[200px] bg-[#88DBE7] flex flex-col items-center justify-end relative">
        <img src="/uniway.svg" alt="Uniway Logo" className="h-[120px] mb-16 mx-auto" />
      </div>
      <SearchBar />
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="h-[80px] bg-[#7A96D5]"></footer>
);

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl my-3 p-10 grid grid-cols-2 gap-x-32 gap-y-20">
          <Card
            title="Academic Block 1 (AB1)"
            imageUrl="/ab1.jpeg"
            coordinates={[26.84252267769878, 75.56475881089028]}
            mostVisited={["Classrooms", "Labs", "Cafeteria"]}
          />
          <Card
            title="Academic Block 2 (AB2)"
            imageUrl="/ab2.jpeg"
            coordinates={[26.843009041165054, 75.56583836911558]}
            mostVisited={["Ramdas Pai Ampitheatre", "Sharda Pai Auditorium", "Quess Outlet"]}
          />
          <Card
            title="Academic Block 3 (AB3)"
            imageUrl="/ab3-1.jpeg"
            coordinates={[26.844502393826332, 75.56476082808086]}
            mostVisited={["Design Studios", "Tech Labs", "Project Rooms"]}
          />
          <Card
            title="Lecture Hall Complex"
            imageUrl="/LHC.jpeg"
            coordinates={[26.84432342141948, 75.56480585671513]}
            mostVisited={["Auditoriums", "Conference Rooms", "Foyer"]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}