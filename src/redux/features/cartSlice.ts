import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../../models/CartItem";
import { CartSlice } from "../../models/CartSlice";

const initialState: CartSlice = {
  cartOpen: false,
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { cartItems } = state;
      const existingIndex = cartItems.findIndex((pro) => pro._id === action.payload._id);

  if (existingIndex === -1) {
    const item = { ...action.payload, quantity: 1 }; // Ensure quantity is set
    return { ...state, cartItems: [...cartItems, item] };
  } else {
    const updatedItems = cartItems.map((item) =>
      item._id === action.payload._id
        ? { ...item, quantity: (item.quantity ?? 0) + 1 } // Ensure quantity is always a number
        : item
    );
    return { ...state, cartItems: updatedItems };
  }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const { cartItems } = state;
      const updatedItems = cartItems.filter((item) => item._id !== action.payload);
      return { ...state, cartItems: updatedItems };
    },
    reduceFromCart: (state, action: PayloadAction<string>) => {
      const { cartItems } = state;
      const _item = cartItems.find((item) => item._id === action.payload);
    
      if (_item && (_item.quantity ?? 1) > 1) { // Ensure quantity is defined
        const updatedList = cartItems.map((item) =>
          item._id === action.payload
            ? { ...item, quantity: (item.quantity ?? 1) - 1 } // Default to 1
            : item
        );
        return { ...state, cartItems: updatedList };
      } else {
        const updatedItems = cartItems.filter((item) => item._id !== action.payload);
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
  removeFromCart,
  setCartState,
  reduceFromCart,
  emptyCart,
} = cartSlice.actions;

export default cartSlice.reducer;
