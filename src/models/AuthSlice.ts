export interface AuthSlice {
  isLoggedIn: boolean;
  modalOpen: boolean;
  userName: string;
  userId?: string ; 
  accessToken?:string;
  user?:string
  token?:string
}

 export interface AuthState {
  user: { _id: string; name: string; email: string } | null;
  token: string | null;
}