"use client";
import React, { useState } from 'react';
import { Shield, ArrowLeft, Loader, Globe } from 'lucide-react';
import Link from 'next/link';
import { WalletButton } from './WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { burnTokens } from '@/utils/solana';
import { updateWalletScore } from '@/utils/supabase';
import { BurnCounter } from './BurnCounter';

const translations = {
  en: {
    title: 'Vampire Defense Generator',
    subtitle: 'Generate powerful garlic-based strategies to defend against vampires',
    generateButton: 'Generate Defense Strategy',
    generating: 'Generating...',
    backToHome: 'Back to Home',
    strategy: 'Strategy',
    garlicUsage: 'Garlic Usage',
    effectiveness: 'Effectiveness',
    effective: 'effective',
    error: 'Failed to generate strategy',
    connectWallet: 'Connect wallet to generate strategy',
    insufficientBalance: 'Insufficient GARLIC balance. Need 1000 GARLIC tokens.',
    burnFailed: 'Failed to burn tokens',
    burning: 'Burning 5000 GARLIC tokens 🔥',
    burnSuccess: 'Successfully burned 5000 GARLIC tokens 🔥',
    gameExplainer: {
      title: 'How it works',
      rules: [
        'Burn 5,000 GARLIC tokens to generate a vampire defense strategy',
        'Each strategy gets an effectiveness score (0-100%)',
        'Your wallet\'s average effectiveness score is tracked',
        'The wallet with the highest average score at the end of each day wins',
        'Daily winner receives the GARLIC escrow for that day'
      ],
      note: '* Daily competition resets at 00:00 UTC'
    }
  },
  zh: {
    title: '吸血鬼防御生成器',
    subtitle: '生成强大的大蒜防御策略来对抗吸血鬼',
    generateButton: '生成防御策略',
    generating: '生成中...',
    backToHome: '返回首页',
    strategy: '策略',
    garlicUsage: '大蒜使用方法',
    effectiveness: '效果',
    effective: '有效',
    error: '生成策略失败',
    connectWallet: '连接钱包以生成策略',
    insufficientBalance: 'GARLIC余额不足。需要1000个GARLIC代币。',
    burnFailed: '代币销毁失败',
    burning: '正在销毁 5000 个 GARLIC 代币 🔥',
    burnSuccess: '成功销毁 5000 个 GARLIC 代币 🔥',
    gameExplainer: {
      title: '游戏规则',
      rules: [
        '销毁 5,000 个 GARLIC 代币来生成吸血鬼防御策略',
        '每个策略都会获得效果评分（0-100%）',
        '系统会追踪你钱包的平均效果评分',
        '每天结束时平均分最高的钱包获胜',
        '每日获胜者将获得当天销毁的 GARLIC 代币'
      ],
      note: '* 每日比赛在 UTC 00:00 重置'
    }
  }
};

const VampireDefense = () => {
  const wallet = useWallet();
  const [strategy, setStrategy] = useState('');
  const [garlicUsage, setGarlicUsage] = useState('');
  const [effectiveness, setEffectiveness] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [isBurning, setIsBurning] = useState(false);
  const [burnSuccess, setBurnSuccess] = useState(false);
  const t = translations[language];

  const generateStrategy = async () => {
    if (!wallet.connected) {
      setError(t.connectWallet);
      return;
    }

    setLoading(true);
    setIsBurning(true);
    setBurnSuccess(false);
    
    try {
      // Burn tokens first
      await burnTokens(wallet, 1000);
      setBurnSuccess(true);

      // Then generate strategy
      const response = await fetch('/api/generate-defense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate strategy');
      }

      const data = await response.json();
      setStrategy(data.strategy);
      setGarlicUsage(data.garlicUsage);
      setEffectiveness(data.effectiveness);

      // Record the score with effectiveness
      if (wallet.publicKey) {
        await updateWalletScore(wallet.publicKey.toString(), data.effectiveness);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message.includes('burn') ? t.burnFailed : t.error);
    } finally {
      setLoading(false);
      setIsBurning(false);
      // Hide burn success message after 3 seconds
      setTimeout(() => setBurnSuccess(false), 3000);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToHome}
          </Link>

          <div className="flex items-center gap-4">
            <WalletButton />
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                {language === 'en' ? '中文' : 'English'}
              </span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center mt-12 space-y-12">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="bg-yellow-500 rounded-full p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Shield className="h-14 w-14 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-black">
              {t.title}
            </h1>
            <p className="text-xl text-gray-800">
              {t.subtitle}
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-yellow-100 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t.gameExplainer.title}
            </h2>
            <ul className="space-y-2">
              {t.gameExplainer.rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-4 italic">
              {t.gameExplainer.note}
            </p>
          </div>

          <BurnCounter />

          <button
            onClick={generateStrategy}
            disabled={loading}
            className="w-full max-w-md mx-auto py-3 px-6 bg-yellow-500 text-white rounded-lg flex items-center justify-center hover:bg-yellow-600 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {loading ? (
              <><Loader className="animate-spin h-5 w-5 mr-2" /> {t.generating}</>
            ) : (
              <><Shield className="h-5 w-5 mr-2" /> {t.generateButton}</>
            )}
          </button>

          {isBurning && (
            <div className="mt-4 text-orange-600 animate-pulse flex items-center justify-center">
              <span className="mr-2">{t.burning}</span>
            </div>
          )}

          {burnSuccess && (
            <div className="mt-4 text-green-600 flex items-center justify-center">
              <span className="mr-2">{t.burnSuccess}</span>
            </div>
          )}

          {error && (
            <div className="text-red-500">
              {error}
            </div>
          )}

          {strategy && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-10 shadow-sm border border-yellow-100 text-left space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.strategy}</h2>
                <p className="text-gray-800">{strategy}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.garlicUsage}</h2>
                <p className="text-gray-800">{garlicUsage}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.effectiveness}</h2>
                <div className="bg-yellow-100 rounded-full h-4">
                  <div 
                    className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${effectiveness}%` }}
                  />
                </div>
                <p className="text-right mt-2 text-gray-600">
                  {effectiveness}% {t.effective}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VampireDefense; 