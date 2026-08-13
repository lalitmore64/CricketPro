import React from 'react';

const ExtrasCard = ({ bowlingScorecard = [] }) => {
  const totalWides = bowlingScorecard.reduce((acc, b) => acc + (b.wides || 0), 0);
  const totalNoBalls = bowlingScorecard.reduce((acc, b) => acc + (b.noBalls || 0), 0);

  return (
    <div className="card" style={{ marginTop: '1.25rem', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        EXTRAS BREAKDOWN
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
        <span>Wides: <strong style={{ color: 'var(--primary)' }}>{totalWides}</strong></span>
        <span>No Balls: <strong style={{ color: 'var(--warning)' }}>{totalNoBalls}</strong></span>
      </div>
    </div>
  );
};

export default ExtrasCard;
