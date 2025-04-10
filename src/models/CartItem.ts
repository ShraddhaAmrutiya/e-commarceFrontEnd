
// import { Product } from "./Product";

// export interface CartItem {
//   _id: string; // Cart item ID
//   productId: Product; // This is the correct reference to the Product type
//   quantity: number;
// }
// // src/models/CartItem.ts

// export interface CartItem extends Product {
//   quantity: number;
// }


// models/CartItem.ts
import { Product } from "./Product";

export interface CartItem extends Product {
  quantity: number;
  _id: string;
  productId: Product;
}
