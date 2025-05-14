// Interface untuk produk dalam transaksi
export interface Product {
  productId: string;
  qty: number;
  name: string;
  price: number;
}

// Interface untuk transaksi itu sendiri
export interface Transaction {
  totalPrice: number;
  products: Product[];
}

// State untuk transaksi di Redux
export interface TransactionState {
  transactionData: Transaction | null;
  loading: boolean;
  error: string | null;
}
