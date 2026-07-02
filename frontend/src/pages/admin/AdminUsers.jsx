import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { HiSearch, HiFilter, HiXCircle, HiShieldCheck, HiOutlineUser } from 'react-icons/hi';
import { useAdminUsers, useUpdateUserRole, useDeleteUser } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';

const ROLE_OPTIONS = ['all', 'admin', 'customer'];
const PAGE_SIZE = 10;

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: users, isLoading } = useAdminUsers({
    search,
    role: roleFilter,
  });
  
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const totalPages = Math.ceil((users?.length || 0) / PAGE_SIZE);
  const paginatedUsers = useMemo(() => {
    if (!users) return [];
    return users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [users, currentPage]);

  const handleRoleChange = async (id, newRole) => {
    await updateUserRole.mutateAsync({ id, role: newRole });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser.mutateAsync(deleteTarget._id || deleteTarget.id);
    } catch {
      // Error handled by hook
    }
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-gray-500">
          Manage user accounts, roles, and administrative access.
        </p>
      </div>

      {/* Filters */}
      <div className="glass p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field pl-10"
            />
          </div>

          {/* Role filter */}
          <div className="relative">
            <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field pl-9 pr-8 appearance-none"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {!paginatedUsers || paginatedUsers.length === 0 ? (
        <EmptyState
          icon={HiOutlineUser}
          title="No users found"
          description="Try adjusting your search or role filters."
        />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedUsers.map((u) => {
                  const id = u._id || u.id;
                  const isSelf = currentUser?._id === id || currentUser?.id === id;
                  return (
                    <tr
                      key={id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {u.name} {isSelf && <span className="text-indigo-600 text-xs ml-1">(You)</span>}
                            </p>
                            <p className="text-xs text-gray-500">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.role === 'admin' && <HiShieldCheck className="w-3.5 h-3.5" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {u.createdAt ? format(parseISO(u.createdAt), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isSelf && (
                            <>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleRoleChange(id, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                                defaultValue=""
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                              >
                                <option value="" disabled>Change Role</option>
                                <option value="customer" disabled={u.role === 'customer'}>Make Customer</option>
                                <option value="admin" disabled={u.role === 'admin'}>Make Admin</option>
                              </select>
                              
                              <button
                                onClick={() => setDeleteTarget(u)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <HiXCircle className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
        onConfirm={handleDelete}
        confirmText="Yes, Delete User"
        confirmVariant="danger"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to permanently delete the account for <span className="font-semibold">{deleteTarget?.name}</span>? 
          This action cannot be undone and will erase all their data.
        </p>
      </Modal>
    </div>
  );
}
