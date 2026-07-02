import api from './api';

export const reviewAPI = {
  submitReview: (reservationId, data) => api.post(`/reviews/${reservationId}`, data),
  getReviews: () => api.get('/reviews'),
};
