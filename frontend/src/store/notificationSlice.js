import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.js";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/notifications");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(`/api/notifications/${id}/read`);
      return response.data.notification;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark as read");
    }
  }
);

export const getReminderMessage = createAsyncThunk(
  "notifications/getReminderMessage",
  async (customerId, { dispatch, rejectWithValue }) => {
    try {
      const response = await API.post("/api/notifications/send-reminder", { customerId });
      // Re-fetch notifications to list the generated notification in-app
      dispatch(fetchNotifications());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to generate reminder message");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    reminderPayload: null,
    loading: false,
    error: null
  },
  reducers: {
    clearReminderPayload: (state) => {
      state.reminderPayload = null;
    },
    clearNotificationError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      })
      // Get Reminder Message
      .addCase(getReminderMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReminderMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.reminderPayload = action.payload;
      })
      .addCase(getReminderMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearReminderPayload, clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
