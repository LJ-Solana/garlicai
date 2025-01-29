"use client";
import { useEffect, useState } from 'react';
import { getTotalBurned } from '@/utils/supabase';

export function BurnCounter() {
  const [totalBurned, setTotalBurned] = useState<number>(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const total = await getTotalBurned();
        setTotalBurned(total);
        setError(false);
      } catch (err) {
        console.error('Error fetching total burns:', err);
        setError(true);
      }
    };

    fetchTotal();
    
    // Update every minute instead of 30 seconds to reduce load
    const interval = setInterval(fetchTotal, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return null; // Hide component on error
  }

  return (
    <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-yellow-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Total GARLIC Burned</h2>
      <div className="text-2xl font-bold text-yellow-600">
        {totalBurned.toLocaleString()} GARLIC
      </div>
      <div className="text-sm text-gray-500 mt-1">🔥</div>
    </div>
  );
} 