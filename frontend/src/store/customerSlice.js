import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.js";

// Async Thunks
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { search, sortBy } = params || {};
      const response = await API.get("/customers", {
        params: { search, sortBy }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customers");
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customer profile");
    }
  }
);

export const addCustomer = createAsyncThunk(
  "customers/add",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await API.post("/customers", customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add customer");
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update customer");
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/customers/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete customer");
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    currentCustomer: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
    clearCustomerError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By Id
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Customer
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.unshift(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer?._id === action.payload._id) {
          state.currentCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter((c) => c._id !== action.payload);
        if (state.currentCustomer?._id === action.payload) {
          state.currentCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentCustomer, clearCustomerError } = customerSlice.actions;
export default customerSlice.reducer;
