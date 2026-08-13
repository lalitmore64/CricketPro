import React from 'react';
import { useMatches } from '../hooks/useMatches';
import MatchCard from '../components/match/MatchCard';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { Trophy, Activity, Calendar, CheckCircle2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { matches, loading, error, refetch } = useMatches();
  const navigate = useNavigate();

  if (loading) return <Loader message="Fetching cricket matches..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const liveMatches = matches.filter((m) => m.status === 'LIVE');
  const upcomingMatches = matches.filter((m) => m.status === 'UPCOMING');
  const completedMatches = matches.filter((m) => m.status === 'COMPLETED');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Matches Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time live scoring and match metrics</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/matches/create')}>
          <Plus size={18} /> Schedule Match
        </button>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 700 }}>TOTAL MATCHES</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{matches.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '3px solid var(--danger)' }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 700 }}>LIVE NOW</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)' }}>{liveMatches.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 700 }}>UPCOMING</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{upcomingMatches.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 700 }}>COMPLETED</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{completedMatches.length}</div>
          </div>
        </div>
      </div>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
            Live Matches
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {liveMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}

      {/* All / Recent Matches Section */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>All Matches</h2>
        {matches.length === 0 ? (
          <div className="card" style={{ textCenter: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No matches scheduled yet.</p>
            <button className="btn btn-primary" onClick={() => navigate('/matches/create')}>
              Create Your First Match
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
