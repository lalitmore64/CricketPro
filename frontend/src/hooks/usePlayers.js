import { useState, useEffect, useCallback } from 'react';
import { playerApi } from '../api/playerApi';

export const usePlayers = (teamId = null) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = teamId ? await playerApi.getByTeamId(teamId) : await playerApi.getAll();
      setPlayers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch players');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { players, loading, error, refetch: fetchPlayers };
};
