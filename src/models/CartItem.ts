

// models/CartItem.ts
import { Product } from "./Product";

export interface CartItem extends Product {
  quantity: number;
  _id: string;
  productId: Product;
  image?: string | File;}
