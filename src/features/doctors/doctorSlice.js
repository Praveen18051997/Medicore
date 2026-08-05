import { createSlice } from '@reduxjs/toolkit';
import { generateDoctors } from '../../utils/mockData';

const initialDoctors = generateDoctors();

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    items: initialDoctors,
    selectedDoctor: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    addDoctor: (state, action) => {
      state.items.unshift({ ...action.payload, id: `DOC-${String(state.items.length + 1).padStart(3, '0')}` });
    },
    updateDoctor: (state, action) => {
      const index = state.items.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteDoctor: (state, action) => {
      state.items = state.items.filter((d) => d.id !== action.payload);
    },
    selectDoctor: (state, action) => {
      state.selectedDoctor = state.items.find((d) => d.id === action.payload) || null;
    },
  },
});

export const { addDoctor, updateDoctor, deleteDoctor, selectDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
