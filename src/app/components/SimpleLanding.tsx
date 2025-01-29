"use client"
import React, { useState } from 'react';
import { Brain, Copy, Check, Globe, Shield } from 'lucide-react';
import Link from 'next/link';

interface Translation {
  title: string;
  subtitle: string;
  description: string;
  contractAddress: string;
  copyTooltip: string;
  copiedTooltip: string;
  footer: string;
}

interface Translations {
  [key: string]: Translation;
}

const translations: Translations = {
  en: {
    title: 'GarlicAI',
    subtitle: 'Powered by DeepSeek, seasoned with garlic',
    description: 'Bringing the flavor of artificial intelligence to the Garlicoin ecosystem. A tasteful blend of machine learning and blockchain technology.',
    contractAddress: 'Contract Address',
    copyTooltip: 'Copy address',
    copiedTooltip: 'Copied!',
    footer: '© 2025 GarlicAI'
  },
  zh: {
    title: 'GarlicAI',
    subtitle: '由 DeepSeek 驱动，以大蒜调味',
    description: '为 Garlicoin 生态系统带来人工智能的风味。机器学习和区块链技术的完美融合。',
    contractAddress: '合约地址',
    copyTooltip: '复制地址',
    copiedTooltip: '已复制！',
    footer: '© 2025 GarlicAI'
  }
};

const SimpleLanding = () => {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const contractAddress = "H1sWyyDceAPpGmMUxVBCHcR2LrCjz933pUyjWSLpump";
  const t = translations[language];

  const handleCopy = async () => {
    if (typeof navigator !== 'undefined') {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50 flex flex-col items-center px-4 py-8">
      {/* Language Toggle */}
      <div className="w-full max-w-5xl flex justify-end px-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Globe className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-600">{language === 'en' ? '中文' : 'English'}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full text-center mt-12 mb-auto">
        <div className="space-y-24">
          {/* Logo and Title Section */}
          <div className="space-y-12">
            {/* Logo/Icon */}
            <div className="flex justify-center">
              <div className="bg-yellow-500 rounded-full p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Brain className="h-14 w-14 text-white" />
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-8">
              <h1 className="text-6xl font-bold text-black">
                {t.title}
              </h1>

              <div className="space-y-6">
                <p className="text-2xl text-gray-800">
                  {t.subtitle}
                </p>

                <p className="text-gray-800 max-w-2xl mx-auto text-lg leading-relaxed">
                  {t.description}
                </p>
              </div>
            </div>
          </div>

          {/* Contract Address Box */}
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-10 shadow-sm border border-yellow-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.contractAddress}</h2>
            <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-5">
              <code className="font-mono text-gray-800 text-base break-all">
                {contractAddress}
              </code>
              <button
                onClick={handleCopy}
                className="ml-6 p-2.5 text-gray-500 hover:text-yellow-600 hover:scale-110 transition-all duration-300"
                title={copied ? t.copiedTooltip : t.copyTooltip}
              >
                {copied ? (
                  <Check className="h-6 w-6 text-green-500" />
                ) : (
                  <Copy className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Defense Strategy Link */}
          <div className="mt-16">
            <Link 
              href="/defense" 
              className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Shield className="h-5 w-5 mr-2" />
              Try Our Vampire Defense Generator
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center text-sm text-gray-700 mt-24 pt-8 border-t border-gray-100">
        {t.footer}
      </footer>
    </div>
  );
};

export default SimpleLanding; 