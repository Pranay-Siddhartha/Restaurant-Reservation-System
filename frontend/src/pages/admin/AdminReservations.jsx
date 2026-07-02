import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { HiSearch, HiFilter, HiXCircle } from 'react-icons/hi';
import {
  useAdminReservations,
  useUpdateReservation,
  useAdminCancelReservation,
} from '../../hooks/useReservations';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';

const STATUS_OPTIONS = ['all', 'confirmed', 'cancelled', 'completed'];
const PAGE_SIZE = 10;

export default function AdminReservations() {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);

  const { data, isLoading } = useAdminReservations();
  const updateReservation = useUpdateReservation();
  const cancelReservation = useAdminCancelReservation();

  const allReservations = useMemo(() => {
    if (!data) return [];
    return data.reservations || data.data || data || [];
  }, [data]);

  const filteredReservations = useMemo(() => {
    return allReservations.filter((r) => {
      // Search by customer name
      if (search) {
        const name = (r.user?.name || r.customerName || '').toLowerCase();
        if (!name.includes(search.toLowerCase())) return false;
      }
      // Date filter
      if (dateFilter) {
        try {
          const resDate = format(parseISO(r.reservationDate), 'yyyy-MM-dd');
          if (resDate !== dateFilter) return false;
        } catch {
          return false;
        }
      }
      // Status filter
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
  }, [allReservations, search, dateFilter, statusFilter]);

  const totalPages = Math.ceil(filteredReservations.length / PAGE_SIZE);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleStatusChange = async (id, newStatus) => {
    await updateReservation.mutateAsync({ id, data: { status: newStatus } });
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelReservation.mutateAsync(cancelTarget._id || cancelTarget.id);
    } catch {
      // Error handled by hook
    }
    setCancelTarget(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        <p className="mt-1 text-gray-500">
          Manage all restaurant reservations.
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
              placeholder="Search by customer name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field pl-10"
            />
          </div>

          {/* Date filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field pl-9 pr-8 appearance-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {paginatedReservations.length === 0 ? (
        <EmptyState
          icon={HiFilter}
          title="No reservations found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Table
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Guests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedReservations.map((res) => (
                  <tr
                    key={res._id || res.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {res.user?.name || res.customerName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {res.user?.email || res.customerEmail || ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {(() => {
                        try {
                          return format(parseISO(res.reservationDate), 'MMM dd, yyyy');
                        } catch {
                          return res.reservationDate || '-';
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {res.startTime || '-'} – {res.endTime || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {res.table?.tableNumber || res.tableNumber || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {res.guestCount || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {res.status === 'confirmed' && (
                          <>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleStatusChange(
                                    res._id || res.id,
                                    e.target.value
                                  );
                                  e.target.value = '';
                                }
                              }}
                              defaultValue=""
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="" disabled>
                                Update
                              </option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => setCancelTarget(res)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <HiXCircle className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Cancel Modal */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel Reservation"
        onConfirm={handleCancel}
        confirmText="Yes, Cancel"
        confirmVariant="danger"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to cancel this reservation for{' '}
          <span className="font-semibold">
            {cancelTarget?.user?.name || cancelTarget?.customerName || 'this customer'}
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
