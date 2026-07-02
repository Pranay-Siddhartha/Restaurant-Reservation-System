import { useEffect, useState } from 'react';
import { HiTicket } from 'react-icons/hi';
import { couponAPI } from '../../services/couponService';
import PageTransition from '../../components/PageTransition';
import EmptyState from '../../components/EmptyState';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function MyCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await couponAPI.getMyCoupons();
        setCoupons(data.data || []);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (isLoading) {
    return (
      <PageTransition className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <LoadingSkeleton variant="table" />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Coupons</h1>
        <p className="mt-1 text-gray-500">
          View all the rewards you've earned from past visits.
        </p>
      </div>

      {coupons.length === 0 ? (
        <EmptyState
          icon={HiTicket}
          title="No coupons yet"
          description="Complete a reservation and leave a review to claim a reward!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className={`relative overflow-hidden rounded-2xl border ${
                coupon.isUsed ? 'bg-gray-50 border-gray-200' : 'bg-gradient-to-br from-[#d6a87c]/10 to-[#c69a71]/20 border-[#d6a87c]/30 shadow-sm'
              } p-6`}
            >
              {/* Decorative circle */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${coupon.isUsed ? 'bg-gray-100 text-gray-400' : 'bg-[#d6a87c]/20 text-[#c69a71]'}`}>
                  <HiTicket className="w-6 h-6" />
                </div>
                {coupon.isUsed && (
                  <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                    Used
                  </span>
                )}
              </div>
              
              <h3 className={`text-2xl font-bold mb-1 ${coupon.isUsed ? 'text-gray-400' : 'text-gray-900'}`}>
                {coupon.discountText}
              </h3>
              <p className="text-sm text-gray-600 mb-6 font-mono font-medium">
                Code: {coupon.code}
              </p>
              
              <div className="pt-4 border-t border-black/5 flex justify-between items-center text-xs text-gray-500">
                <span>Earned on: {new Date(coupon.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
