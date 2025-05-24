import { Routes, Route, Navigate } from 'react-router-dom';
import LoginAdmin from '../pages/LoginAdmin';
import Dashboard from '../pages/Dashboard';
import Farms from '../pages/Farms';
import Devices from '../pages/Devices';
import Users from '../pages/Users';
import Support from '../pages/Support';
import Billing from '../pages/Billing';
import Notifications from '../pages/Notifications';
import DashboardLayout from '../layouts/DasboardLayout';
import Ponds from '../pages/Ponds';
import { useAuthStore } from '../store/useAuthStore';
import Settings from '../pages/Settings';
import ScrollToTop from '../components/ScrollToTop';

// AuthGuard checks login status before rendering protected routes
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken ? children : <Navigate to="/login" replace />;
};


const AppRoutes = () => {
  return (
    <>
    <ScrollToTop />
    <Routes>
      {/* Login route */}
      <Route path="/login" element={<LoginAdmin />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="farms" element={<Farms />} />
        <Route path="ponds" element={<Ponds />} />
        <Route path="devices" element={<Devices />} />
        <Route path="users" element={<Users />} />
        <Route path="support" element={<Support />} />
        <Route path="billing" element={<Billing />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  );
};

export default AppRoutes;

