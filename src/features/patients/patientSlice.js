import { createSlice } from '@reduxjs/toolkit';
import { generatePatients } from '../../utils/mockData';

const initialPatients = generatePatients();

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    items: initialPatients,
    selectedPatient: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    addPatient: (state, action) => {
      state.items.unshift({ ...action.payload, id: `PAT-${String(state.items.length + 1).padStart(4, '0')}` });
    },
    updatePatient: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deletePatient: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    selectPatient: (state, action) => {
      state.selectedPatient = state.items.find((p) => p.id === action.payload) || null;
    },
  },
});

export const { addPatient, updatePatient, deletePatient, selectPatient } = patientSlice.actions;
export default patientSlice.reducer;
