// src/models/AuthSlice.ts
// src/models/AuthSlice.ts
export interface AuthSlice {
  isLoggedIn: boolean;  // Whether the user is logged in
  modalOpen: boolean;   // Whether the modal is open
  userName: string;     // Logged-in user's name
  userId: string;       // Logged-in user's ID
  accessToken: string;  // The authentication token
  loading?: boolean;    // Optional loading state
  errorMessage?: string; // Optional error message
  successMessage?: string; // Optional success message
  user?: string;        // Optional user information
  Role?: string;        // User role (e.g., 'admin', 'user')
}


 export interface AuthState {
  user: { _id: string; name: string; email: string } | null;
  token: string | null; 
}