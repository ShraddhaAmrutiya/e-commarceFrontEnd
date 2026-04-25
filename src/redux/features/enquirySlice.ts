import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Enquiry {
  id: string;
  productName: string;
  productImage: string;
  productPrice: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

interface EnquiryState {
  enquiries: Enquiry[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  lastEnquiry: Enquiry | null;
}

const initialState: EnquiryState = {
  enquiries: [],
  isLoading: false,
  isSuccess: false,
  error: null,
  lastEnquiry: null,
};

const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {
    // Start enquiry submission
    submitEnquiryStart: (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.error = null;
    },

    // Success - enquiry submitted
    submitEnquirySuccess: (state, action: PayloadAction<Enquiry>) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.error = null;
      state.lastEnquiry = action.payload;
      state.enquiries.push(action.payload);
    },

    // Error - enquiry submission failed
    submitEnquiryError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = action.payload;
    },

    // Reset enquiry state
    resetEnquiryState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
      state.lastEnquiry = null;
    },

    // Clear error
    clearEnquiryError: (state) => {
      state.error = null;
    },

    // Set enquiries (for fetching all)
    setEnquiries: (state, action: PayloadAction<Enquiry[]>) => {
      state.enquiries = action.payload;
    },
  },
});

export const {
  submitEnquiryStart,
  submitEnquirySuccess,
  submitEnquiryError,
  resetEnquiryState,
  clearEnquiryError,
  setEnquiries,
} = enquirySlice.actions;

export default enquirySlice.reducer;
