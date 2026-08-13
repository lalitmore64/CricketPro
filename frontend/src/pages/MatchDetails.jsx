import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchApi } from '../api/matchApi';
import { playerApi } from '../api/playerApi';
import MatchStatus from '../components/match/MatchStatus';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { MapPin, Calendar, Play, CheckCircle, FileText, Sparkles, X, UserPlus, Users, Activity } from 'lucide-react';

const MatchDetails = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState('BATSMAN');
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [playerError, setPlayerError] = useState('');

  const [isInningsModalOpen, setIsInningsModalOpen] = useState(false);
  const [battingTeamId, setBattingTeamId] = useState('');
  const [bowlingTeamId, setBowlingTeamId] = useState('');
  const [inningsNumber, setInningsNumber] = useState(1);
  const [creatingInnings, setCreatingInnings] = useState(false);
  const [inningsError, setInningsError] = useState('');

  const fetchMatchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchApi.getById(matchId);
      setMatch(data);

      if (data.teamA && data.teamB) {
        setBattingTeamId(data.teamA.id.toString());
        setBowlingTeamId(data.teamB.id.toString());
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch match details');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatchDetails();
  }, [fetchMatchDetails]);

  const openAddPlayerModal = (team) => {
    setSelectedTeamForPlayer(team);
    setNewPlayerName('');
    setNewPlayerRole('BATSMAN');
    setPlayerError('');
    setIsPlayerModalOpen(true);
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerName.trim() || !selectedTeamForPlayer) return;

    try {
      setAddingPlayer(true);
      setPlayerError('');
      await playerApi.create({
        name: newPlayerName.trim(),
        role: newPlayerRole,
        teamId: selectedTeamForPlayer.id
      });
      setIsPlayerModalOpen(false);
      fetchMatchDetails();
    } catch (err) {
      setPlayerError(err.message || 'Failed to add player to squad');
    } finally {
      setAddingPlayer(false);
    }
  };

  const handleStartMatch = async () => {
    try {
      await matchApi.start(matchId);
      setIsInningsModalOpen(true);
    } catch (err) {
      alert(err.message || 'Failed to start match');
    }
  };

  const handleCompleteMatch = async () => {
    try {
      await matchApi.complete(matchId);
      fetchMatchDetails();
    } catch (err) {
      alert(err.message || 'Failed to complete match');
    }
  };

  const handleCreateInnings = async (e) => {
    e.preventDefault();
    setInningsError('');

    if (battingTeamId === bowlingTeamId) {
      setInningsError('Batting team and Bowling team cannot be the same');
      return;
    }

    try {
      setCreatingInnings(true);
      await matchApi.createInnings(matchId, {
        battingTeamId: parseInt(battingTeamId, 10),
        bowlingTeamId: parseInt(bowlingTeamId, 10),
        inningsNumber: parseInt(inningsNumber, 10)
      });
      setIsInningsModalOpen(false);
      navigate(`/matches/${matchId}/live`);
    } catch (err) {
      setInningsError(err.message || 'Failed to create innings');
    } finally {
      setCreatingInnings(false);
    }
  };

  if (loading) return <Loader message="Fetching match overview..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMatchDetails} />;
  if (!match) return null;

  const { teamA, teamB, venue, matchDate, status, totalOvers, innings } = match;
  const activeInnings = innings && innings.length > 0 ? innings[innings.length - 1] : null;

  return (
    <div>
      {/* Header Overview Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <MatchStatus status={status} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            {totalOvers} Overs Limit
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem 1rem',
          backgroundColor: 'rgba(248, 250, 252, 0.8)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem'
        }}>
          {/* Team A */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{teamA?.name}</h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>{teamA?.shortName}</span>
            <div style={{ marginTop: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => openAddPlayerModal(teamA)}
              >
                <UserPlus size={14} /> Add Player to {teamA?.shortName}
              </button>
            </div>
          </div>

          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-subtle)' }}>VS</div>

          {/* Team B */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{teamB?.name}</h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', fontWeight: 700 }}>{teamB?.shortName}</span>
            <div style={{ marginTop: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => openAddPlayerModal(teamB)}
              >
                <UserPlus size={14} /> Add Player to {teamB?.shortName}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} color="var(--primary)" /> {venue}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} color="var(--accent-blue)" /> {new Date(matchDate).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Direct Live Scoring & Analytics Control Panel */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Live Scoring & Analytics Hub
        </h3>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {status === 'UPCOMING' && (
            <button className="btn btn-primary" onClick={handleStartMatch}>
              <Play size={18} /> Start Match & Open Live Scoring
            </button>
          )}

          {status === 'LIVE' && (
            <>
              <button className="btn btn-primary" onClick={() => navigate(`/matches/${matchId}/live`)}>
                <Activity size={18} /> Open Live Scoring Console
              </button>

              <button className="btn btn-secondary" onClick={() => navigate(`/matches/${matchId}/scorecard`)}>
                <FileText size={18} /> View Scorecard & Analytics
              </button>

              <button className="btn btn-danger" onClick={handleCompleteMatch}>
                <CheckCircle size={18} /> Complete Match
              </button>
            </>
          )}

          {status === 'COMPLETED' && (
            <>
              <button className="btn btn-primary" onClick={() => navigate(`/matches/${matchId}/scorecard`)}>
                <FileText size={18} /> View Final Scorecard
              </button>

              <button className="btn btn-secondary" onClick={() => navigate(`/matches/${matchId}/ai-summary`)}>
                <Sparkles size={18} color="var(--warning)" /> AI Match Analytics Summary
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Add Player Modal */}
      {isPlayerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Add Player to {selectedTeamForPlayer?.name}
              </h3>
              <button onClick={() => setIsPlayerModalOpen(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {playerError && <ErrorMessage message={playerError} />}

            <form onSubmit={handleAddPlayer}>
              <div className="form-group">
                <label className="form-label">Player Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jasprit Bumrah"
                  className="form-input"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Player Role</label>
                <select
                  className="form-select"
                  value={newPlayerRole}
                  onChange={(e) => setNewPlayerRole(e.target.value)}
                >
                  <option value="BATSMAN">Batsman</option>
                  <option value="BOWLER">Bowler</option>
                  <option value="ALL_ROUNDER">All Rounder</option>
                  <option value="WICKET_KEEPER">Wicket Keeper</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsPlayerModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={addingPlayer}>
                  {addingPlayer ? 'Adding Player...' : 'Save Player to Squad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Innings Setup Modal */}
      {isInningsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Setup Match Innings</h3>
              <button onClick={() => setIsInningsModalOpen(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {inningsError && <ErrorMessage message={inningsError} />}

            <form onSubmit={handleCreateInnings}>
              <div className="form-group">
                <label className="form-label">Innings Number</label>
                <select
                  className="form-select"
                  value={inningsNumber}
                  onChange={(e) => setInningsNumber(e.target.value)}
                >
                  <option value={1}>Innings 1</option>
                  <option value={2}>Innings 2</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Batting Team</label>
                <select
                  className="form-select"
                  required
                  value={battingTeamId}
                  onChange={(e) => {
                    setBattingTeamId(e.target.value);
                    if (e.target.value === teamA.id.toString()) setBowlingTeamId(teamB.id.toString());
                    else setBowlingTeamId(teamA.id.toString());
                  }}
                >
                  <option value={teamA.id}>{teamA.name} ({teamA.shortName})</option>
                  <option value={teamB.id}>{teamB.name} ({teamB.shortName})</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bowling Team</label>
                <select className="form-select" disabled value={bowlingTeamId}>
                  <option value={teamA.id}>{teamA.name} ({teamA.shortName})</option>
                  <option value={teamB.id}>{teamB.name} ({teamB.shortName})</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsInningsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creatingInnings}>
                  {creatingInnings ? 'Creating...' : 'Start Live Scoring'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetails;
