/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/transaction.api.ts
const BASE_URL = import.meta.env.VITE_BASE_URL_API; // Pastikan environment variabel ini sudah ada

const TransactionAPI = {
  // Membuat transaksi baru
  createTransaction: async (transaction: {
    totalPrice: number;
    products: any[];
  }) => {
    const res = await fetch(`${BASE_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(transaction),
    });

    const json = await res.json();
    if (!res.ok) throw json; // Menangani jika ada error dari API
    return json;
  },
};

export default TransactionAPI;
