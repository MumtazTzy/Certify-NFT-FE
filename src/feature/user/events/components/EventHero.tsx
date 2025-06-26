import React from 'react';

interface EventHeroProps {
id: number;
  title: string;
  organizer: string;
  picture: string;
}

const EventHero: React.FC<EventHeroProps> = ({ title, organizer, picture }) => {
  const imageUrl = `${picture}`;
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-64 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-white/90">by {organizer}</p>
        </div>
      </div>
    </div>
  );
};
export default EventHero;