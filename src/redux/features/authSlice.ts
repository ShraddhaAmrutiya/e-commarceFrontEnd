import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthSlice } from "../../models/AuthSlice";
import { toast } from "react-toastify";
import BASE_URL from "../../config/apiconfig";
interface LoginProps {
  userName: string;
  password: string;
}

interface LoginResponse {
  message?: string;
  accessToken: string;
  userId?: string;
  userName: string;
  Role: string;
}

axios.defaults.baseURL = `${BASE_URL}`;
axios.defaults.withCredentials = true;

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

const initialState: AuthSlice = {
  isLoggedIn: !!localStorage.getItem("userId"),
  modalOpen: false,
  userName: localStorage.getItem("userName") || "",
  userId: localStorage.getItem("userId") || "",
  accessToken: localStorage.getItem("accessToken") || "",
  Role: localStorage.getItem("Role") || "",
};

export const doLogin = createAsyncThunk(
  "authSlice/doLogin",
  async ({ userName, password }: LoginProps, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/users/login`,
        { userName, password }
      );

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userName", response.data.userName);
        localStorage.setItem("userId", response.data.userId ?? "");
        localStorage.setItem("Role", response.data.Role);

        toast.success("Login successful!");

        return {
          userName: response.data.userName,
          userId: response.data.userId ?? "",
          accessToken: response.data.accessToken,
          Role: response.data.Role,
          isLoggedIn: true,
        };
      } else {
        toast.error("No access token received.");
        return rejectWithValue("No access token received.");
      }
    } catch (error: unknown) {
      console.log("Error in login:", error);

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data: { message: string } } };
        const errorMessage = err.response?.data?.message || "Login failed";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

      toast.error("An unexpected error occurred");
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "authSlice/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");

      if (!userId || userId === "undefined") {
        return rejectWithValue("Not authenticated");
      }

      return { userName: userName || "", userId, isLoggedIn: true };
    } catch (error) {
      return rejectWithValue("Not authenticated");
    }
  }
);

const loginSuccess = (
  state: AuthSlice,
  action: PayloadAction<{
    userName: string;
    userId: string;
    accessToken: string;
    Role: string;
    isLoggedIn: boolean;
  }>
) => {
  state.userName = action.payload.userName;
  state.userId = action.payload.userId;
  state.accessToken = action.payload.accessToken;
  state.Role = action.payload.Role;
  state.isLoggedIn = true;

  localStorage.setItem("userName", action.payload.userName);
  localStorage.setItem("userId", action.payload.userId);
  localStorage.setItem("accessToken", action.payload.accessToken);
  localStorage.setItem("Role", action.payload.Role);
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    updateModal: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    setAuthUser: (state, action) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.Role = action.payload.Role;
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
    setUser: (
      state,
      action: PayloadAction<{
        userName: string;
        userId: string;
        accessToken: string;
        Role: string;
      }>
    ) => {
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.accessToken = action.payload.accessToken;
      state.Role = action.payload.Role;
      state.isLoggedIn = true;

      localStorage.setItem("userName", action.payload.userName);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("Role", action.payload.Role);
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
  },
});

export const { updateModal,setAuthUser, doLogout, setUser } = authSlice.actions;
export default authSlice.reducer;
