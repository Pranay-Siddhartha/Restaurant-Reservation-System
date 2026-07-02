import api from './api';

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  // Admin user management
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
