import React from 'react';

const LiveScoreCard = ({ scoreboard, battingTeamName, bowlingTeamName }) => {
  if (!scoreboard) return null;

  const { score, overs } = scoreboard;
  
  const totalRuns = parseInt(score?.split('/')[0] || 0, 10);
  const overParts = overs ? overs.split('.') : ['0', '0'];
  const legalBalls = (parseInt(overParts[0], 10) * 6) + parseInt(overParts[1] || 0, 10);
  const crr = legalBalls > 0 ? ((totalRuns / legalBalls) * 6).toFixed(2) : '0.00';

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      color: '#ffffff',
      border: 'none',
      marginBottom: '1.5rem',
      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)'
    }}>
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}>
              LIVE SCORING CONSOLE
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700 }}>
              {battingTeamName || 'Batting Team'} vs {bowlingTeamName || 'Bowling Team'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontSize: '3.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit' }}>
              {score || '0/0'}
            </span>
            <span style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>
              {overs || '0.0'} Overs
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700 }}>CURRENT RUN RATE</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>{crr}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScoreCard;
