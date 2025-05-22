import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authreducer"; // Import the auth reducer

// Combine reducers (if you have multiple reducers)
const rootReducer = {
  auth: authReducer,
  // other reducers...
};

// Create the store using configureStore from Redux Toolkit
const store = configureStore({
  reducer: rootReducer, // Specify the rootReducer object
  devTools: process.env.NODE_ENV !== "production", // Enable devTools in development
});

export default store;
