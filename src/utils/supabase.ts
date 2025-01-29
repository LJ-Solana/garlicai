import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface WalletScore {
  wallet_address: string;
  total_burns: number;
  total_strategies: number;
  total_effectiveness: number;
  average_effectiveness: number;
  highest_effectiveness: number;
  last_strategy_date: string;
}

export async function updateWalletScore(walletAddress: string, effectiveness: number) {
  // First get existing record
  const { data: existing } = await supabase
    .from('wallet_scores')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  const newRecord = {
    wallet_address: walletAddress,
    total_burns: (existing?.total_burns || 0) + 1,
    total_strategies: (existing?.total_strategies || 0) + 1,
    total_effectiveness: (existing?.total_effectiveness || 0) + effectiveness,
    average_effectiveness: 0, // Will be calculated
    highest_effectiveness: Math.max(existing?.highest_effectiveness || 0, effectiveness),
    last_strategy_date: new Date().toISOString(),
  };

  // Calculate average
  newRecord.average_effectiveness = 
    newRecord.total_effectiveness / newRecord.total_strategies;

  const { data, error } = await supabase
    .from('wallet_scores')
    .upsert(newRecord, {
      onConflict: 'wallet_address',
    });

  if (error) {
    console.error('Error updating score:', error);
    throw error;
  }

  return data;
}

export async function getTotalBurned(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('wallet_scores')
      .select('total_burns');

    if (error) {
      console.error('Error getting total burns:', error);
      return 0;
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format from Supabase');
      return 0;
    }

    const totalBurns = data.reduce((sum, record) => {
      const burns = record.total_burns || 0;
      return sum + burns;
    }, 0);

    return totalBurns * 5000; // Convert to GARLIC tokens
  } catch (error) {
    console.error('Failed to fetch total burns:', error);
    return 0;
  }
} 