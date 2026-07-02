import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/userService';
import toast from 'react-hot-toast';

export function useAdminUsers(params) {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: () => userAPI.getAllUsers(params).then((res) => res.data.data),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => userAPI.updateUserRole(id, role).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update user role';
      toast.error(message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => userAPI.deleteUser(id).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
    },
  });
}
