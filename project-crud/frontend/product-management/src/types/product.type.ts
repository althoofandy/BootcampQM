/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProductType {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  isCart: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductStateType {
  products: ProductType[];
  product: ProductType | null;
  loading: boolean;
  error: any;
  message: string | null;
  status: string | null;
}

export type ProductFormType = Omit<ProductType, "createdAt" | "updatedAt">;
