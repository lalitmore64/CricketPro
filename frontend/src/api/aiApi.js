import api from './axiosConfig';

export const aiApi = {
  generateSummary: async (matchId) => {
    const res = await api.post(`/matches/${matchId}/generate-summary`);
    return res.data;
  },
};
