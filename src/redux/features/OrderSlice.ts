import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  status: "idle",
  error: null,
};

// ✅ Place a new order
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
        state.orders.unshift(action.payload as Order); // 👈 Cast to Order
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
        state.orders = action.payload as Order[]; // 👈 cast properly
      })
      

      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
