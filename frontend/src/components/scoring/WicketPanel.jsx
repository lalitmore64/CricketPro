import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const WicketPanel = ({ isOpen, onClose, onConfirmWicket, striker, nonStriker }) => {
  const [wicketType, setWicketType] = useState('BOWLED');
  const [dismissedId, setDismissedId] = useState(striker?.id || '');

  if (!isOpen) return null;

  const wicketTypes = [
    { value: 'BOWLED', label: 'Bowled' },
    { value: 'CAUGHT', label: 'Caught' },
    { value: 'LBW', label: 'LBW' },
    { value: 'RUN_OUT', label: 'Run Out' },
    { value: 'STUMPED', label: 'Stumped' },
    { value: 'HIT_WICKET', label: 'Hit Wicket' },
    { value: 'RETIRED_HURT', label: 'Retired Hurt' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmWicket({
      wicketType,
      dismissedPlayerId: parseInt(dismissedId || striker?.id, 10)
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
            <AlertCircle size={22} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>WICKET DISMISSAL</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Dismissal Type</label>
            <select
              className="form-select"
              value={wicketType}
              onChange={(e) => setWicketType(e.target.value)}
            >
              {wicketTypes.map((wt) => (
                <option key={wt.value} value={wt.value}>
                  {wt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dismissed Batsman</label>
            <select
              className="form-select"
              value={dismissedId || striker?.id}
              onChange={(e) => setDismissedId(e.target.value)}
            >
              {striker && <option value={striker.id}>{striker.name} (Striker)</option>}
              {nonStriker && <option value={nonStriker.id}>{nonStriker.name} (Non-Striker)</option>}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              Confirm Wicket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WicketPanel;
