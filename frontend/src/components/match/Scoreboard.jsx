import React from 'react';
import { Target, Shield } from 'lucide-react';

const Scoreboard = ({ striker, nonStriker, bowler }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.5rem'
    }}>
      {/* Striker Card */}
      <div className="card" style={{
        border: '2px solid var(--primary)',
        boxShadow: '0 4px 14px var(--primary-glow)',
        backgroundColor: 'rgba(16, 185, 129, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
            ★ STRIKER
          </span>
          <Target size={18} color="var(--primary)" />
        </div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {striker?.name || 'Select Striker'}
        </h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {striker?.runs ?? 0}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ({striker?.ballsFaced ?? 0} balls)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
          <span>4s: <strong style={{ color: 'var(--text-main)' }}>{striker?.fours ?? 0}</strong></span>
          <span>6s: <strong style={{ color: 'var(--text-main)' }}>{striker?.sixes ?? 0}</strong></span>
          <span>SR: <strong style={{ color: 'var(--primary)' }}>{striker?.strikeRate ?? 0.0}</strong></span>
        </div>
      </div>

      {/* Non-Striker Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-subtle)', letterSpacing: '0.05em' }}>
            NON-STRIKER
          </span>
        </div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {nonStriker?.name || 'Select Non-Striker'}
        </h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {nonStriker?.runs ?? 0}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ({nonStriker?.ballsFaced ?? 0} balls)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
          <span>4s: <strong style={{ color: 'var(--text-main)' }}>{nonStriker?.fours ?? 0}</strong></span>
          <span>6s: <strong style={{ color: 'var(--text-main)' }}>{nonStriker?.sixes ?? 0}</strong></span>
          <span>SR: <strong style={{ color: 'var(--text-main)' }}>{nonStriker?.strikeRate ?? 0.0}</strong></span>
        </div>
      </div>

      {/* Bowler Card */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.05em' }}>
            CURRENT BOWLER
          </span>
          <Shield size={18} color="var(--accent-blue)" />
        </div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {bowler?.name || 'Select Bowler'}
        </h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {bowler?.wickets ?? 0} - {bowler?.runsConceded ?? 0}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            ({bowler?.overs ?? '0.0'} ov)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
          <span>Eco: <strong style={{ color: 'var(--accent-blue)' }}>{bowler?.economy ?? 0.0}</strong></span>
          <span>Wides: <strong style={{ color: 'var(--text-main)' }}>{bowler?.wides ?? 0}</strong></span>
          <span>NB: <strong style={{ color: 'var(--text-main)' }}>{bowler?.noBalls ?? 0}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
