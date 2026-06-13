import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import customerReducer from "./customerSlice.js";
import transactionReducer from "./transactionSlice.js";
import notificationReducer from "./notificationSlice.js";
import settingsReducer from "./settingsSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    transactions: transactionReducer,
    notifications: notificationReducer,
    settings: settingsReducer
  }
});

export default store;
