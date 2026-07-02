import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HiCalendar,
  HiCheckCircle,
  HiXCircle,
  HiPlusCircle,
  HiClipboardList,
} from 'react-icons/hi';
import { format, parseISO, isAfter, startOfDay, getDaysInMonth, getDay, startOfMonth } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { useMyReservations } from '../../hooks/useReservations';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSkeleton from '../../components/LoadingSkeleton';

import PageTransition from '../../components/PageTransition';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useMyReservations();

  const reservations = useMemo(() => {
    if (!data) return [];
    return data.reservations || data.data || data || [];
  }, [data]);

  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = reservations.filter(
      (r) =>
        r.status === 'confirmed' &&
        r.reservationDate &&
        isAfter(parseISO(r.reservationDate), startOfDay(now))
    ).length;
    const completed = reservations.filter((r) => r.status === 'completed').length;
    const cancelled = reservations.filter((r) => r.status === 'cancelled').length;
    return { upcoming, completed, cancelled };
  }, [reservations]);

  const recentReservations = useMemo(() => {
    return [...reservations]
      .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate))
      .slice(0, 5);
  }, [reservations]);

  // Mini calendar
  const calendarData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = getDaysInMonth(now);
    const firstDayOfWeek = getDay(startOfMonth(now));

    const reservationDates = new Set(
      reservations
        .filter((r) => r.status === 'confirmed')
        .map((r) => {
          try {
            return format(parseISO(r.reservationDate), 'yyyy-MM-dd');
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    );

    return { year, month, daysInMonth, firstDayOfWeek, reservationDates };
  }, [reservations]);

  const formatTime = (time) => {
    if (!time) return '-';
    return time;
  };

  if (isLoading) {
    return (
      <PageTransition className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton variant="stats" count={3} />
        </div>
        <LoadingSkeleton variant="table" />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {(() => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good morning';
            if (hour < 17) return 'Good afternoon';
            return 'Good evening';
          })()},{' '}
          {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="mt-1 text-gray-500">
          Here&apos;s an overview of your reservations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Upcoming Reservations"
          value={stats.upcoming}
          icon={HiCalendar}
          color="indigo"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={HiCheckCircle}
          color="green"
        />
        <StatsCard
          title="Cancelled"
          value={stats.cancelled}
          icon={HiXCircle}
          color="red"
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/reservations/new" className="btn-primary gap-2">
          <HiPlusCircle className="w-5 h-5" />
          New Reservation
        </Link>
        <Link to="/reservations" className="btn-secondary gap-2">
          <HiClipboardList className="w-5 h-5" />
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reservations */}
        <div className="lg:col-span-2">
          <div className="glass overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Reservations
              </h3>
            </div>
            {recentReservations.length === 0 ? (
              <div className="p-8 text-center">
                <HiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No reservations yet</p>
                <Link
                  to="/reservations/new"
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-500 mt-1 inline-block"
                >
                  Make your first reservation →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
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
                    {recentReservations.map((res) => (
                      <tr
                        key={res._id || res.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
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
                          {formatTime(res.startTime)} - {formatTime(res.endTime)}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-gray-700">
                          {res.guests || res.numberOfGuests || '-'}
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
        </div>

        {/* Mini Calendar */}
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(new Date(calendarData.year, calendarData.month), 'MMMM yyyy')}
          </h3>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-xs font-medium text-gray-400 py-1">
                {day}
              </div>
            ))}
            {Array.from({ length: calendarData.firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = format(
                new Date(calendarData.year, calendarData.month, day),
                'yyyy-MM-dd'
              );
              const hasReservation = calendarData.reservationDates.has(dateStr);
              const isToday =
                day === new Date().getDate() &&
                calendarData.month === new Date().getMonth();

              return (
                <div
                  key={day}
                  className={`relative w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors mx-auto ${
                    isToday
                      ? 'bg-indigo-600 text-white font-semibold'
                      : hasReservation
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {day}
                  {hasReservation && !isToday && (
                    <span className="absolute bottom-0.5 w-1 h-1 bg-indigo-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
