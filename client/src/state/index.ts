import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  isNotificationsEnabled: boolean;
  notifications: Notification[];
}

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  isNotificationsEnabled: true,
  notifications: [
    {
      id: "1",
      message: "Low stock alert: Widget A has only 5 items left",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      read: false,
    },
    {
      id: "2",
      message: "New product added: Premium Headphones",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: false,
    },
    {
      id: "3",
      message: "Monthly expense report is ready to review",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      read: false,
    },
  ],
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setIsNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isNotificationsEnabled = action.payload;
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) notification.read = true;
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setIsSidebarCollapsed,
  setIsDarkMode,
  setIsNotificationsEnabled,
  dismissNotification,
  markNotificationRead,
  clearAllNotifications,
} = globalSlice.actions;

export default globalSlice.reducer;
