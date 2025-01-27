"use client"
import React, { useState } from 'react';
import { Brain, ArrowRight, Copy, Check } from 'lucide-react';

const SimpleLanding = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const address = "H1sWyyDceAPpGmMUxVBCHcR2LrCjz933pUyjWSLpump";
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-yellow-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl text-center relative">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Brain className="h-12 w-12 text-white animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-800 mb-4 hover:scale-105 transition-transform duration-300">
          GarlicAI
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8 hover:text-gray-800 transition-colors">
          Powered by DeepSeek, seasoned with garlic
        </p>

        {/* Description */}
        <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
          Bringing the flavor of artificial intelligence to the Garlicoin ecosystem. 
          A tasteful blend of machine learning and blockchain technology.
        </p>

        {/* Wallet Address */}
        <div className="mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-lg max-w-xl mx-auto relative group hover:shadow-lg transition-all duration-300">
          <p className="text-sm text-gray-500 mb-2">Contract Address</p>
          <div className="flex items-center justify-between">
            <p className="font-mono text-gray-700 break-all">
              CA: H1sWyyDceAPpGmMUxVBCHcR2LrCjz933pUyjWSLpump
            </p>
            <button
              onClick={handleCopy}
              className="ml-2 p-2 text-gray-500 hover:text-yellow-600 hover:scale-110 transition-all duration-300"
              title="Copy address"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <span className="font-semibold">Coming Soon</span>
          <ArrowRight className="ml-2 h-4 w-4 animate-bounce" />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-600 relative">
        © 2025 GarlicAI
      </footer>
    </div>
  );
};

export default SimpleLanding;