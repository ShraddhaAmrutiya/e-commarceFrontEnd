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
  Role: string; // Added Role
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
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Load userId, userName, and Role from localStorage
const initialState: AuthSlice = {
  isLoggedIn: !!localStorage.getItem("userId"),
  modalOpen: false,
  userName: localStorage.getItem("userName") || "",
  userId: localStorage.getItem("userId") || "",
  accessToken: localStorage.getItem("accessToken") || "",
  Role: localStorage.getItem("Role") || "", // Load Role from localStorage
};

// ✅ Async thunk for user login
export const doLogin = createAsyncThunk(
  "authSlice/doLogin",
  async ({ userName, password }: LoginProps, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:5000/users/login",
        { userName, password }
      );
      
      if (response.data.accessToken) {
        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem("Role", response.data.Role);  // Store role
      } else {
        console.error("❌ No access token received.");
      }
      
      return { 
        userName, 
        isLoggedIn: true, 
        userId: response.data.userId ?? "", 
        accessToken: response.data.accessToken,
        Role: response.data.Role // Return role
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
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");

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
const loginSuccess = (state: AuthSlice, action: PayloadAction<{ userName: string; userId: string; isLoggedIn: boolean; accessToken: string; Role: string }>) => {
  state.userName = action.payload.userName;
  state.userId = action.payload.userId || "";
  state.isLoggedIn = true;
  state.accessToken = action.payload.accessToken || "";
  state.Role = action.payload.Role || ""; // Store Role

  if (action.payload.accessToken) {
    localStorage.setItem("userName", action.payload.userName);
    localStorage.setItem("userId", action.payload.userId || "");
    localStorage.setItem("Role", action.payload.Role); // Store Role
    localStorage.setItem("accessToken", action.payload.accessToken );
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
      localStorage.removeItem("Role");
      state.userName = "";
      state.userId = "";
      state.isLoggedIn = false;
      state.accessToken = "";
      state.Role = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, loginSuccess);
    builder.addCase(doLogin.rejected, (state) => {
      state.isLoggedIn = false;
      state.userName = "";
      state.userId = "";
      state.accessToken = "";
      state.Role = "";
    });
    // builder.addCase(checkAuthStatus.fulfilled, loginSuccess);
    // builder.addCase(checkAuthStatus.rejected, (state) => {
    //   state.isLoggedIn = false;
    //   state.userName = "";
    //   state.userId = "";
    //   state.accessToken = "";
    //   state.Role = "";
    // });
  },
});

export const { updateModal, doLogout } = authSlice.actions;
export default authSlice.reducer;
