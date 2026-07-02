import { useMemo } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import {
  HiCalendar,
  HiClipboardList,
  HiTable,
  HiTrendingUp,
} from 'react-icons/hi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useReservationStats, useAdminReservations } from '../../hooks/useReservations';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const PIE_COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

import PageTransition from '../../components/PageTransition';

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useReservationStats();
  const { data: reservationsData, isLoading: reservationsLoading } =
    useAdminReservations({ limit: 10 });

  const stats = statsData?.stats || statsData || {};
  const reservations = useMemo(() => {
    if (!reservationsData) return [];
    return reservationsData.reservations || reservationsData.data || reservationsData || [];
  }, [reservationsData]);

  // Bar chart data — last 7 days
  const barData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = reservations.filter((r) => {
        try {
          return format(parseISO(r.reservationDate), 'yyyy-MM-dd') === dateStr;
        } catch {
          return false;
        }
      }).length;
      days.push({ day: format(date, 'EEE'), count });
    }
    return days;
  }, [reservations]);

  // Pie chart data — status breakdown
  const pieData = useMemo(() => {
    const counts = { confirmed: 0, cancelled: 0, completed: 0 };
    reservations.forEach((r) => {
      if (counts[r.status] !== undefined) {
        counts[r.status]++;
      }
    });
    return [
      { name: 'Confirmed', value: counts.confirmed },
      { name: 'Cancelled', value: counts.cancelled },
      { name: 'Completed', value: counts.completed },
    ].filter((d) => d.value > 0);
  }, [reservations]);

  const recentBookings = reservations.slice(0, 10);

  const isLoading = statsLoading || reservationsLoading;

  if (isLoading) {
    return (
      <PageTransition className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <LoadingSkeleton variant="stats" count={4} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
        <LoadingSkeleton variant="table" />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-500">
          Overview of your restaurant&apos;s reservation system.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Reservations"
          value={stats.totalReservations ?? reservations.length}
          icon={HiClipboardList}
          color="indigo"
        />
        <StatsCard
          title="Today's Reservations"
          value={
            stats.todaysReservations ??
            reservations.filter((r) => {
              try {
                return (
                  format(parseISO(r.reservationDate), 'yyyy-MM-dd') ===
                  format(new Date(), 'yyyy-MM-dd')
                );
              } catch {
                return false;
              }
            }).length
          }
          icon={HiCalendar}
          color="blue"
        />
        <StatsCard
          title="Available Tables"
          value={stats.availableTables ?? '-'}
          icon={HiTable}
          color="green"
        />
        <StatsCard
          title="Occupancy Rate"
          value={
            stats.occupancyRate !== undefined
              ? `${stats.occupancyRate}%`
              : '-'
          }
          icon={HiTrendingUp}
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Reservations This Week
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#a3a3a3' }} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#a3a3a3' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#d6a87c"
                  radius={[6, 6, 0, 0]}
                  name="Reservations"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Status Breakdown
          </h3>
          <div className="h-64">
            {pieData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="glass overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h3>
        </div>
        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No recent bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((res) => (
                  <tr
                    key={res._id || res.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm text-gray-900 font-medium">
                      {res.user?.name || res.customerName || 'N/A'}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-700">
                      {(() => {
                        try {
                          return format(parseISO(res.reservationDate), 'MMM dd, yyyy');
                        } catch {
                          return res.reservationDate || '-';
                        }
                      })()}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-700">
                      {res.startTime || '-'} – {res.endTime || '-'}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-700">
                      {res.guestCount || '-'}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={res.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
