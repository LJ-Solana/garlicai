import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createBurnInstruction, getAccount, getAssociatedTokenAddress } from '@solana/spl-token';

const GARLIC_TOKEN = new PublicKey('H1sWyyDceAPpGmMUxVBCHcR2LrCjz933pUyjWSLpump');
const connection = new Connection('https://violet-hqukll-fast-mainnet.helius-rpc.com');

export async function getTokenBalance(walletAddress: PublicKey): Promise<number> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      GARLIC_TOKEN,
      walletAddress
    );
    const account = await getAccount(connection, tokenAccount);
    return Number(account.amount);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
}

export async function burnTokens(wallet: any, amount: number) {
  if (!wallet.publicKey) throw new Error('Wallet not connected');

  // Check SOL balance first
  const solBalance = await connection.getBalance(wallet.publicKey);
  if (solBalance < 5000) {
    throw new Error('Not enough SOL for transaction fees. Need at least 0.000005 SOL');
  }

  const tokenAccount = await getAssociatedTokenAddress(
    GARLIC_TOKEN,
    wallet.publicKey
  );

  // Check balance before burning
  const balance = await getTokenBalance(wallet.publicKey);
  if (balance < amount) {
    throw new Error(`Insufficient balance: ${balance} GARLIC`);
  }

  // Convert 10000 GARLIC to the correct amount with 9 decimals
  const burnAmount = 5 * Math.pow(10, 9);

  try {
    const burnIx = createBurnInstruction(
      tokenAccount,
      GARLIC_TOKEN,
      wallet.publicKey,
      burnAmount,
      [],
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(burnIx);
    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Burn failed:', error);
    throw error;
  }
} 