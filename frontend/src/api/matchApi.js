import api from './axiosConfig';

export const matchApi = {
  getAll: async () => {
    const res = await api.get('/matches');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/matches/${id}`);
    return res.data;
  },
  create: async (matchData) => {
    const res = await api.post('/matches', matchData);
    return res.data;
  },
  start: async (id) => {
    const res = await api.post(`/matches/${id}/start`);
    return res.data;
  },
  complete: async (id) => {
    const res = await api.post(`/matches/${id}/complete`);
    return res.data;
  },
  createInnings: async (matchId, inningsData) => {
    const res = await api.post(`/matches/${matchId}/innings`, inningsData);
    return res.data;
  },
  getScorecard: async (matchId) => {
    const res = await api.get(`/matches/${matchId}/scorecard`);
    return res.data;
  },
};
