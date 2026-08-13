import api from './axiosConfig';

export const playerApi = {
  getAll: async () => {
    const res = await api.get('/players');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/players/${id}`);
    return res.data;
  },
  getByTeamId: async (teamId) => {
    const res = await api.get(`/teams/${teamId}/players`);
    return res.data;
  },
  create: async (playerData) => {
    const res = await api.post('/players', playerData);
    return res.data;
  },
  update: async (id, playerData) => {
    const res = await api.put(`/players/${id}`, playerData);
    return res.data;
  },
  delete: async (id) => {
    await api.delete(`/players/${id}`);
  },
};
