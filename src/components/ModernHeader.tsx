
import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const ModernHeader: React.FC = () => {
  return (
    <div className="text-center py-8 px-4">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-30 animate-gradient-shift"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <h1 className="font-space-grotesk font-bold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Digital Services
            </h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <div className="relative">
            <h2 className="font-space-grotesk font-semibold text-2xl md:text-3xl text-gray-700 tracking-wide">
              Booking
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-lg text-gray-600 font-inter max-w-2xl mx-auto leading-relaxed">
        Professional digital solutions tailored for your business needs
      </p>
    </div>
  );
};

export default ModernHeader;
