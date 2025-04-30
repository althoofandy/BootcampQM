export interface ProductModel {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  image: string;
  stock: number;
  isCart: boolean;
  createdAt: Date;
  updatedAt: Date;
}
