import { createSlice } from '@reduxjs/toolkit';
import { generateMedicines } from '../../utils/mockData';

const initialMedicines = generateMedicines();

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState: {
    items: initialMedicines,
    status: 'idle',
    error: null,
  },
  reducers: {
    addMedicine: (state, action) => {
      state.items.unshift({ ...action.payload, id: `MED-${String(state.items.length + 1).padStart(3, '0')}` });
    },
    updateMedicine: (state, action) => {
      const index = state.items.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteMedicine: (state, action) => {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
    updateStock: (state, action) => {
      const med = state.items.find((m) => m.id === action.payload.id);
      if (med) {
        med.stock = action.payload.stock;
        med.isLowStock = action.payload.stock < med.lowStockThreshold;
      }
    },
  },
});

export const { addMedicine, updateMedicine, deleteMedicine, updateStock } = pharmacySlice.actions;
export default pharmacySlice.reducer;
