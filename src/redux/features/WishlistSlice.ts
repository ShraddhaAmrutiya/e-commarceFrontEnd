import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { RootState } from "../store";
import BASE_URL from "../../config/apiconfig";
interface WishlistItem {
  _id: string;
  userId: string;
  products: {
    productId: {
      _id: string;
      title: string;
      description: string[];
      images: string[];
      price: number;
      salePrice: number;
      discountPercentage: number;
    };
    quantity: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface WishlistState {
  wishlistItems: WishlistItem[];
  loading: boolean;
  error: string | null;
}

// Fetch Wishlist Items
export const fetchWishlistItems = createAsyncThunk<WishlistItem[], void, { state: RootState }>(
  "wishlist/fetchWishlistItems",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.authReducer.userId;
      const token = localStorage.getItem("accessToken");
      const language = localStorage.getItem("language") || "en";

      if (!userId || !token) return rejectWithValue("User ID or access token is missing");

      const response = await axiosInstance.get(`${BASE_URL}/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}`, "Accept-Language": language },
      });

      return response.data as WishlistItem[];
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };

      if (err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Add Item to Wishlist
export const addWishlistItem = createAsyncThunk<WishlistItem, { productId: string }, { state: RootState }>(
  "wishlist/addWishlistItem",
  async ({ productId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.authReducer.userId;
      const token = localStorage.getItem("accessToken");
      const language = localStorage.getItem("language") || "en";

      if (!userId || !token) return rejectWithValue("User ID or access token is missing");

      const response = await axiosInstance.post(
        `${BASE_URL}/wishlist/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
            userId,
          },
        }
      );

      return response.data as WishlistItem;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Remove Item from Wishlist
export const removeWishlistItem = createAsyncThunk<string, { productId: string }, { state: RootState }>(
  "wishlist/removeWishlistItem",
  async ({ productId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.authReducer.userId;
      const token = localStorage.getItem("accessToken");
      const language = localStorage.getItem("language") || "en";
      if (!userId || !token) return rejectWithValue("User ID or access token is missing");

      await axiosInstance.delete(`${BASE_URL}/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
          userId,
        },
      });

      return productId;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const initialState: WishlistState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlistItems(state) {
      state.wishlistItems = []; 
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === "string" ? action.payload : "Failed to fetch wishlist";
      })

      // Add
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        if (!state.wishlistItems.some((item) => item._id === action.payload._id)) {
          state.wishlistItems.push(action.payload);
        }
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        state.error = typeof action.payload === "string" ? action.payload : "Failed to add item to wishlist";
      })

      // Remove item from wishlist
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.wishlistItems = state.wishlistItems
          .map((wishlist) => {
            const filteredProducts = wishlist.products.filter(
              (item) => item.productId && item.productId._id !== action.payload
            );

            if (filteredProducts.length > 0) {
              return { ...wishlist, products: filteredProducts };
            }
            return null;
          })
          .filter((wishlist): wishlist is WishlistItem => wishlist !== null);
      })

      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.error = typeof action.payload === "string" ? action.payload : "Failed to remove item from wishlist";
      });
  },
});

export const { resetWishlistItems } = wishlistSlice.actions;

export default wishlistSlice.reducer;
