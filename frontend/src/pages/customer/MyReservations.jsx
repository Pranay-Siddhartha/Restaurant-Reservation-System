import { useState, useMemo, useEffect } from 'react';
import { format, parseISO, isAfter } from 'date-fns';
import { HiCalendar, HiXCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useMyReservations, useCancelReservation } from '../../hooks/useReservations';
import { couponAPI } from '../../services/couponService';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const PAGE_SIZE = 10;

export default function MyReservations() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [claimingId, setClaimingId] = useState(null);
  const [hasClaimedCoupon, setHasClaimedCoupon] = useState(false);

  const { data, isLoading } = useMyReservations();
  const cancelReservation = useCancelReservation();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await couponAPI.getMyCoupons();
        const coupons = res.data.data || [];
        if (coupons.length > 0) {
          setHasClaimedCoupon(true);
        }
      } catch (error) {
        console.error('Failed to fetch coupons', error);
      }
    };
    fetchCoupons();
  }, []);

  const allReservations = useMemo(() => {
    if (!data) return [];
    return data.reservations || data.data || data || [];
  }, [data]);

  const filteredReservations = useMemo(() => {
    const now = new Date();
    return allReservations.filter((r) => {
      switch (activeTab) {
        case 'upcoming':
          return (
            r.status === 'confirmed' &&
            isAfter(parseISO(r.reservationDate), new Date(now.setHours(0, 0, 0, 0)))
          );
        case 'completed':
          return r.status === 'completed';
        case 'cancelled':
          return r.status === 'cancelled';
        default:
          return true;
      }
    });
  }, [allReservations, activeTab]);

  const totalPages = Math.ceil(filteredReservations.length / PAGE_SIZE);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelReservation.mutateAsync(cancelTarget._id || cancelTarget.id);
    } catch {
      // Error handled by hook
    }
    setCancelTarget(null);
  };

  const handleClaimCoupon = async (reservationId) => {
    try {
      setClaimingId(reservationId);
      await couponAPI.claimCoupon(reservationId);
      toast.success('🎉 Congrats! 50% OFF coupon added to your account!');
      setHasClaimedCoupon(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to claim coupon');
    } finally {
      setClaimingId(null);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
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
        <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
        <p className="mt-1 text-gray-500">
          View and manage all your restaurant reservations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {paginatedReservations.length === 0 ? (
        <EmptyState
          icon={HiCalendar}
          title="No reservations found"
          description={
            activeTab === 'all'
              ? "You haven't made any reservations yet."
              : `No ${activeTab} reservations.`
          }
        />
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Time Slot
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
                      {res.status === 'confirmed' && (
                        <button
                          onClick={() => setCancelTarget(res)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <HiXCircle className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                      {res.status === 'completed' && (
                        <div className="flex justify-end gap-2">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                            onClick={() => alert('Review modal coming soon!')}
                          >
                            Leave Review
                          </button>
                          {!hasClaimedCoupon && (
                            <button
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-900 bg-[#d6a87c] rounded-lg hover:bg-[#c69a71] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleClaimCoupon(res._id || res.id)}
                              disabled={claimingId === (res._id || res.id)}
                            >
                              {claimingId === (res._id || res.id) ? 'Claiming...' : 'Claim Coupon'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
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
          Are you sure you want to cancel this reservation? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
