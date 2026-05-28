'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createCryonPayment, listenToTransaction } from '../../../lib/solana-pay';

export default function PremiumCheckoutPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const searchParams = useSearchParams();

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [txSignature, setTxSignature] = useState('');

  const itemName = searchParams.get('item') || 'Sovereign Identity Privacy Premium';
  const amount = parseFloat(searchParams.get('amount') || '19.99');
  const merchantWallet = "DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5"; 

  const handlePayment = async () => {
    if (!publicKey) return alert("Please connect your wallet first!");
    setPaymentStatus('processing');
    try {
      const transaction = await createCryonPayment({
        customerWallet: publicKey.toBase58(),
        merchantWallet: merchantWallet,
        amountInUSD: amount
      });
      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);

      await listenToTransaction(signature, (isSuccess) => {
        if (isSuccess) setPaymentStatus('success');
        else setPaymentStatus('error');
      });
    } catch (error) {
      setPaymentStatus('error');
    }
  };

  return (
    <div style={{
      background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #09090b 100%)',
      color: '#f4f4f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(20, 20, 25, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box'
      }}>
        {paymentStatus === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid #10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              color: '#10b981',
              fontSize: '28px',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
            }}>SUCCESS</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', margin: '0 0 8px 0' }}>Payment Verified</h2>
            <div style={{ background: '#09090b', padding: '12px', borderRadius: '12px', border: '1px solid #27272a' }}>
              <p style={{ fontSize: '11px', color: '#22d3ee', fontFamily: 'monospace', margin: '0', wordBreak: 'break-all' }}>{txSignature}</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '2px', color: '#fff' }}>CRYON PAY</span>
              <WalletMultiButton />
            </div>
            <hr style={{ border: '0', borderTop: '1px solid rgba(255, 255, 255, 0.06)', margin: 0 }} />
            <div>
              <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase' }}>Order Summary</span>
              <p style={{ margin: '6px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#e4e4e7' }}>{itemName}</p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.03) 0%, rgba(0, 0, 0, 0.4) 100%)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(34, 211, 238, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#a1a1aa', fontSize: '14px' }}>Amount Due:</span>
              <span style={{ color: '#22d3ee', fontSize: '24px', fontWeight: '900' }}>${amount} <span style={{ fontSize: '12px', color: '#71717a' }}>USDC</span></span>
            </div>
            <button onClick={handlePayment} disabled={paymentStatus === 'processing'} style={{
              width: '100%', padding: '16px', background: '#22d3ee', color: '#09090b', fontWeight: '700', fontSize: '15px', border: 'none', borderRadius: '14px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(34, 211, 238, 0.3)'
            }}>
              {paymentStatus === 'processing' ? 'Securing Settlement...' : 'Authorize & Pay Securely'}
            </button>
          </div>
        )}
      </div>
      <div style={{ marginTop: '24px', zIndex: 1, textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: '#3f3f46', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Secured Non-Custodial Sovereign Architecture
        </p>
      </div>
    </div>
  );
}

