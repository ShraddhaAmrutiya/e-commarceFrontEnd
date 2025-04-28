

// models/CartItem.ts
import { Product } from "./Product";

export interface CartItem extends Product {
  quantity: number;
  title:string;

  _id: string;
  productId: Product;
  image?: string | File;}
