import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./feature/product.slice.js";
import App from "./App";
import "./index.css";

// Configure Redux store
const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

// Define AppDispatch type for useDispatch
export type AppDispatch = typeof store.dispatch;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
