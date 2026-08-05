import { createSlice } from '@reduxjs/toolkit';
import { generateInvoices } from '../../utils/mockData';

const initialInvoices = generateInvoices();

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    items: initialInvoices,
    selectedInvoice: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    addInvoice: (state, action) => {
      state.items.unshift({ ...action.payload, id: `INV-${String(state.items.length + 1).padStart(4, '0')}` });
    },
    updateInvoice: (state, action) => {
      const index = state.items.findIndex((inv) => inv.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteInvoice: (state, action) => {
      state.items = state.items.filter((inv) => inv.id !== action.payload);
    },
    markAsPaid: (state, action) => {
      const inv = state.items.find((inv) => inv.id === action.payload);
      if (inv) inv.status = 'Paid';
    },
    selectInvoice: (state, action) => {
      state.selectedInvoice = state.items.find((inv) => inv.id === action.payload) || null;
    },
  },
});

export const { addInvoice, updateInvoice, deleteInvoice, markAsPaid, selectInvoice } = billingSlice.actions;
export default billingSlice.reducer;
