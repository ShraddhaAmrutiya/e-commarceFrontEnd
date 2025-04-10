    // // import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
    // // import { CartItem } from "../models/CartItem";
    // // import { RootState } from "../redux/store";

    // // // Define the cart slice state interface
    // // export interface CartState {
    // //   cartOpen: boolean;
    // //   cartItems: CartItem[];
    // //   cartCount: number; // ✅ new
    // //   totalQuantity?: number;
    // //   totalPrice?: number;
    // // }


    // // // Initial state
    // // const initialState: CartState = {
    // //   cartOpen: false,
    // //   cartItems: [],
    // //   cartCount: 0,
    // // };

    // // // Response type from backend
    // // type FetchCartResponse = {
    // //   cartItems: {
    // //     productId: CartItem;
    // //     quantity: number;
    // //     _id: string;
    // //   }[];
    // //   cartCount: number;
    // // };


    // // // Thunk to fetch cart from backend
    // // // export const fetchCartItems = createAsyncThunk<FetchCartResponse, string>(
    // // //   "cart/fetchCartItems",
    // // //   async (userId, { rejectWithValue }) => {
    // // //     try {
    // // //       const token = localStorage.getItem("accessToken");
    // // //       if (!token) return rejectWithValue("User not logged in");

    // // //       const response = await fetch(`http://localhost:5000/cart/${userId}`, {
    // // //         method: "GET",
    // // //         headers: {
    // // //           "Content-Type": "application/json",
    // // //           Authorization: `Bearer ${token}`,
    // // //         },
    // // //       });

    // // //       if (!response.ok) throw new Error("Failed to fetch cart items");

    // // //       return (await response.json()) as FetchCartResponse;
    // // //     } catch (error) {
    // // //       return rejectWithValue((error as Error).message);
    // // //     }
    // // //   }
    // // // );

    // // export const fetchCartItems = createAsyncThunk(
    // //   "cart/fetchCartItems",
    // //   async (userId: string, thunkAPI) => {
    // //     try {
    // //       const response = await axios.get<FetchCartResponse>(`/cart/${userId}`);
    // //       return {
    // //         cartItems: response.data.cartItems,
    // //         cartCount: response.data.cartCount,
    // //       };
    // //     } catch (err) {
    // //       return thunkAPI.rejectWithValue("Failed to fetch cart items");
    // //     }
    // //   }
    // // );


    // // export const cartSlice = createSlice({
    // //   name: "cartSlice",
    // //   initialState,

    // //   reducers: {
    // //     toggleCart1: (state) => {
    // //       state.cartOpen = !state.cartOpen;
    // //     },

    // //     addToCart: (state, action: PayloadAction<CartItem>) => {
    // //       const accessToken = localStorage.getItem("accessToken");
    // //       if (!accessToken) return;

    // //       const existingIndex = state.cartItems.findIndex(
    // //         (item) => item._id === action.payload._id
    // //       );

    // //       if (existingIndex === -1) {
    // //         state.cartItems.push({ ...action.payload, quantity: 1 });
    // //       } else {
    // //         state.cartItems[existingIndex].quantity =
    // //           (state.cartItems[existingIndex].quantity ?? 0) + 1;
    // //       }
    // //     },

    // //     removeFromCart: (state, action: PayloadAction<string>) => {
    // //       state.cartItems = state.cartItems.filter(
    // //         (item) => item._id !== action.payload
    // //       );
    // //     },

    // //     reduceFromCart: (state, action: PayloadAction<string>) => {
    // //       const index = state.cartItems.findIndex(
    // //         (item) => item._id === action.payload
    // //       );

    // //       if (index !== -1) {
    // //         const currentItem = state.cartItems[index];
    // //         if ((currentItem.quantity ?? 1) > 1) {
    // //           currentItem.quantity = (currentItem.quantity ?? 1) - 1;
    // //         } else {
    // //           state.cartItems.splice(index, 1);
    // //         }
    // //       }
    // //     },

    // //     emptyCart: (state) => {
    // //       state.cartItems = [];
    // //     },

    // //     setCartState: (state, action: PayloadAction<boolean>) => {
    // //       state.cartOpen = action.payload;
    // //     },
    // //   },

    // //   extraReducers: (builder) => {
    // //     builder.addCase(fetchCartItems.fulfilled, (state, action) => {
    // //       state.cartItems = action.payload.cartItems.map((item) => ({
    // //         ...item.productId,
    // //         _id: item._id,
    // //         quantity: item.quantity,
    // //       }));
        
    // //       // Correct cart count calculation: sum of quantities
    // //       state.cartCount = action.payload.cartItems.reduce(
    // //         (total, item) => total + item.quantity,
    // //         0
    // //       );
    // //     });
        
    // //     builder.addCase(fetchCartItems.rejected, (state, action) => {
    // //       console.error("❌ Failed to fetch cart:", action.payload);
    // //       state.cartItems = [];
    // //     });
    // //   },
    // // });

    // // // Selectors
    // // export const selectCartItems = (state: RootState) => state.cartReducer.cartItems;

    // // export const selectTotalQuantity = (state: RootState) =>
    // //   state.cartReducer.cartItems.reduce(
    // //     (acc, item) => acc + (item.quantity ?? 0),
    // //     0
    // //   );

    // // export const selectTotalPrice = (state: RootState) =>
    // //   state.cartReducer.cartItems.reduce(
    // //     (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    // //     0
    // //   );

    // // // Export actions
    // // export const {
    // //   toggleCart1,
    // //   addToCart,
    // //   removeFromCart,
    // //   reduceFromCart,
    // //   emptyCart,
    // //   setCartState,
    // // } = cartSlice.actions;

    // // export default cartSlice.reducer;
    // import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
    // import { CartItem } from "../models/CartItem";
    // import { RootState } from "../redux/store";
    // import axios from "axios";

    // // Cart state interface
    // export interface CartState {
    //   cartOpen: boolean;
    //   cartItems: CartItem[];
    //   cartCount: number;
    //   totalQuantity?: number;
    //   totalPrice?: number;
    // }

    // // Initial state
    // const initialState: CartState = {
    //   cartOpen: false,
    //   cartItems: [],
    //   cartCount: 0,
    //   totalQuantity: 0,
    //   totalPrice: 0,
    // };

    // // Helper function to recalculate quantity and price
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

    // // Type from backend
    // type FetchCartResponse = {
    //   cartItems: {
    //     productId: CartItem;
    //     quantity: number;
    //     _id: string;
    //   }[];
    //   cartCount: number;
    // };

    // // Async thunk
    // export const fetchCartItems = createAsyncThunk(
    //   "cart/fetchCartItems",
    //   async (userId: string, thunkAPI) => {
    //     try {
    //       const token = localStorage.getItem("accessToken");
    //       if (!token) return thunkAPI.rejectWithValue("User not logged in");

    //       const response = await axios.get<FetchCartResponse>(`http://localhost:5000/cart/${userId}`, {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       });

    //       console.log("🛒 Backend cart data:", response.data);

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
    //       const existingIndex = state.cartItems.findIndex(
    //         (item) => item._id === action.payload._id
    //       );

    //       if (existingIndex === -1) {
    //         state.cartItems.push({ ...action.payload, quantity: 1 });
    //       } else {
    //         state.cartItems[existingIndex].quantity =
    //           (state.cartItems[existingIndex].quantity ?? 0) + 1;
    //       }

    //       // Recalculate cartCount manually since backend wasn't involved
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

    //   extraReducers: 
    //   (builder) => {
    //     // builder.addCase(fetchCartItems.fulfilled, (state, action) => {
    //     //   state.cartItems = action.payload.cartItems.map((item) => ({
    //     //     ...item.productId,
    //     //     _id: item._id,
    //     //     quantity: item.quantity,
    //     //   }));
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
        
    //       // Recalculate cartCount based on quantities in the fetched items
    //       state.cartCount = state.cartItems.reduce((total, item) => total + item.quantity, 0);
        
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
    // export const selectTotalQuantity = (state: RootState) => state.cartReducer.totalQuantity ?? 0;
    // export const selectTotalPrice = (state: RootState) => state.cartReducer.totalPrice ?? 0;
    // export const selectCartCount = (state: RootState) => state.cartReducer.cartCount;
    // export const selectCartOpen = (state: RootState) => state.cartReducer.cartOpen;

    // // Export actions and reducer
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
import { CartItem } from "../models/CartItem";
import { RootState } from "../redux/store";

// Define the shape of the cart state
export interface CartState {
  cartOpen: boolean;
  cartItems: CartItem[];
  cartCount: number;
  totalQuantity: number;
  totalPrice: number;
}

// Initial state
const initialState: CartState = {
  cartOpen: false,
  cartItems: [],
  cartCount: 0,
  totalQuantity: 0,
  totalPrice: 0,
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

// Async thunk to fetch cart
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return thunkAPI.rejectWithValue("User not logged in");

      const response = await axios.get<FetchCartResponse>(`http://localhost:5000/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🛒 Backend cart data:", response.data);

      return {
        cartItems: response.data.cartItems,
        cartCount: response.data.cartCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch cart items");
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

    removeFromCart: (state, action: PayloadAction<string>) => {
      const removedItem = state.cartItems.find(item => item._id === action.payload);
      const removedQty = removedItem?.quantity ?? 0;

      state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
      state.cartCount -= removedQty;
      recalculateQuantityAndPrice(state);
    },

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
  removeFromCart,
  reduceFromCart,
  emptyCart,
  setCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
