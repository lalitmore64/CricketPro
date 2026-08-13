import React, { useState } from 'react';
import RunsPanel from './RunsPanel';
import ExtrasPanel from './ExtrasPanel';
import WicketPanel from './WicketPanel';
import { AlertTriangle, Disc } from 'lucide-react';

const ScoringPanel = ({
  onRecordBall,
  striker,
  nonStriker,
  bowler,
  disabled
}) => {
  const [isWicketModalOpen, setIsWicketModalOpen] = useState(false);

  const handleNormalRun = (runsOffBat) => {
    if (!striker || !nonStriker || !bowler) return;
    onRecordBall({
      strikerId: striker.id,
      nonStrikerId: nonStriker.id,
      bowlerId: bowler.id,
      runsOffBat: runsOffBat,
      extraType: 'NONE',
      extraRuns: 0,
      wicket: false
    });
  };

  const handleExtraRun = ({ extraType, runsOffBat, extraRuns }) => {
    if (!striker || !nonStriker || !bowler) return;
    onRecordBall({
      strikerId: striker.id,
      nonStrikerId: nonStriker.id,
      bowlerId: bowler.id,
      runsOffBat: runsOffBat || 0,
      extraType: extraType,
      extraRuns: extraRuns || 0,
      wicket: false
    });
  };

  const handleConfirmWicket = ({ wicketType, dismissedPlayerId }) => {
    if (!striker || !nonStriker || !bowler) return;
    onRecordBall({
      strikerId: striker.id,
      nonStrikerId: nonStriker.id,
      bowlerId: bowler.id,
      runsOffBat: 0,
      extraType: 'NONE',
      extraRuns: 0,
      wicket: true,
      wicketType: wicketType,
      dismissedPlayerId: dismissedPlayerId
    });
  };

  const isScoringDisabled = disabled || !striker || !nonStriker || !bowler;

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      {isScoringDisabled && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--warning)',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.25rem'
        }}>
          <AlertTriangle size={16} />
          Please select Striker, Non-Striker, and Bowler before scoring.
        </div>
      )}

      <RunsPanel onScoreRun={handleNormalRun} disabled={isScoringDisabled} />
      <ExtrasPanel onScoreExtra={handleExtraRun} disabled={isScoringDisabled} />

      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
        <button
          disabled={isScoringDisabled}
          onClick={() => setIsWicketModalOpen(true)}
          className="btn btn-danger"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.1rem',
            fontWeight: 800,
            justifyContent: 'center',
            opacity: isScoringDisabled ? 0.5 : 1
          }}
        >
          <Disc size={20} /> WICKET OUT
        </button>
      </div>

      <WicketPanel
        isOpen={isWicketModalOpen}
        onClose={() => setIsWicketModalOpen(false)}
        onConfirmWicket={handleConfirmWicket}
        striker={striker}
        nonStriker={nonStriker}
      />
    </div>
  );
};

export default ScoringPanel;
