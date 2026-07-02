import api from './api';

export const couponAPI = {
  claimCoupon: (reservationId) => api.post(`/coupons/claim/${reservationId}`),
  getMyCoupons: () => api.get('/coupons/my-coupons'),
};
