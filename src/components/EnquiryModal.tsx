import React, { useState, useEffect } from "react";
import { useEnquiry, EnquiryFormData } from "../hooks/useEnquiry";
import { MdClose, MdCheckCircle, MdPhone, MdMailOutline } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productImage?: string;
  productPrice?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  productName = "",
  productImage = "",
  productPrice = "",
}) => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    productName,
    productImage,
    productPrice,
  });

  const { isLoading, isSuccess, error, submitEnquiry, reset } = useEnquiry();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        productName,
        productImage,
        productPrice,
      });
      reset();
    }
  }, [isOpen, reset, productName, productImage, productPrice]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitEnquiry(formData);
    } catch (err) {
      console.error("Enquiry submission failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600 px-6 py-4 flex items-center justify-between">
            <div>
              <h2
                id="enquiry-modal-title"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Get Enquiry
              </h2>
              {productName && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {productName}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1"
              aria-label="Close modal"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success State */}
            {isSuccess && (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <MdCheckCircle className="text-green-500" size={64} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your enquiry has been submitted successfully. We'll get back to you soon at{" "}
                  <span className="font-semibold">{formData.email}</span>
                </p>
                <div className="bg-amber-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Expected response time: <strong>24-48 hours</strong>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {/* Form State */}
            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Product Info */}
                {productImage && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex gap-3">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-16 h-16 object-cover rounded"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {productName}
                      </p>
                      {productPrice && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {productPrice}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all disabled:opacity-50"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <span className="flex items-center gap-2">
                      <MdMailOutline size={16} />
                      Email *
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all disabled:opacity-50"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <span className="flex items-center gap-2">
                      <MdPhone size={16} />
                      Phone *
                    </span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all disabled:opacity-50"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <span className="flex items-center gap-2">
                      <FiMessageSquare size={16} />
                      Message *
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your enquiry..."
                    required
                    disabled={isLoading}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiMessageSquare size={18} />
                      Send Enquiry
                    </>
                  )}
                </button>

                {/* Footer Note */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  We respect your privacy. Your information is safe with us.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryModal;
