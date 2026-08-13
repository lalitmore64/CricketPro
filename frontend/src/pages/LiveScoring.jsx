import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchApi } from '../api/matchApi';
import { inningsApi } from '../api/inningsApi';
import { playerApi } from '../api/playerApi';
import LiveScoreCard from '../components/match/LiveScoreCard';
import Scoreboard from '../components/match/Scoreboard';
import ScoringPanel from '../components/scoring/ScoringPanel';
import BallHistory from '../components/match/BallHistory';
import PlayerSelector from '../components/scoring/PlayerSelector';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { FileText, ArrowLeft, RefreshCw } from 'lucide-react';

const LiveScoring = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [innings, setInnings] = useState(null);
  const [scoreboard, setScoreboard] = useState(null);
  const [balls, setBalls] = useState([]);

  const [battingPlayers, setBattingPlayers] = useState([]);
  const [bowlingPlayers, setBowlingPlayers] = useState([]);

  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const [bowler, setBowler] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoringError, setScoringError] = useState(null);

  const initData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const matchData = await matchApi.getById(matchId);
      setMatch(matchData);

      const inningsList = matchData.innings || [];
      if (inningsList.length === 0) {
        setError('No active innings found for this match.');
        setLoading(false);
        return;
      }

      const currentInnings = inningsList[inningsList.length - 1];
      setInnings(currentInnings);

      const [sbData, ballsData, batPlayers, bowlPlayers] = await Promise.all([
        inningsApi.getScoreboard(currentInnings.id),
        inningsApi.getBallHistory(currentInnings.id),
        playerApi.getByTeamId(currentInnings.battingTeam.id),
        playerApi.getByTeamId(currentInnings.bowlingTeam.id),
      ]);

      setScoreboard(sbData);
      setBalls(ballsData);
      setBattingPlayers(batPlayers);
      setBowlingPlayers(bowlPlayers);

      if (sbData.striker) {
        const found = batPlayers.find((p) => p.id === sbData.striker.id);
        if (found) setStriker(found);
      }
      if (sbData.nonStriker) {
        const found = batPlayers.find((p) => p.id === sbData.nonStriker.id);
        if (found) setNonStriker(found);
      }
      if (sbData.bowler) {
        const found = bowlPlayers.find((p) => p.id === sbData.bowler.id);
        if (found) setBowler(found);
      }
    } catch (err) {
      setError(err.message || 'Failed to load live scoring dashboard');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    initData();
  }, [initData]);

  const handleRecordBall = async (ballPayload) => {
    if (!innings) return;
    setScoringError(null);
    try {
      const updatedScoreboard = await inningsApi.recordBall(innings.id, ballPayload);
      setScoreboard(updatedScoreboard);

      const updatedBalls = await inningsApi.getBallHistory(innings.id);
      setBalls(updatedBalls);

      if (updatedScoreboard.striker) {
        const found = battingPlayers.find((p) => p.id === updatedScoreboard.striker.id);
        if (found) setStriker(found);
      }
      if (updatedScoreboard.nonStriker) {
        const found = battingPlayers.find((p) => p.id === updatedScoreboard.nonStriker.id);
        if (found) setNonStriker(found);
      }
      if (updatedScoreboard.bowler) {
        const found = bowlingPlayers.find((p) => p.id === updatedScoreboard.bowler.id);
        if (found) setBowler(found);
      }
    } catch (err) {
      setScoringError(err.message || 'Failed to record delivery');
    }
  };

  if (loading) return <Loader message="Initializing live scoring console..." />;
  if (error) return <ErrorMessage message={error} onRetry={initData} />;
  if (!innings) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate(`/matches/${matchId}`)}>
          <ArrowLeft size={16} /> Back to Match
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={initData}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/matches/${matchId}/scorecard`)}>
            <FileText size={16} /> Match Scorecard
          </button>
        </div>
      </div>

      {scoringError && <ErrorMessage message={scoringError} />}

      {/* Top Scoreboard Banner */}
      <LiveScoreCard
        scoreboard={scoreboard}
        battingTeamName={innings.battingTeam?.name}
        bowlingTeamName={innings.bowlingTeam?.name}
      />

      {/* Current Striker / Non-Striker / Bowler Stats */}
      <Scoreboard
        striker={scoreboard?.striker}
        nonStriker={scoreboard?.nonStriker}
        bowler={scoreboard?.bowler}
      />

      {/* Player Selection Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <PlayerSelector
          title="Active Striker"
          availablePlayers={battingPlayers}
          currentId={striker?.id}
          excludeIds={nonStriker ? [nonStriker.id] : []}
          type="BATSMAN"
          onSelect={(id) => setStriker(battingPlayers.find((p) => p.id === id))}
        />

        <PlayerSelector
          title="Active Non-Striker"
          availablePlayers={battingPlayers}
          currentId={nonStriker?.id}
          excludeIds={striker ? [striker.id] : []}
          type="BATSMAN"
          onSelect={(id) => setNonStriker(battingPlayers.find((p) => p.id === id))}
        />

        <PlayerSelector
          title="Active Bowler"
          availablePlayers={bowlingPlayers}
          currentId={bowler?.id}
          type="BOWLER"
          onSelect={(id) => setBowler(bowlingPlayers.find((p) => p.id === id))}
        />
      </div>

      {/* Ball-by-ball Scoring Controls */}
      <ScoringPanel
        onRecordBall={handleRecordBall}
        striker={striker}
        nonStriker={nonStriker}
        bowler={bowler}
      />

      {/* Recent Deliveries List */}
      <BallHistory balls={balls} />
    </div>
  );
};

export default LiveScoring;
