import React, { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { matchApi } from '../api/matchApi';
import { teamApi } from '../api/teamApi';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { Calendar, MapPin, Trophy, Shield, Plus, Check } from 'lucide-react';

const CreateMatch = () => {
  const { teams, loading: teamsLoading, error: teamsError, refetch: refetchTeams } = useTeams();
  const navigate = useNavigate();

  const [teamAMode, setTeamAMode] = useState('select');
  const [teamBMode, setTeamBMode] = useState('select');

  const [selectedTeamAId, setSelectedTeamAId] = useState('');
  const [selectedTeamBId, setSelectedTeamBId] = useState('');

  const [customTeamAName, setCustomTeamAName] = useState('');
  const [customTeamAShort, setCustomTeamAShort] = useState('');

  const [customTeamBName, setCustomTeamBName] = useState('');
  const [customTeamBShort, setCustomTeamBShort] = useState('');

  const [venue, setVenue] = useState('');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 16));
  const [totalOvers, setTotalOvers] = useState(20);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let finalTeamAId = selectedTeamAId;
    let finalTeamBId = selectedTeamBId;

    try {
      setSubmitting(true);

      if (teamAMode === 'custom') {
        if (!customTeamAName.trim()) {
          setError('Please enter a valid name for Team A');
          setSubmitting(false);
          return;
        }
        const createdA = await teamApi.create({
          name: customTeamAName.trim(),
          shortName: (customTeamAShort.trim() || customTeamAName.substring(0, 3)).toUpperCase()
        });
        finalTeamAId = createdA.id.toString();
      }

      if (teamBMode === 'custom') {
        if (!customTeamBName.trim()) {
          setError('Please enter a valid name for Team B');
          setSubmitting(false);
          return;
        }
        const createdB = await teamApi.create({
          name: customTeamBName.trim(),
          shortName: (customTeamBShort.trim() || customTeamBName.substring(0, 3)).toUpperCase()
        });
        finalTeamBId = createdB.id.toString();
      }

      if (!finalTeamAId || !finalTeamBId) {
        setError('Please select or create both Team A and Team B');
        setSubmitting(false);
        return;
      }

      if (finalTeamAId === finalTeamBId) {
        setError('Team A and Team B cannot be the same team');
        setSubmitting(false);
        return;
      }

      if (parseInt(totalOvers, 10) <= 0) {
        setError('Total overs must be at least 1');
        setSubmitting(false);
        return;
      }

      const createdMatch = await matchApi.create({
        teamAId: parseInt(finalTeamAId, 10),
        teamBId: parseInt(finalTeamBId, 10),
        venue: venue.trim(),
        matchDate: matchDate,
        totalOvers: parseInt(totalOvers, 10),
      });

      navigate(`/matches/${createdMatch.id}`);
    } catch (err) {
      setError(err.message || 'Failed to schedule match');
    } finally {
      setSubmitting(false);
    }
  };

  if (teamsLoading) return <Loader message="Loading teams..." />;
  if (teamsError) return <ErrorMessage message={teamsError} />;

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Schedule New Match</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose existing teams or type new team names directly</p>
      </div>

      <div className="card">
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            
            {/* Team A Selection / Typing */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                  <Shield size={16} color="var(--primary)" /> Team A
                </label>
                <button
                  type="button"
                  style={{ background: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  onClick={() => setTeamAMode(teamAMode === 'select' ? 'custom' : 'select')}
                >
                  {teamAMode === 'select' ? <><Plus size={14} /> Type New Name</> : <><Check size={14} /> Select Existing</>}
                </button>
              </div>

              {teamAMode === 'select' && teams.length > 0 ? (
                <select
                  className="form-select"
                  required
                  value={selectedTeamAId}
                  onChange={(e) => setSelectedTeamAId(e.target.value)}
                >
                  <option value="">Select Existing Team A</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id} disabled={t.id.toString() === selectedTeamBId}>
                      {t.name} ({t.shortName})
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="Type Team A Name (e.g. India)"
                    value={customTeamAName}
                    onChange={(e) => setCustomTeamAName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    maxLength={10}
                    placeholder="Short Code (e.g. IND)"
                    value={customTeamAShort}
                    onChange={(e) => setCustomTeamAShort(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Team B Selection / Typing */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                  <Shield size={16} color="var(--accent-blue)" /> Team B
                </label>
                <button
                  type="button"
                  style={{ background: 'none', color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  onClick={() => setTeamBMode(teamBMode === 'select' ? 'custom' : 'select')}
                >
                  {teamBMode === 'select' ? <><Plus size={14} /> Type New Name</> : <><Check size={14} /> Select Existing</>}
                </button>
              </div>

              {teamBMode === 'select' && teams.length > 0 ? (
                <select
                  className="form-select"
                  required
                  value={selectedTeamBId}
                  onChange={(e) => setSelectedTeamBId(e.target.value)}
                >
                  <option value="">Select Existing Team B</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id} disabled={t.id.toString() === selectedTeamAId}>
                      {t.name} ({t.shortName})
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="Type Team B Name (e.g. Australia)"
                    value={customTeamBName}
                    onChange={(e) => setCustomTeamBName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    maxLength={10}
                    placeholder="Short Code (e.g. AUS)"
                    value={customTeamBShort}
                    onChange={(e) => setCustomTeamBShort(e.target.value)}
                  />
                </div>
              )}
            </div>

          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} /> Stadium Venue
            </label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Wankhede Stadium, Mumbai"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} /> Date & Time
              </label>
              <input
                type="datetime-local"
                className="form-input"
                required
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Trophy size={16} /> Total Overs
              </label>
              <input
                type="number"
                min="1"
                max="50"
                className="form-input"
                required
                value={totalOvers}
                onChange={(e) => setTotalOvers(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating Teams & Match...' : 'Schedule Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatch;
