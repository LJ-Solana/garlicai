import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';

const SimpleLanding = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Main Content */}
      <div className="max-w-2xl text-center">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-yellow-500 rounded-full p-4">
            <Brain className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          GarlicAI
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8">
          Powered by DeepSeek, seasoned with garlic
        </p>

        {/* Description */}
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Bringing the flavor of artificial intelligence to the Garlicoin ecosystem. 
          A tasteful blend of machine learning and blockchain technology.
        </p>

        {/* Coming Soon */}
        <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
          <span>Coming Soon</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500">
        © 2025 GarlicAI
      </footer>
    </div>
  );
};

export default SimpleLanding;