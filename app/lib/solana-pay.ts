import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey('DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5');
export const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

interface PaymentRequest {
  customerWallet: string;
  merchantWallet: string;
  amountInUSD: number;
}

export async function createCryonPayment(request: PaymentRequest): Promise<Transaction> {
  const customerPubKey = new PublicKey(request.customerWallet);
  const merchantPubKey = new PublicKey(request.merchantWallet);
  const lamports = request.amountInUSD * 10000000; 

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: customerPubKey,
      toPubkey: merchantPubKey,
      lamports: lamports,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = customerPubKey;
  return transaction;
}

export async function listenToTransaction(signature: string, callback: (success: boolean) => void) {
  try {
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    if (confirmation.value.err === null) {
      callback(true);
    } else {
      callback(false);
    }
  } catch (error) {
    console.error(error);
    callback(false);
  }
}

