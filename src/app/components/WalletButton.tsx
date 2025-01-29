"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { getTokenBalance } from '@/utils/solana';

require('@solana/wallet-adapter-react-ui/styles.css');

export function WalletButton() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      if (publicKey) {
        const tokenBalance = await getTokenBalance(publicKey);
        setBalance(tokenBalance);
      }
    }
    fetchBalance();
    setMounted(true);
  }, [publicKey]);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton className="!bg-yellow-500 hover:!bg-yellow-600 transition-colors" />
      {balance !== null && (
        <div className="text-sm text-gray-600">
          {balance.toLocaleString()} GARLIC
        </div>
      )}
    </div>
  );
} 