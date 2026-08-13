import React, { useState } from 'react';
import { UserCheck, Shield } from 'lucide-react';

const PlayerSelector = ({
  title,
  availablePlayers,
  onSelect,
  currentId,
  excludeIds = [],
  type = 'BATSMAN'
}) => {
  const [selectedId, setSelectedId] = useState(currentId || '');

  const filteredPlayers = availablePlayers.filter(
    (p) => !excludeIds.includes(p.id) || p.id === currentId
  );

  const handleSave = () => {
    if (!selectedId) return;
    onSelect(parseInt(selectedId, 10));
  };

  return (
    <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {type === 'BOWLER' ? <Shield size={16} color="var(--accent-blue)" /> : <UserCheck size={16} color="var(--primary)" />}
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          {title}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <select
          className="form-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Select Player --</option>
          {filteredPlayers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.role})
            </option>
          ))}
        </select>
        <button
          className="btn btn-secondary"
          disabled={!selectedId}
          onClick={handleSave}
          style={{ whiteSpace: 'nowrap' }}
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default PlayerSelector;
