/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ProductCategory {
  name: string;
}

export interface ProductType {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  image: string;
  stock: number;
  isCart: boolean;
  createdAt: string; // bisa juga Date jika langsung di-convert
  updatedAt: string;
  category: ProductCategory;
}

export interface ProductStateType {
  products: ProductType[];
  product: ProductType | null;
  loading: boolean;
  error: any;
  message: string | null;
  status: string | null;
}

export type ProductFormType = Omit<
  ProductType,
  "createdAt" | "updatedAt" | "category"
>;
