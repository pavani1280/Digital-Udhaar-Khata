import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.js";
import { fetchCustomerById } from "./customerSlice.js";

// Async Thunks
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/transactions", { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transactions");
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (transactionData, { dispatch, rejectWithValue }) => {
    try {
      const response = await API.post("/api/transactions", transactionData);
      // Re-fetch customer profile and stats to keep state in sync
      dispatch(fetchShopkeeperStats());
      if (transactionData.customerId) {
        dispatch(fetchCustomerById(transactionData.customerId));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add transaction");
    }
  }
);

export const fetchShopkeeperStats = createAsyncThunk(
  "transactions/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/transactions/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const fetchMonthlyReport = createAsyncThunk(
  "transactions/fetchReport",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/transactions/report");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch report data");
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    stats: {
      totalCredit: 0,
      totalCollected: 0,
      pendingBalance: 0,
      totalCustomers: 0
    },
    report: [],
    loading: false,
    error: null
  },
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Stats
      .addCase(fetchShopkeeperStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchShopkeeperStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchShopkeeperStats.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch Report
      .addCase(fetchMonthlyReport.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
        state.report = action.payload;
      })
      .addCase(fetchMonthlyReport.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer;
