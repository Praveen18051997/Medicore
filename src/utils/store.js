import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import patientReducer from '../features/patients/patientSlice';
import doctorReducer from '../features/doctors/doctorSlice';
import appointmentReducer from '../features/appointments/appointmentSlice';
import bedReducer from '../features/beds/bedSlice';
import pharmacyReducer from '../features/pharmacy/pharmacySlice';
import billingReducer from '../features/billing/billingSlice';
import notificationReducer from '../features/notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
    beds: bedReducer,
    pharmacy: pharmacyReducer,
    billing: billingReducer,
    notifications: notificationReducer,
  },
});
