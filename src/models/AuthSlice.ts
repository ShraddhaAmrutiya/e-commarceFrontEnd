// src/models/AuthSlice.ts
export interface AuthSlice {
  isLoggedIn: boolean;
  modalOpen: boolean;
  userName: string;
  userId: string;
  accessToken: string;
  loading?: boolean;
  errorMessage?: string;
  successMessage?: string;
  user?: string;
  Role?:string
}


 export interface AuthState {
  user: { _id: string; name: string; email: string } | null;
  token: string | null; 
}