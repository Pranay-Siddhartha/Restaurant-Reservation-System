import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tableAPI } from '../services/tableService';
import toast from 'react-hot-toast';

export function useTables(params) {
  return useQuery({
    queryKey: ['tables', params],
    queryFn: () => tableAPI.getAll(params).then((res) => res.data.data),
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => tableAPI.create(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Table created successfully!');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to create table';
      toast.error(message);
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      tableAPI.update(id, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Table updated successfully!');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to update table';
      toast.error(message);
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => tableAPI.delete(id).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Table deleted successfully!');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to delete table';
      toast.error(message);
    },
  });
}
