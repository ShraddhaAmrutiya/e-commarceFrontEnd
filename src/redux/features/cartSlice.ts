import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../../models/CartItem";
import { CartState } from "../../models/CartSlice";

const initialState: CartState = {
  cartOpen: false,
  cartItems: [],
  cartCount: 0,
  totalQuantity: 0,
  totalPrice: 0,
};


export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,

  reducers: {
    toggleCart1: (state: CartState) => {
      state.cartOpen = !state.cartOpen;
    },



    addToCart: (state, action: PayloadAction<CartItem>) => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return state;
    
      const { cartItems } = state;
      const existingIndex = cartItems.findIndex(
        (pro: CartItem) => pro.productId._id === action.payload.productId._id
      );
    
      if (existingIndex === -1) {
        const item = { ...action.payload, quantity: 1 };
        state.cartItems.push(item);
      } else {
        state.cartItems[existingIndex].quantity += 1;
      }
    },
    


    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item: CartItem) => item.productId._id !== action.payload
      );
    },
    
    reduceFromCart: (state, action: PayloadAction<string>) => {
      const { cartItems } = state;
      const itemIndex = cartItems.findIndex(item => item.productId._id === action.payload);
    
      if (itemIndex !== -1) {
        const item = cartItems[itemIndex];
        if (item.quantity > 1) {
          cartItems[itemIndex].quantity -= 1;
        } else {
          cartItems.splice(itemIndex, 1);
        }
      }
    },
    
    setCartState: (state, action: PayloadAction<boolean>) => {
      return { ...state, cartOpen: action.payload };
    },

    emptyCart: (state) => {
      return { ...state, cartItems: [] };
    },
  },
});

export const {
  addToCart,
  toggleCart1,
  removeFromCart,
  setCartState,
  reduceFromCart,
  emptyCart,
} = cartSlice.actions;

export default cartSlice.reducer;
