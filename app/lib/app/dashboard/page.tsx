'use client';

import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function MerchantDashboard() {
  const [amount, setAmount] = useState('');
  const [itemName, setItemName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !itemName) return;
    
    const randomId = Math.random().toString(36).substring(7);
    const link = `${window.location.origin}/pay/${randomId}?amount=${amount}&item=${encodeURIComponent(itemName)}`;
    setGeneratedLink(link);
  };

  return (
    <div style={{ background: '#09090b', color: '#fafafa', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #27272a', paddingBottom: '16px', marginBottom: '32px' }}>
        <h1 style={{ color: '#22d3ee', fontWeight: '900', letterSpacing: '1px', fontSize: '20px' }}>CRYON DASHBOARD</h1>
        <WalletMultiButton />
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: '#18181b', padding: '20px', borderRadius: '16px', border: '1px solid #27272a' }}>
          <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase' }}>Total Settled Volume</span>
          <h3 style={{ fontSize: '28px', color: '#22d3ee', margin: '8px 0 0 0' }}>12,450.00 USDC</h3>
        </div>

        <div style={{ background: '#18181b', padding: '24px', borderRadius: '16px', border: '1px solid #27272a' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '18px', color: '#fff' }}>Create Quick Invoice</h2>
          <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="text" placeholder="Service / Product Name" value={itemName} onChange={(e) => setItemName(e.target.value)}
              style={{ width: '100%', padding: '14px', background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff', boxSizing: 'border-box' }}
            />
            <input 
              type="number" placeholder="Amount in USD" value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: '14px', background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff', boxSizing: 'border-box' }}
            />
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#22d3ee', color: '#09090b', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px' }}>
              Generate Payment Link
            </button>
          </form>

          {generatedLink && (
            <div style={{ marginTop: '16px', padding: '14px', background: '#09090b', border: '1px solid rgba(34, 211, 238, 0.3)', borderRadius: '12px' }}>
              <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '0 0 6px 0' }}>Copy this secure link for client:</p>
              <input type="text" readOnly value={generatedLink} style={{ width: '100%', background: 'transparent', color: '#22d3ee', border: 'none', outline: 'none', fontFamily: 'monospace', fontSize: '12px' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

