
// export const { updateModal, doLogout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthSlice } from "../../models/AuthSlice";

interface LoginProps {
  userName: string;
  password: string;
}

interface LoginResponse {
  message?: string;
  accessToken: string;
  userId?: string;
  userName: string;
}

// ✅ Set up Axios defaults
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

// ✅ Attach token to all outgoing requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["token"] = token; // 👈 Ensure this matches your backend's expected key
      // console.log("📤 Attaching Token to Request:", token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Load userId and userName from localStorage
const initialState: AuthSlice = {
  isLoggedIn: !!localStorage.getItem("userId"),
  modalOpen: false,
  userName: localStorage.getItem("userName") || "",
  userId: localStorage.getItem("userId") || "",
  accessToken: localStorage.getItem("accessToken") || "",
};

// ✅ Async thunk for user login
export const doLogin = createAsyncThunk(
  "authSlice/doLogin",
  async ({ userName, password }: LoginProps, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        "/users/login",
        { userName, password }
      );
      if (response.data.accessToken) {
        localStorage.setItem("authToken", response.data.accessToken); // ✅ Store correctly
        // console.log("🔒 Stored Token in LocalStorage:", response.data.accessToken);
      } else {
        console.error("❌ No access token received.");
      }
      
      // console.log("🔑 Login response:", response.data);

      return { 
        userName, 
        isLoggedIn: true, 
        userId: response.data.userId ?? "", 
        accessToken: response.data.accessToken 
      };
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data: { message: string } } };
        return rejectWithValue(err.response?.data?.message || "Login failed");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// ✅ Check authentication status
export const checkAuthStatus = createAsyncThunk(
  "authSlice/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("🔄 Checking Auth Status...");

      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");

      // console.log("📥 Retrieved userId from LocalStorage:", userId);
      // console.log("📥 Retrieved userName from LocalStorage:", userName);

      if (!userId || userId === "undefined") {
        console.error("Please login!");
        return rejectWithValue("Not authenticated");
      }

      return { userName: userName || "", userId, isLoggedIn: true };
    } catch (error) {
      console.error("⚠️ Error in checkAuthStatus:", error);
      return rejectWithValue("Not authenticated");
    }
  }
);

// ✅ Handle successful login
const loginSuccess = (state: AuthSlice, action: PayloadAction<{ userName: string; userId?: string; isLoggedIn: boolean; accessToken?: string; }>) => {
  // console.log("✅ Storing Token in State:", action.payload.accessToken);

  state.userName = action.payload.userName;
  state.userId = action.payload.userId || ""; // Avoid undefined
  state.isLoggedIn = true;
  state.accessToken = action.payload.accessToken || ""; // Ensure a string

  if (action.payload.accessToken) {
    localStorage.setItem("userName", action.payload.userName);
    localStorage.setItem("userId", action.payload.userId ?? "");
    localStorage.setItem("accessToken", action.payload.accessToken ||"");
    console.log("🔒 Stored Token in LocalStorage:", action.payload.accessToken);
  } else {
    console.error("❌ No access token received, login may have failed.");
  }
};

// ✅ Create the authentication slice
export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    updateModal: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    doLogout: (state) => {
      
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      localStorage.removeItem("accessToken");
      state.userName = "";
      state.userId = "";
      state.isLoggedIn = false;
      state.accessToken = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, loginSuccess);
    builder.addCase(doLogin.rejected, (state) => {
      state.isLoggedIn = false;
      state.userName = "";
      state.userId = "";
      state.accessToken = "";
    });
    builder.addCase(checkAuthStatus.fulfilled, loginSuccess);
    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.isLoggedIn = false;
      state.userName = "";
      state.userId = "";
      state.accessToken = "";
    });
  },
});

export const { updateModal, doLogout } = authSlice.actions;
export default authSlice.reducer;
