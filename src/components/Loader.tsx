import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        <img 
          src="/images/logo-for-loader.jpg" 
          alt="Loading..." 
          className="w-80 h-auto animate-pulse"
        />
      </div>
    </div>
  );
};

export default Loader;
