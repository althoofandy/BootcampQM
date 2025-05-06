/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Transaction, TransactionState } from "../types/transaction.type";
import TransactionAPI from "../services/transaction.api";

// Asynchronous thunk untuk memulai transaksi
export const startTransaction = createAsyncThunk(
  "transaction/startTransaction",
  async (data: Transaction, { rejectWithValue }) => {
    try {
      console.log("cek product payload slice :", data);
      const response = await TransactionAPI.createTransaction(data);
      console.log("cek trx:", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Initial state untuk transaksi
const initialState: TransactionState = {
  transactionData: null,
  loading: false,
  error: null,
};

// Membuat slice untuk transaksi
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    resetTransaction: (state) => {
      state.transactionData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Transaksi mulai
      .addCase(startTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Transaksi berhasil
      .addCase(startTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionData = action.payload; // Simpan data transaksi
      })
      // Transaksi gagal
      .addCase(startTransaction.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export const { resetTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;
