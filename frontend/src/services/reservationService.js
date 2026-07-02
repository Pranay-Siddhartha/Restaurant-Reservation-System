import api from './api';

export const reservationAPI = {
  create: (data) => api.post('/reservations', data),
  getMyReservations: (params) => api.get('/reservations/my', { params }),
  cancel: (id) => api.delete(`/reservations/${id}`),
  checkAvailability: (date, guests) => api.get('/reservations/availability', { params: { date, guests } }),
  // Admin endpoints
  getAll: (params) => api.get('/admin/reservations', { params }),
  update: (id, data) => api.patch(`/admin/reservations/${id}`, data),
  adminCancel: (id) => api.delete(`/admin/reservations/${id}`),
  getStats: () => api.get('/admin/stats'),
};
