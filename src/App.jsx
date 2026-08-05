import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './routes/RouteGuards';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import DashboardPage from './features/dashboard/DashboardPage';
import PatientListPage from './features/patients/PatientListPage';
import DoctorListPage from './features/doctors/DoctorListPage';
import AppointmentListPage from './features/appointments/AppointmentListPage';
import BedManagementPage from './features/beds/BedManagementPage';
import PharmacyPage from './features/pharmacy/PharmacyPage';
import BillingListPage from './features/billing/BillingListPage';
import NotificationsPage from './features/notifications/NotificationsPage';
import ProfilePage from './features/profile/ProfilePage';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientListPage />} />
        <Route path="/doctors" element={<DoctorListPage />} />
        <Route path="/appointments" element={<AppointmentListPage />} />
        <Route path="/beds" element={<BedManagementPage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/billing" element={<BillingListPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}
