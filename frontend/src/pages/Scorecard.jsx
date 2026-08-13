import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchApi } from '../api/matchApi';
import BattingTable from '../components/scorecard/BattingTable';
import BowlingTable from '../components/scorecard/BowlingTable';
import ExtrasCard from '../components/scorecard/ExtrasCard';
import MatchStatus from '../components/match/MatchStatus';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { ArrowLeft, MapPin, Calendar, Sparkles } from 'lucide-react';

const Scorecard = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [scorecardData, setScorecardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScorecard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchApi.getScorecard(matchId);
      setScorecardData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch match scorecard');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchScorecard();
  }, [fetchScorecard]);

  if (loading) return <Loader message="Loading match scorecard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchScorecard} />;
  if (!scorecardData) return null;

  const { teamA, teamB, venue, matchDate, matchStatus, totalOvers, inningsScorecards } = scorecardData;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate(`/matches/${matchId}`)}>
          <ArrowLeft size={16} /> Back to Match
        </button>

        {matchStatus === 'COMPLETED' && (
          <button className="btn btn-primary" onClick={() => navigate(`/matches/${matchId}/ai-summary`)}>
            <Sparkles size={16} /> AI Match Summary
          </button>
        )}
      </div>

      {/* Header Match Information */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{teamA} vs {teamB}</h1>
          <MatchStatus status={matchStatus} />
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} color="var(--primary)" /> {venue}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} color="var(--accent-blue)" /> {new Date(matchDate).toLocaleString()}
          </span>
          <span>{totalOvers} Overs Format</span>
        </div>
      </div>

      {/* Innings Scorecard Tabs & Tables */}
      {(!inningsScorecards || inningsScorecards.length === 0) ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-subtle)' }}>
          No innings scored yet for this match.
        </div>
      ) : (
        inningsScorecards.map((inn) => (
          <div key={inn.id} className="card" style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                  INNINGS {inn.inningsNumber}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  {inn.battingTeam?.name} Batting
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>
                  {inn.totalRuns}/{inn.totalWickets}
                </span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ({inn.overs} Overs)
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Batting Performance
              </h4>
              <BattingTable battingScorecard={inn.battingScorecard} />
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Bowling Figures
              </h4>
              <BowlingTable bowlingScorecard={inn.bowlingScorecard} />
            </div>

            <ExtrasCard bowlingScorecard={inn.bowlingScorecard} />
          </div>
        ))
      )}
    </div>
  );
};

export default Scorecard;
