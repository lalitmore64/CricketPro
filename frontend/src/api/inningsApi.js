import api from './axiosConfig';

export const inningsApi = {
  getById: async (id) => {
    const res = await api.get(`/innings/${id}`);
    return res.data;
  },
  getScoreboard: async (id) => {
    const res = await api.get(`/innings/${id}/scorecard`);
    return res.data;
  },
  recordBall: async (inningsId, ballData) => {
    const res = await api.post(`/innings/${inningsId}/balls`, ballData);
    return res.data;
  },
  getBallHistory: async (inningsId) => {
    const res = await api.get(`/innings/${inningsId}/balls`);
    return res.data;
  },
};
