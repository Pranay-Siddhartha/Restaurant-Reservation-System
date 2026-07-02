import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ErrorPage from './components/ErrorPage';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import NewReservation from './pages/customer/NewReservation';
import MyReservations from './pages/customer/MyReservations';
import MyCoupons from './pages/customer/MyCoupons';
import ProfilePage from './pages/customer/ProfilePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReservations from './pages/admin/AdminReservations';
import AdminTables from './pages/admin/AdminTables';
import AdminUsers from './pages/admin/AdminUsers';

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Customer routes */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/reservations/new" element={<NewReservation />} />
          <Route path="/reservations" element={<MyReservations />} />
          <Route path="/coupons" element={<MyCoupons />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/tables" element={<AdminTables />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* Unauthorized */}
      <Route
        path="/unauthorized"
        element={<ErrorPage code={403} message="You don't have permission to access this page." />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
