import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationAPI } from '../services/reservationService';
import toast from 'react-hot-toast';

// Customer hooks
export function useMyReservations(params) {
  return useQuery({
    queryKey: ['myReservations', params],
    queryFn: () => reservationAPI.getMyReservations(params).then((res) => res.data.data),
  });
}

export function useAvailability(date, guests) {
  return useQuery({
    queryKey: ['availability', date, guests],
    queryFn: () => reservationAPI.checkAvailability(date, guests).then((res) => res.data.data),
    enabled: !!date && !!guests, // Only run if both are provided
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => reservationAPI.create(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      toast.success('Reservation created successfully!');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to create reservation';
      toast.error(message);
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => reservationAPI.cancel(id).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      toast.success('Reservation cancelled successfully');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to cancel reservation';
      toast.error(message);
    },
  });
}

// Admin hooks
export function useAdminReservations(params) {
  return useQuery({
    queryKey: ['adminReservations', params],
    queryFn: () => reservationAPI.getAll(params).then((res) => res.data.data),
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      reservationAPI.update(id, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReservations'] });
      toast.success('Reservation updated successfully');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to update reservation';
      toast.error(message);
    },
  });
}

export function useAdminCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => reservationAPI.adminCancel(id).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReservations'] });
      toast.success('Reservation cancelled');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to cancel reservation';
      toast.error(message);
    },
  });
}

export function useReservationStats() {
  return useQuery({
    queryKey: ['reservationStats'],
    queryFn: () => reservationAPI.getStats().then((res) => res.data.data),
  });
}
