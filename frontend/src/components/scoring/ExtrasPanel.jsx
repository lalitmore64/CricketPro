import React, { useState } from 'react';

const ExtrasPanel = ({ onScoreExtra, disabled }) => {
  const [activeType, setActiveType] = useState(null);
  const [runsOffBat, setRunsOffBat] = useState(0);
  const [extraRuns, setExtraRuns] = useState(1);

  const handleApplyExtra = (type) => {
    if (activeType === type) {
      setActiveType(null);
    } else {
      setActiveType(type);
      setRunsOffBat(0);
      setExtraRuns(1);
    }
  };

  const handleConfirm = () => {
    if (!activeType) return;
    onScoreExtra({
      extraType: activeType,
      runsOffBat: parseInt(runsOffBat, 10),
      extraRuns: parseInt(extraRuns, 10)
    });
    setActiveType(null);
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        EXTRAS
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.75rem'
      }}>
        {['WIDE', 'NO_BALL', 'BYE', 'LEG_BYE'].map((type) => {
          const isActive = activeType === type;
          return (
            <button
              key={type}
              disabled={disabled}
              onClick={() => handleApplyExtra(type)}
              style={{
                backgroundColor: isActive ? 'var(--warning)' : 'var(--bg-card-hover)',
                color: isActive ? '#000' : 'var(--text-main)',
                border: '1px solid var(--border-light)',
                padding: '0.75rem 0',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {type.replace('_', ' ')}
            </button>
          );
        })}
      </div>

      {activeType && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--warning)', fontSize: '0.9rem' }}>
              Configure {activeType.replace('_', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {activeType === 'NO_BALL' && (
              <div style={{ flex: 1, minWidth: '140px' }}>
                <label className="form-label">Runs off bat</label>
                <select
                  className="form-select"
                  value={runsOffBat}
                  onChange={(e) => setRunsOffBat(e.target.value)}
                >
                  <option value={0}>0 runs</option>
                  <option value={1}>1 run</option>
                  <option value={2}>2 runs</option>
                  <option value={3}>3 runs</option>
                  <option value={4}>4 runs (Boundary)</option>
                  <option value={6}>6 runs (Six)</option>
                </select>
              </div>
            )}

            <div style={{ flex: 1, minWidth: '140px' }}>
              <label className="form-label">Total Extra Penalty/Ran</label>
              <select
                className="form-select"
                value={extraRuns}
                onChange={(e) => setExtraRuns(e.target.value)}
              >
                <option value={1}>1 run</option>
                <option value={2}>2 runs</option>
                <option value={3}>3 runs</option>
                <option value={4}>4 runs</option>
                <option value={5}>5 runs</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setActiveType(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleConfirm}>Submit {activeType}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtrasPanel;
