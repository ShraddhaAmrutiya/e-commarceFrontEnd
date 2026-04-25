import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import productReducer from "./features/productSlice";
import homeReducer from "./features/homeSlice";
import wishlistReducer from "./features/WishlistSlice";
import orderReducer from "./features/OrderSlice";
import themeReducer from "./features/themeSlice";
import enquiryReducer from "./features/enquirySlice";

export const store = configureStore({
  reducer: {
    cartReducer,
    productReducer,
    authReducer,
    homeReducer,
    wishlistReducer,
    orderReducer,
    themeReducer,
    enquiryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;