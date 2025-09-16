import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pearl-50 via-resin-50 to-ocean-50 flex items-center justify-center z-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-resin-200/30 rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gold-200/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-ocean-200/30 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo */}
        <div className="mb-8 animate-fadeInDown">
          <img
            src="/logo1.jpg"
            alt="Aaraksha Resin Art"
            className="w-24 h-24 rounded-full shadow-resin mx-auto animate-pulse-slow"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl md:text-5xl font-playfair font-bold resin-text-gradient mb-4 animate-fadeInUp">
          Aaraksha Resin Art
        </h1>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-2 mb-8">
          <div className="w-3 h-3 bg-resin-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gold-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 bg-ocean-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-600 text-lg animate-fadeInUp" style={{animationDelay: '0.3s'}}>
          Crafting beautiful memories...
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-resin-gradient rounded-full animate-pulse-slow"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
