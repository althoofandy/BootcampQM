/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserData, UserState } from "../types/user";

// Async thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/api/users");
      const jsonUser = await response.json();
      return jsonUser.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

// Initial state
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
  editUser: null,
  isViewModalOpen: false,
  isEditModalOpen: false,
};

// Create slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedUser(state, action: PayloadAction<UserData | null>) {
      state.selectedUser = action.payload;
      state.isViewModalOpen = !!action.payload; // Buka modal otomatis kalau ada selectedUser
    },
    setEditUser(state, action: PayloadAction<UserData | null>) {
      state.editUser = action.payload;
      state.isEditModalOpen = !!action.payload; // Buka modal otomatis kalau ada editUser
    },
    setViewModalOpen(state, action: PayloadAction<boolean>) {
      state.isViewModalOpen = action.payload;
    },
    setEditModalOpen(state, action: PayloadAction<boolean>) {
      state.isEditModalOpen = action.payload;
    },
    updateUser(state, action: PayloadAction<UserData>) {
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    updateEditUser(state, action: PayloadAction<UserData>) {
      state.editUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedUser,
  setEditUser,
  setViewModalOpen,
  setEditModalOpen,
  updateUser,
  deleteUser,
  updateEditUser,
} = userSlice.actions;
export default userSlice.reducer;
