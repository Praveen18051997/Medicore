import { createSlice } from '@reduxjs/toolkit';
import { generateBeds } from '../../utils/mockData';

const initialBeds = generateBeds();

const bedSlice = createSlice({
  name: 'beds',
  initialState: {
    items: initialBeds,
    status: 'idle',
    error: null,
  },
  reducers: {
    assignBed: (state, action) => {
      const bed = state.items.find((b) => b.id === action.payload.bedId);
      if (bed) {
        bed.status = 'Occupied';
        bed.patientId = action.payload.patientId;
        bed.patientName = action.payload.patientName;
        bed.admissionDate = new Date().toISOString().split('T')[0];
      }
    },
    releaseBed: (state, action) => {
      const bed = state.items.find((b) => b.id === action.payload);
      if (bed) {
        bed.status = 'Available';
        bed.patientId = null;
        bed.patientName = null;
        bed.admissionDate = null;
      }
    },
    setMaintenance: (state, action) => {
      const bed = state.items.find((b) => b.id === action.payload);
      if (bed) {
        bed.status = 'Maintenance';
        bed.patientId = null;
        bed.patientName = null;
        bed.admissionDate = null;
      }
    },
  },
});

export const { assignBed, releaseBed, setMaintenance } = bedSlice.actions;
export default bedSlice.reducer;
