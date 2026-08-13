import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import MatchStatus from './MatchStatus';

const MatchCard = ({ match }) => {
  const navigate = useNavigate();
  const { id, teamA, teamB, venue, matchDate, status, totalOvers, innings } = match;

  const latestInnings = innings && innings.length > 0 ? innings[innings.length - 1] : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <MatchStatus status={status} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
          {totalOvers} Overs Match
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '0.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
            <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{teamA?.name || 'Team A'}</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {teamA?.shortName}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)' }} />
            <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{teamB?.name || 'Team B'}</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {teamB?.shortName}
          </span>
        </div>
      </div>

      {latestInnings && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Score ({latestInnings.battingTeam?.shortName}):
          </span>
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
            {latestInnings.totalRuns}/{latestInnings.totalWickets} ({latestInnings.overs} ov)
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={14} /> {venue}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Calendar size={14} /> {new Date(matchDate).toLocaleDateString()}
        </span>
      </div>

      <button
        className="btn btn-secondary"
        style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
        onClick={() => navigate(`/matches/${id}`)}
      >
        View Match <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default MatchCard;
