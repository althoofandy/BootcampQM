import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./feature/product.slice";
import authReducer from "./feature/auth.slice"; // Import auth slice
import App from "./App";
import "./index.css";

// Configure Redux store
const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer, // Tambahkan auth reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional: untuk handle non-serializable values seperti dalam auth
    }),
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
