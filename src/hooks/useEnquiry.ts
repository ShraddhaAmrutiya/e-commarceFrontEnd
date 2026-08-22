import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  submitEnquiryStart,
  submitEnquirySuccess,
  submitEnquiryError,
  resetEnquiryState,
  clearEnquiryError,
} from "../redux/features/enquirySlice";
import { RootState } from "../redux/store";

export interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  productName?: string;
  productImage?: string;
  productPrice?: string;
}

export const useEnquiry = () => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, error, lastEnquiry } = useSelector(
    (state: RootState) => state.enquiryReducer
  );

  // Submit enquiry
  const submitEnquiry = useCallback(
    async (data: EnquiryFormData) => {
      try {
        dispatch(submitEnquiryStart());

        // Validate form data
        if (!data.name || !data.email || !data.phone || !data.message) {
          throw new Error("All fields are required");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new Error("Please enter a valid email address");
        }

        // Phone validation (basic - at least 10 digits)
        const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
        if (!phoneRegex.test(data.phone) || data.phone.replace(/\D/g, "").length < 10) {
          throw new Error("Please enter a valid phone number");
        }

        // Call backend API (replace with your actual endpoint)
        const response = await fetch("/api/enquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            createdAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to submit enquiry: ${response.statusText}`);
        }

        const enquiry = await response.json();
        dispatch(submitEnquirySuccess(enquiry));
        return enquiry;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to submit enquiry";
        dispatch(submitEnquiryError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  // Reset state
  const reset = useCallback(() => {
    dispatch(resetEnquiryState());
  }, [dispatch]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch(clearEnquiryError());
  }, [dispatch]);

  return {
    isLoading,
    isSuccess,
    error,
    lastEnquiry,
    submitEnquiry,
    reset,
    clearError,
  };
};
