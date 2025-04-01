import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../models/CartItem";

// Define the cart slice state interface
export interface CartState {
  cartOpen: boolean;
  cartItems: CartItem[];
  totalQuantity?:number;
  totalPrice?:number
}

// Initial state
const initialState: CartState = {
  cartOpen: false,
  cartItems: [],
};

// type FetchCartResponse = CartItem[];

type FetchCartResponse = {
  _id: string;
  userId: string;
  products: {
    productId: CartItem; // The actual product details
    quantity: number;
    _id: string;
  }[];
  __v: number;
};


export const fetchCartItems = createAsyncThunk<FetchCartResponse, string>(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken"); // 🔍 Make sure this key matches the stored one!
      // console.log("🔍 LocalStorage Token:", token); // ✅ Debugging line

      if (!token) {
        console.error("❌ User not logged in. No token found.");
        return rejectWithValue("User not logged in");
      }

      const response = await fetch(`http://localhost:5000/cart/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
        },
      });

      // console.log("📡 Sending Request with Headers:", {
      //   "Content-Type": "application/json",
      //   Authorization: `Bearer ${token}`,
      // });

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
export const selectTotalQuantity = (state: CartState) => 
  state.cartItems.reduce((acc, item) => acc + (item.quantity ?? 0), 0);

export const selectTotalPrice = (state: CartState) => 
  state.cartItems.reduce((acc, item) => acc + (item.price * (item.quantity ?? 1)), 0);


// Export actions
export const {
  toggleCart1,
  addToCart,
  removeFromCart,
  reduceFromCart,
  emptyCart,
} = cartSlice.actions;

export default cartSlice.reducer;

