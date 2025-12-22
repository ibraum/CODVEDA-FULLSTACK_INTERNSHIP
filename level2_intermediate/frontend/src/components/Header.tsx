import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center gap-6 mb-5 px-5">
      <div className="w-12 h-12 rounded-lg overflow-hidden relative">
        <img 
          src="/resources/me.jpeg" 
          alt="Profile" 
          className="w-full h-full object-cover filter grayscale"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      <div>
        <div className="text-xl font-bold">KONDO Ibrahim</div>
        <div className="text-sm font-medium">
          <span className="inline-block px-2 py-1 bg-blue-100 border-2 border-dotted border-blue-400 text-blue-700 rounded-md text-xs">
            Développeur fullstack
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;