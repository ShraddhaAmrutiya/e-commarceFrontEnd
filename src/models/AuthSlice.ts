export interface AuthSlice {
  isLoggedIn: boolean;
  modalOpen: boolean;
  userName: string;
  userId?: string ; 
  accessToken?:string
}
