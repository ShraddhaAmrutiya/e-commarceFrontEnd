import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../models/CartItem";
import { RootState } from "../redux/store";

// Define the cart slice state interface
export interface CartState {
  cartOpen: boolean;
  cartItems: CartItem[];
  totalQuantity?: number;
  totalPrice?: number;
}

// Initial state
const initialState: CartState = {
  cartOpen: false,
  cartItems: [],
};

// Response type from backend
type FetchCartResponse = {
  _id: string;
  userId: string;
  products: {
    productId: CartItem;
    quantity: number;
    _id: string;
  }[];
  __v: number;
};

// Thunk to fetch cart from backend
export const fetchCartItems = createAsyncThunk<FetchCartResponse, string>(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("User not logged in");

      const response = await fetch(`http://localhost:5000/cart/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cart items");

      return (await response.json()) as FetchCartResponse;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,

  reducers: {
    toggleCart1: (state) => {
      state.cartOpen = !state.cartOpen;
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const existingIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingIndex === -1) {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      } else {
        state.cartItems[existingIndex].quantity =
          (state.cartItems[existingIndex].quantity ?? 0) + 1;
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    },

    reduceFromCart: (state, action: PayloadAction<string>) => {
      const index = state.cartItems.findIndex(
        (item) => item._id === action.payload
      );

      if (index !== -1) {
        const currentItem = state.cartItems[index];
        if ((currentItem.quantity ?? 1) > 1) {
          currentItem.quantity = (currentItem.quantity ?? 1) - 1;
        } else {
          state.cartItems.splice(index, 1);
        }
      }
    },

    emptyCart: (state) => {
      state.cartItems = [];
    },

    setCartState: (state, action: PayloadAction<boolean>) => {
      state.cartOpen = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      const products = action.payload.products || [];
      state.cartItems = products.map((p) => ({
        ...p.productId,
        quantity: p.quantity,
      }));
    });

    builder.addCase(fetchCartItems.rejected, (state, action) => {
      console.error("❌ Failed to fetch cart:", action.payload);
      state.cartItems = [];
    });
  },
});

// Selectors
export const selectCartItems = (state: RootState) => state.cartReducer.cartItems;

export const selectTotalQuantity = (state: RootState) =>
  state.cartReducer.cartItems.reduce(
    (acc, item) => acc + (item.quantity ?? 0),
    0
  );

export const selectTotalPrice = (state: RootState) =>
  state.cartReducer.cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

// Export actions
export const {
  toggleCart1,
  addToCart,
  removeFromCart,
  reduceFromCart,
  emptyCart,
  setCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
