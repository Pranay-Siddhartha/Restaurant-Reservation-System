import api from './api';

export const tableAPI = {
  getAll: (params) => api.get('/tables', { params }),
  create: (data) => api.post('/tables', data),
  update: (id, data) => api.patch(`/tables/${id}`, data),
  delete: (id) => api.delete(`/tables/${id}`),
};
