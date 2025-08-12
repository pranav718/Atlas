// In app/page.tsx
import React from 'react';

const Header: React.FC = () => (
  <header>
    {/* These class names correspond to the colors and heights from your design */}
    <div className="h-[40px] bg-[#7A96D5]"></div> 
    <div className="h-[200px] bg-[#88DBE7]"></div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="h-[80px] bg-[#7A96D5]"></footer>
);

export default function Home() {
  return (
    // This is the main container for the whole page
    <div className="flex flex-col h-screen">
      <Header />
      {/* Main content area with centered white rectangle */}
      <main className="flex-1 bg-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl h-[500px] flex items-center mt-4 mb-4 justify-center">
          <div className="text-black ">ACADEMIC BLOCK 1</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}