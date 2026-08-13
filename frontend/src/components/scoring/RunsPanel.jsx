import React from 'react';

const RunsPanel = ({ onScoreRun, disabled }) => {
  const runs = [0, 1, 2, 3, 4, 6];

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>
        RUNS OFF BAT
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '0.75rem'
      }}>
        {runs.map((r) => {
          let bg = '#e2e8f0';
          let textColor = '#0f172a';
          let border = '1px solid #cbd5e1';
          let boxShadow = '0 2px 4px rgba(0,0,0,0.05)';

          if (r === 4) {
            bg = '#f59e0b';
            textColor = '#000000';
            border = '1px solid #d97706';
            boxShadow = '0 4px 10px rgba(245, 158, 11, 0.35)';
          } else if (r === 6) {
            bg = '#2563eb';
            textColor = '#ffffff';
            border = '1px solid #1d4ed8';
            boxShadow = '0 4px 10px rgba(37, 99, 235, 0.35)';
          }

          return (
            <button
              key={r}
              disabled={disabled}
              onClick={() => onScoreRun(r)}
              style={{
                backgroundColor: bg,
                color: textColor,
                border: border,
                boxShadow: boxShadow,
                padding: '1.1rem 0',
                borderRadius: 'var(--radius-md)',
                fontSize: '1.6rem',
                fontWeight: 800,
                opacity: disabled ? 0.4 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              {r === 0 ? '•' : r}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RunsPanel;
