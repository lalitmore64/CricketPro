import React from 'react';

const BallHistory = ({ balls }) => {
  if (!balls || balls.length === 0) {
    return (
      <div className="card" style={{ padding: '1rem', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
        No deliveries recorded yet in this innings.
      </div>
    );
  }

  const recentBalls = balls.slice(-12);

  const getBallBadge = (ball) => {
    if (ball.wicket) {
      return { label: 'W', bg: 'var(--danger)', color: '#fff' };
    }
    if (ball.extraType === 'WIDE') {
      return { label: `WD${ball.totalRuns > 1 ? `+${ball.totalRuns - 1}` : ''}`, bg: 'var(--warning)', color: '#000' };
    }
    if (ball.extraType === 'NO_BALL') {
      return { label: `NB${ball.runsOffBat > 0 ? `+${ball.runsOffBat}` : ''}`, bg: 'var(--warning)', color: '#000' };
    }
    if (ball.extraType === 'BYE') {
      return { label: `B${ball.extraRuns}`, bg: '#64748b', color: '#fff' };
    }
    if (ball.extraType === 'LEG_BYE') {
      return { label: `LB${ball.extraRuns}`, bg: '#64748b', color: '#fff' };
    }
    if (ball.runsOffBat === 6) {
      return { label: '6', bg: 'var(--purple)', color: '#fff' };
    }
    if (ball.runsOffBat === 4) {
      return { label: '4', bg: 'var(--accent-blue)', color: '#fff' };
    }
    if (ball.runsOffBat === 0) {
      return { label: '•', bg: 'var(--bg-card-hover)', color: 'var(--text-muted)' };
    }
    return { label: `${ball.runsOffBat}`, bg: 'var(--bg-card-hover)', color: '#fff' };
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        RECENT DELIVERIES
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {recentBalls.map((ball, idx) => {
          const styleInfo = getBallBadge(ball);
          const isLatest = idx === recentBalls.length - 1;

          return (
            <div
              key={ball.id || idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                minWidth: '44px'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: styleInfo.bg,
                  color: styleInfo.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: isLatest ? '2px solid #fff' : 'none',
                  boxShadow: isLatest ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
                  transform: isLatest ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease'
                }}
              >
                {styleInfo.label}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                {ball.overNumber}.{ball.ballNumber}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BallHistory;
