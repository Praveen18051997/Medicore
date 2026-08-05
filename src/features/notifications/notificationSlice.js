import { createSlice } from '@reduxjs/toolkit';
import { generateNotifications } from '../../utils/mockData';

const initialNotifications = generateNotifications();

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: initialNotifications,
    unreadCount: initialNotifications.filter((n) => !n.read).length,
  },
  reducers: {
    markAsRead: (state, action) => {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => { n.read = true; });
      state.unreadCount = 0;
    },
    clearNotification: (state, action) => {
      const wasUnread = state.items.find((n) => n.id === action.payload && !n.read);
      state.items = state.items.filter((n) => n.id !== action.payload);
      if (wasUnread) state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    addNotification: (state, action) => {
      state.items.unshift({ ...action.payload, read: false });
      state.unreadCount += 1;
    },
  },
});

export const { markAsRead, markAllAsRead, clearNotification, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
