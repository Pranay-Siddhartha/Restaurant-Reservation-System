import { format, parseISO } from 'date-fns';
import { HiUser, HiMail, HiShieldCheck, HiCalendar } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';
  const memberSince = user?.createdAt
    ? (() => {
        try {
          return format(parseISO(user.createdAt), 'MMMM dd, yyyy');
        } catch {
          return 'N/A';
        }
      })()
    : 'N/A';

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-500">Your account information.</p>
      </div>

      <div className="glass p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
            <span className="text-4xl font-bold text-white">{initial}</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
          <span className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium capitalize">
            <HiShieldCheck className="w-3.5 h-3.5" />
            {user?.role}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2.5 bg-white rounded-lg shadow-sm">
              <HiUser className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Full Name</p>
              <p className="text-sm text-gray-900 font-medium">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2.5 bg-white rounded-lg shadow-sm">
              <HiMail className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email Address</p>
              <p className="text-sm text-gray-900 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2.5 bg-white rounded-lg shadow-sm">
              <HiShieldCheck className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Role</p>
              <p className="text-sm text-gray-900 font-medium capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2.5 bg-white rounded-lg shadow-sm">
              <HiCalendar className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Member Since</p>
              <p className="text-sm text-gray-900 font-medium">{memberSince}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
