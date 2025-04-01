import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../../models/CartItem";
import { CartState } from "../../models/CartSlice";

const initialState: CartState = {
  cartOpen: false,
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,

  reducers: {
    toggleCart1: (state: CartState) => {
      state.cartOpen = !state.cartOpen;
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const accessToken = localStorage.getItem("accessToken"); // 🔥 Fetch it every time
      if (!accessToken) {
        console.log("🚨 User not logged in. Cannot add to cart.");
        return state;
      }

      const { cartItems } = state;
      const existingIndex = cartItems.findIndex((pro: CartItem) => pro._id === action.payload._id);

      if (existingIndex === -1) {
        const item = { ...action.payload, quantity: 1 };
        state.cartItems.push(item);
      } else {
        const updatedItems = cartItems.map((item: CartItem) =>
          item._id === action.payload._id ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
        );
        return { ...state, cartItems: updatedItems };
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const { cartItems } = state;
      const updatedItems = cartItems.filter((item: CartItem) => item._id !== action.payload);
      return { ...state, cartItems: updatedItems };
    },

    reduceFromCart: (state, action: PayloadAction<string>) => {
      const { cartItems } = state;
      const _item = cartItems.find((item: CartItem) => item._id === action.payload);

      if (_item && (_item.quantity ?? 1) > 1) {
        const updatedList = cartItems.map((item: CartItem) =>
          item._id === action.payload ? { ...item, quantity: (item.quantity ?? 1) - 1 } : item
        );
        return { ...state, cartItems: updatedList };
      } else {
        const updatedItems = cartItems.filter((item: CartItem) => item._id !== action.payload);
        return { ...state, cartItems: updatedItems };
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
