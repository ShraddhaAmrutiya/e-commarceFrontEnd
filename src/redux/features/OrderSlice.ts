  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
  import axios from "axios";
  import { toast } from "react-toastify";

  export interface OrderItem {
    productId: string;
    quantity: number;
    name: string;
    description: string;
    price: number;
    salePrice: number;
    images:string[];
    totalPrice: number;
    orderTotal: number;
  }


  export interface Order {
    orderId: string;
    createdAt: string;
    totalPrice: number;
    orderTotal: number;
    status: string;
    products: OrderItem[];
  }

  interface OrderResponse {
    message: string;
    redirectUrl: string;
    pastOrders: Order[];
  }

  interface OrderState {
    orders: OrderResponse | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  }

  const initialState: OrderState = {
    orders: null,
    status: "idle",
    error: null,
  };

  export const placeOrder = createAsyncThunk(
    "orders/placeOrder",
    async (orderData: { userId: string; items: OrderItem[]; totalAmount: number }, thunkAPI) => {
      try {
        const response = await axios.post("/orders", orderData);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Failed to place order.");
          return thunkAPI.rejectWithValue(error.message);
        } else if (typeof error === "object" && error !== null && "response" in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          const errorMsg = axiosError.response?.data?.message || "Failed to place order.";
          toast.error(errorMsg);
          return thunkAPI.rejectWithValue(errorMsg);
        } else {
          toast.error("Failed to place order.");
          return thunkAPI.rejectWithValue("Unknown error occurred");
        }
      }
    }
  );

  // ✅ Fetch user's orders
  export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (userId: string, thunkAPI) => {
      try {
        const response = await axios.get(`/order/redirect/${userId}`);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Order placement error:", error.message);
          toast.error("Failed to place order.");
          return thunkAPI.rejectWithValue(error.message);
        } else if (typeof error === "object" && error !== null && "response" in error) {
          const axiosError = error as { response?: { data?: { message?: string } } };
          const errorMsg = axiosError.response?.data?.message || "Failed to place order.";
          toast.error(errorMsg);
          return thunkAPI.rejectWithValue(errorMsg);
        } else {
          toast.error("Failed to place order.");
          return thunkAPI.rejectWithValue("Unknown error occurred");
        }
      }
    }
  );

  const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // placeOrder
        .addCase(placeOrder.pending, (state) => {
          state.status = "loading";
        })
        .addCase(placeOrder.fulfilled, (state, action) => {
          state.status = "succeeded";
          if (state.orders) {
            state.orders.pastOrders.unshift(action.payload as Order);
          } else {
            state.orders = {
              message: "Order placed",
              redirectUrl: "",
              pastOrders: [action.payload as Order],
            };
          }
        })      
        .addCase(placeOrder.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload as string;
        })

        // fetchOrders
        .addCase(fetchOrders.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.orders = action.payload as OrderResponse;
        })
        

        .addCase(fetchOrders.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload as string;
        });
    },
  });

  export default orderSlice.reducer;
