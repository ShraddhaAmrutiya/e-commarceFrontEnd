
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../../models/CartItem";
import { CartState } from "../../models/CartSlice";

const initialState: CartState = {
  cartOpen: false,
  cartItems: [],
  cartCount: 0,
  totalQuantity: 0,
  totalPrice: 0,
  loading: true,
  error: null
};

const recalculateCartState = (state: CartState) => {
  state.cartCount = state.cartItems.length;
  state.totalQuantity = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  state.totalPrice = state.cartItems.reduce((acc, item) => {
    const price = item.productId?.price ?? 0;
    return acc + item.quantity * price;
  }, 0);
};


export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,

  reducers: {
    toggleCart1: (state: CartState) => {
      state.cartOpen = !state.cartOpen;
    },

    resetCartItems(state) {
      state.cartItems = []; // Reset cart to an empty array
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
      recalculateCartState(state); 
    },

    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      // Filter out items with missing productId (e.g., deleted products)
      state.cartItems = action.payload.filter(
        (item) => item.productId && typeof item.productId === "object"
      );
    
      recalculateCartState(state);
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
      recalculateCartState(state);
    },
  
    removeFromCart: (state, action: PayloadAction<string>) => {
      
      state.cartItems = state.cartItems.filter(item => item.productId._id !== action.payload); // Remove item using filter
      recalculateCartState(state); // 👈 Use helper to recalculate

    },
    updateCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
    setCartState: (state, action: PayloadAction<boolean>) => {
      return { ...state, cartOpen: action.payload };
    },

    emptyCart: (state) => {
      return { ...state, cartItems: [] }; // Empty cart
    },
  },
});

export const {
  addToCart,
  updateCartCount,
  resetCartItems,
  toggleCart1,
  removeFromCart,
  setCartState,
  reduceFromCart,
  emptyCart,
  setCartItems
} = cartSlice.actions;

export default cartSlice.reducer;
