import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.js";

export const fetchSettings = createAsyncThunk(
  "settings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/settings");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch settings");
    }
  }
);

export const updateSettings = createAsyncThunk(
  "settings/update",
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await API.put("/settings", settingsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update settings");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    settings: {
      currency: "INR",
      duePeriodDays: 30,
      whatsappReminderTemplate: "Hello {customerName}, this is a friendly reminder that you have a pending balance of {currency} {balance} at {shopName}. Please clear it soon. Thank you!"
    },
    loading: false,
    error: null
  },
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
