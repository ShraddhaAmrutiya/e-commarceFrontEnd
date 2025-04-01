import { Product } from "./Product";

export interface CartItem extends Product {
  quantity?: number;
  userId?:string
  _id:string
}
