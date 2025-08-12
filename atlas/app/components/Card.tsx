
import React from 'react';

interface CardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  mostVisited?: string[];
}

const Card: React.FC<CardProps> = ({ title, subtitle, imageUrl, mostVisited }) => {
  return (
    <div className="relative w-full h-[250px] rounded-lg overflow-hidden shadow-lg group cursor-pointer">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Overlay with opacity */}
        <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
      </div>

      {/* Default Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 transition-all duration-300 group-hover:transform group-hover:scale-95 group-hover:opacity-0">
        <h2 className="text-3xl font-extrabold font-twcenmt">{title}</h2>
        <h3 className="text-xl font-bold font-twcenmt">{subtitle}</h3>
      </div>

      {/* Hover Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white transform translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold font-twcenmt">{title}</h2>
          <h3 className="text-lg font-bold font-twcenmt">{subtitle}</h3>
        </div>
        {mostVisited && (
          <div className="text-right mt-4 self-end">
            <h4 className="text-lg font-bold">Most Visited Places:</h4>
            <ul className="text-sm list-disc list-inside">
              {mostVisited.map((place, index) => (
                <li key={index}>{place}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;