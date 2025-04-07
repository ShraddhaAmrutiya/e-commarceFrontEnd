

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

// ** Define Wishlist Item Type **
interface WishlistItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    salePrice: number;
    discountPercentage: number;
  };
}

// ** Define Wishlist State **
interface WishlistState {
  wishlistItems: WishlistItem[];
  loading: boolean;
  error: string | null;
}

// ** Fetch Wishlist Items **
export const fetchWishlistItems = createAsyncThunk<
  WishlistItem[],
  void,
  { state: RootState }
>(
  "wishlist/fetchWishlistItems",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.authReducer.userId;
      const token = localStorage.getItem("authToken");

      if (!userId) return rejectWithValue("User ID is missing");

      const response = await axios.get(
        `http://localhost:5000/wishlist/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data as WishlistItem[];
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch wishlist"
      );
    }
  }
);

// ** Add Item to Wishlist **
export const addWishlistItem = createAsyncThunk<
  WishlistItem,
  { productId: string },
  { state: RootState }
>(
  "wishlist/addWishlistItem",
  async ({ productId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.authReducer.userId;
      const token = localStorage.getItem("authToken");

      if (!userId) return rejectWithValue("User ID is missing");

      const response = await axios.post(
        `http://localhost:5000/wishlist/add`,
        { productId },
        { headers: { Authorization: `Bearer ${token}`, userId } }
      );

      return response.data as WishlistItem;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add item to wishlist"
      );
    }
  }
);

// ** Remove Item from Wishlist **
export const removeWishlistItem = createAsyncThunk<
  string, // Returns productId if successful
  { productId: string },
  { state: RootState }
>(
  "wishlist/removeWishlistItem",
  async ({ productId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.authReducer.userId;
      const token = localStorage.getItem("authToken");

      if (!userId) return rejectWithValue("User ID is missing");

      await axios.delete(
        `http://localhost:5000/wishlist/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}`, userId } }
      );

      return productId; // Return productId to update Redux state
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to remove item from wishlist"
      );
    }
  }
);

// ** Initial State **
const initialState: WishlistState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

// ** Wishlist Slice **
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Wishlist Items
      .addCase(fetchWishlistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.loading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlistItems.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "An error occurred";
      })

      // ✅ Add Wishlist Item
      .addCase(addWishlistItem.fulfilled, (state, action: PayloadAction<WishlistItem>) => {
        if (!state.wishlistItems.some((item) => item._id === action.payload._id)) {
          state.wishlistItems.push(action.payload);
        }
      })

      // ✅ Remove Wishlist Item - Fix for UI Update
      .addCase(removeWishlistItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item.productId._id !== action.payload
        );
      });
  },
});

export default wishlistSlice.reducer;
