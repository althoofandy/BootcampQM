/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthAPI from "../services/auth.api.js";
import { AuthFormType, AuthStateType } from "../types/auth.type.js";
import Cookies from "js-cookie";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: AuthFormType, { rejectWithValue }) => {
    try {
      const response = await AuthAPI.login(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: AuthFormType, { rejectWithValue }) => {
    try {
      const response = await AuthAPI.register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const initialState: AuthStateType = {
  user: null,
  token: Cookies.get("token") ?? null,
  loading: false,
  error: null,
  message: null,
  status: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setToken: (state, action) => {
      console.log(action.payload);
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
        state.status = "success";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "error";
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
        state.status = "success";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "error";
      });
  },
});

export const { setError, setToken } = authSlice.actions;
export default authSlice.reducer;
