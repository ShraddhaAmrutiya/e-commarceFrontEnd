// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { AuthSlice } from "../../models/AuthSlice";

// interface LoginProps {
//   username: string;
//   password: string;
// }

// const initialState: AuthSlice = {
//   isLoggedIn:
//     localStorage.getItem("username") !== null &&
//     localStorage.getItem("username") !== undefined &&
//     localStorage.getItem("username") !== "",
//   modalOpen: false,
//   username: localStorage.getItem("username") ?? "",
// };

// export const authSlice = createSlice({
//   name: "authSlice",
//   initialState,
//   reducers: {
//     updateModal: (state, action: PayloadAction<boolean>) => {
//       return { ...state, modalOpen: action.payload };
//     },
//     doLogin: (state, action: PayloadAction<LoginProps>) => {
//       if (
//         action.payload.username === "atuny0" &&
//         action.payload.password === "9uQFF1Lh"
//       ) {
//         localStorage.setItem("username", "atuny0");
//         return {
//           ...state,
//           username: "atuny0",
//           modalOpen: false,
//           isLoggedIn: true,
//         };
//       } else {
//         return state;
//       }
//     },
//     doLogout: (state) => {
//       localStorage.removeItem("username");
//       return { ...state, username: "", isLoggedIn: false };
//     },
//   },
// });

// export const { updateModal, doLogin, doLogout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthSlice } from "../../models/AuthSlice";

interface LoginProps {
  username: string;
  password: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
}

export const doLogin = createAsyncThunk(
  "authSlice/doLogin",
  async ({ username, password }: LoginProps, { rejectWithValue }) => {
    try {
      await axios.post<LoginResponse>("http://localhost:5000/users/login", {
        userName: username,
        password,
      }, { withCredentials: true });
      
      localStorage.setItem("username", username);

      return { username, isLoggedIn: true };
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data: { message: string } } };
        return rejectWithValue(err.response?.data?.message || "Login failed");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// ✅ New: Check user authentication status
export const checkAuthStatus = createAsyncThunk(
  "authSlice/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ username: string }>("http://localhost:5000/users/auth-status", {
        withCredentials: true, // ✅ Needed for token verification via cookies
      });

      return { username: response.data.username, isLoggedIn: true };
    } catch {
      return rejectWithValue("Not authenticated");
    }
  }
);

const initialState: AuthSlice = {
  isLoggedIn: false, // ✅ Default to false, and update after verification
  modalOpen: false,
  username: "",
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    updateModal: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    doLogout: (state) => {
      localStorage.removeItem("username");
      state.username = "";
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, action) => {
      state.username = action.payload.username;
      state.isLoggedIn = true;
      state.modalOpen = false;
    });

    builder.addCase(doLogin.rejected, (state, action) => {
      console.error("Login failed:", action.payload);
      state.isLoggedIn = false;
      state.username = "";
    });

    // ✅ Handle auth status check
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      state.username = action.payload.username;
      state.isLoggedIn = true;
    });

    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.isLoggedIn = false;
      state.username = "";
    });
  },
});

export const { updateModal, doLogout } = authSlice.actions;
export default authSlice.reducer;
