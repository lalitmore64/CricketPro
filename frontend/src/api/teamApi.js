import api from './axiosConfig';

export const teamApi = {
  getAll: async () => {
    const res = await api.get('/teams');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/teams/${id}`);
    return res.data;
  },
  create: async (teamData) => {
    const res = await api.post('/teams', teamData);
    return res.data;
  },
  update: async (id, teamData) => {
    const res = await api.put(`/teams/${id}`, teamData);
    return res.data;
  },
  delete: async (id) => {
    await api.delete(`/teams/${id}`);
  },
};
