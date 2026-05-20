import React, { useState, useEffect } from "react";
import { MdClose, MdPhone, MdMailOutline } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productImage?: string;
  productUrl?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  productName = "",
  productImage = "",
  productUrl = typeof window !== "undefined" ? window.location.href : "",
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [phoneError, setPhoneError] = useState("");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Phone validation
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        phone: numericValue,
      }));

      // Validate phone number
      if (numericValue.length > 0 && numericValue.length < 10) {
        setPhoneError("Please enter valid number");
      } else {
        setPhoneError("");
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // WhatsApp Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with your WhatsApp number
    const phoneNumber = "9033094705";

    const whatsappMessage = `
      Hello 👋

      I would like to enquire about the following product.

      📦 Product Name: ${productName}
      🔗 Product URL: ${productUrl}

      ━━━━━━━━━━━━━━

      👤 Customer Information

      Name: ${formData.name}
      Phone: ${formData.phone}

      ${formData.email ? `Email: ${formData.email}` : ""}

      ${
        formData.message
          ? `━━━━━━━━━━━━━━

      📝 Message:
      ${formData.message}`
          : ""
      }
      `;
    if (formData.phone.length !== 10) {
      setPhoneError("Please enter valid number");
      return;
    }
    console.log("whatsappMessage", whatsappMessage);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappURL, "_blank");

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    onClose();
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
          <div className="sticky top-0 bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 id="enquiry-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                Send WhatsApp Message
              </h2>

              {productName && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{productName}</p>}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Info */}
              {productImage && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex gap-3">
                  <img src={productImage} alt={productName} className="w-16 h-16 object-cover rounded" loading="lazy" />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{productName}</p>

                    {productUrl && (
                      <a
                        href={productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline break-all"
                      >
                        View Product
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Name */}
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>

              {/* Email */}
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>

              {/* Phone */}
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
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span className="flex items-center gap-2">
                    <FiMessageSquare size={16} />
                    Message
                  </span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your enquiry..."
                  // required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <FiMessageSquare size={18} />
                Send WhatsApp Message
              </button>

              {/* Footer */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Clicking the button will open WhatsApp directly.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryModal;
