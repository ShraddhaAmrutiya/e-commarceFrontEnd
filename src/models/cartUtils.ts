// export interface Product {
//     _id: string;
//     title: string;
//     description: string;
//     image: string;
//     price: number;
//     salePrice: number;
//     discountPercentage: number;
//   }
  
//   export interface CartItem {
//     _id: string;
//     productId: Product;
//     quantity: number;
//   }
  
//   export const getCartCount = (cartItems: CartItem[]): number => {
//     return cartItems.reduce((acc, item) => acc + item.quantity, 0);
//   };
  