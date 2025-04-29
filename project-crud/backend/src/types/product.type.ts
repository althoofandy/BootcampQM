export interface ProductModel {
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
