import { createSlice } from '@reduxjs/toolkit';
import { generateAppointments } from '../../utils/mockData';

const initialAppointments = generateAppointments();

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    items: initialAppointments,
    selectedAppointment: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    addAppointment: (state, action) => {
      state.items.unshift({ ...action.payload, id: `APT-${String(state.items.length + 1).padStart(4, '0')}` });
    },
    updateAppointment: (state, action) => {
      const index = state.items.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteAppointment: (state, action) => {
      state.items = state.items.filter((a) => a.id !== action.payload);
    },
    cancelAppointment: (state, action) => {
      const apt = state.items.find((a) => a.id === action.payload);
      if (apt) apt.status = 'Cancelled';
    },
    completeAppointment: (state, action) => {
      const apt = state.items.find((a) => a.id === action.payload);
      if (apt) apt.status = 'Completed';
    },
  },
});

export const { addAppointment, updateAppointment, deleteAppointment, cancelAppointment, completeAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
