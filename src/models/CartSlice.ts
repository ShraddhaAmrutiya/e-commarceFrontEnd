
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { CartItem } from "../models/CartItem";
// import { RootState } from "../redux/store";

// // Define the shape of the cart state
// export interface CartState {
//   cartOpen: boolean;
//   cartItems: CartItem[];
//   cartCount: number;
//   totalQuantity: number;
//   totalPrice: number;
// }

// // Initial state
// const initialState: CartState = {
//   cartOpen: false,
//   cartItems: [],
//   cartCount: 0,
//   totalQuantity: 0,
//   totalPrice: 0,
// };

// // Helper to recalculate totals
// const recalculateQuantityAndPrice = (state: CartState) => {
//   let totalQty = 0;
//   let totalPrice = 0;

//   state.cartItems.forEach((item) => {
//     const qty = item.quantity ?? 0;
//     const price = item.price ?? 0;
//     totalQty += qty;
//     totalPrice += qty * price;
//   });

//   state.totalQuantity = totalQty;
//   state.totalPrice = totalPrice;
// };

// // Backend response type
// type FetchCartResponse = {
//   cartItems: {
//     productId: CartItem;
//     quantity: number;
//     _id: string;
//   }[];
//   cartCount: number;
// };

// // Async thunk to fetch cart
// export const fetchCartItems = createAsyncThunk(
//   "cart/fetchCartItems",
//   async (userId: string, thunkAPI) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) return thunkAPI.rejectWithValue("User not logged in");

//       const response = await axios.get<FetchCartResponse>(`http://localhost:5000/cart/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });


//       return {

//         cartItems: response.data.cartItems,
//         cartCount: response.data.cartCount,
//       };
//     } catch (err) {
//       return thunkAPI.rejectWithValue("Failed to fetch cart items");
//     }
//   }
// );

// // Slice
// export const cartSlice = createSlice({
//   name: "cartSlice",
//   initialState,

//   reducers: {
//     toggleCart1: (state) => {
//       state.cartOpen = !state.cartOpen;
//     },

//     addToCart: (state, action: PayloadAction<CartItem>) => {
//       const existingIndex = state.cartItems.findIndex(item => item._id === action.payload._id);

//       if (existingIndex === -1) {
//         state.cartItems.push({ ...action.payload, quantity: 1 });
//       } else {
//         state.cartItems[existingIndex].quantity =
//           (state.cartItems[existingIndex].quantity ?? 0) + 1;
//       }

//       state.cartCount += 1;
//       recalculateQuantityAndPrice(state);
//     },

//     removeFromCart: (state, action: PayloadAction<string>) => {
//       const removedItem = state.cartItems.find(item => item._id === action.payload);
//       const removedQty = removedItem?.quantity ?? 0;

//       state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
//       state.cartCount -= removedQty;
//       recalculateQuantityAndPrice(state);
//     },

//     reduceFromCart: (state, action: PayloadAction<string>) => {
//       const index = state.cartItems.findIndex(item => item._id === action.payload);

//       if (index !== -1) {
//         const item = state.cartItems[index];
//         if ((item.quantity ?? 1) > 1) {
//           item.quantity = (item.quantity ?? 1) - 1;
//           state.cartCount -= 1;
//         } else {
//           state.cartItems.splice(index, 1);
//           state.cartCount -= 1;
//         }
//       }

//       recalculateQuantityAndPrice(state);
//     },

//     emptyCart: (state) => {
//       state.cartItems = [];
//       state.cartCount = 0;
//       state.totalQuantity = 0;
//       state.totalPrice = 0;
//     },

//     setCartState: (state, action: PayloadAction<boolean>) => {
//       state.cartOpen = action.payload;
//     },
//   },

//   extraReducers: (builder) => {
//     builder.addCase(fetchCartItems.fulfilled, (state, action) => {
//       state.cartItems = action.payload.cartItems.map((item) => ({
//         _id: item._id,
//         title: item.productId.title,
//         productId: item.productId,
//         price: item.productId.price,
//         rating: item.productId.rating,
//         category: item.productId.category,
//         quantity: item.quantity,
//       }));

//       state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
//       recalculateQuantityAndPrice(state);
//     });

//     builder.addCase(fetchCartItems.rejected, (state, action) => {
//       console.error("❌ Failed to fetch cart:", action.payload);
//       state.cartItems = [];
//       state.cartCount = 0;
//       state.totalQuantity = 0;
//       state.totalPrice = 0;
//     });
//   },
// });

// // Selectors
// export const selectCartItems = (state: RootState) => state.cartReducer.cartItems;
// export const selectCartOpen = (state: RootState) => state.cartReducer.cartOpen;
// export const selectCartCount = (state: RootState) => state.cartReducer.cartCount;
// export const selectTotalQuantity = (state: RootState) => state.cartReducer.totalQuantity;
// export const selectTotalPrice = (state: RootState) => state.cartReducer.totalPrice;

// // Export actions
// export const {
//   toggleCart1,
//   addToCart,
//   removeFromCart,
//   reduceFromCart,
//   emptyCart,
//   setCartState,
// } = cartSlice.actions;

// export default cartSlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { CartItem } from "../models/CartItem";  // Assuming CartItem is defined in your models
import { RootState } from "../redux/store";

// Define the shape of the cart state
export interface CartState {
  cartOpen: boolean;
  cartItems: CartItem[];
  cartCount: number;
  totalQuantity: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CartState = {
  cartOpen: false,
  cartItems: [],
  cartCount: 0,
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error:  null
};

// Helper to recalculate totals
const recalculateQuantityAndPrice = (state: CartState) => {
  let totalQty = 0;
  let totalPrice = 0;

  state.cartItems.forEach((item) => {
    const qty = item.quantity ?? 0;
    const price = item.price ?? 0;
    totalQty += qty;
    totalPrice += qty * price;
  });

  state.totalQuantity = totalQty;
  state.totalPrice = totalPrice;
  state.cartCount = totalQty;  // This will now be consistent with quantity

};



// Backend response type
type FetchCartResponse = {
  cartItems: {
    productId: CartItem;
    quantity: number;
    _id: string;
  }[];
  cartCount: number;
};

// Async thunk to fetch cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return thunkAPI.rejectWithValue("User not logged in");

      const response = await axios.get<FetchCartResponse>(`http://localhost:5000/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure the response has cartItems and cartCount
      if (!response.data.cartItems || !Array.isArray(response.data.cartItems)) {
        return thunkAPI.rejectWithValue("Invalid cart items format");
      }

      return {
        cartItems: response.data.cartItems,
        cartCount: response.data.cartCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch cart items");
    }
  }
);
export const removeCartItem = createAsyncThunk<string, { productId: string, userId: string }, { rejectValue: string }>(
  "cart/removeCartItem",
  async ({ productId, userId }, { rejectWithValue }) => {
    const token = localStorage.getItem("accessToken");

    if (!token) return rejectWithValue("Access token is missing");

    try {
      await axios.delete(`http://localhost:5000/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
// Slice
export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,

  reducers: {
    toggleCart1: (state) => {
      state.cartOpen = !state.cartOpen;
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.cartItems.findIndex(item => item._id === action.payload._id);

      if (existingIndex === -1) {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      } else {
        state.cartItems[existingIndex].quantity =
          (state.cartItems[existingIndex].quantity ?? 0) + 1;
      }

      state.cartCount += 1;
      recalculateQuantityAndPrice(state);
    },

    // removeFromCart: (state, action: PayloadAction<string>) => {
    //   console.log('Entering removeFromCart reducer'); // Add this to check if the reducer is being triggered
    //   state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
    
    //   // Recalculate totals and count
    //   recalculateQuantityAndPrice(state);
    //   console.log('Updated cart items:', state.cartItems); // Check updated cart items

    // },
    


    reduceFromCart: (state, action: PayloadAction<string>) => {
      const index = state.cartItems.findIndex(item => item._id === action.payload);

      if (index !== -1) {
        const item = state.cartItems[index];
        if ((item.quantity ?? 1) > 1) {
          item.quantity = (item.quantity ?? 1) - 1;
          state.cartCount -= 1;
        } else {
          state.cartItems.splice(index, 1);
          state.cartCount -= 1;
        }
      }

      recalculateQuantityAndPrice(state);
    },

    emptyCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },

    setCartState: (state, action: PayloadAction<boolean>) => {
      state.cartOpen = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      state.cartItems = action.payload.cartItems.map((item) => ({
        _id: item._id,
        title: item.productId.title,
        productId: item.productId,
        price: item.productId.price,
        rating: item.productId.rating,
        category: item.productId.category,
        quantity: item.quantity,
      }));

      state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      recalculateQuantityAndPrice(state);
    });

    builder.addCase(fetchCartItems.rejected, (state, action) => {
      console.error("❌ Failed to fetch cart:", action.payload);
      state.cartItems = [];
      state.cartCount = 0;
      state.totalQuantity = 0;
      state.totalPrice = 0;
    })
    .addCase(removeCartItem.pending, (state) => {
      state.loading = true;
    })
    .addCase(removeCartItem.fulfilled, (state, action) => {
      console.log('✅ Successfully removed item from cart:', action.payload);

      state.loading = false;
      state.cartItems = state.cartItems.filter((item) => item.productId._id !== action.payload);
      state.cartCount -= 1; // Adjust cart count
    })
    .addCase(removeCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to remove item from cart.";
    });
  },
});

// Selectors
export const selectCartItems = (state: RootState) => state.cartReducer.cartItems;
export const selectCartOpen = (state: RootState) => state.cartReducer.cartOpen;
export const selectCartCount = (state: RootState) => state.cartReducer.cartCount;
export const selectTotalQuantity = (state: RootState) => state.cartReducer.totalQuantity;
export const selectTotalPrice = (state: RootState) => state.cartReducer.totalPrice;

// Export actions
export const {
  toggleCart1,
  addToCart,
  // removeFromCart,
  reduceFromCart,
  emptyCart,
  setCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
