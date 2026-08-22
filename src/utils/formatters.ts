/**
 * Format product name for better display
 * - Capitalizes first letter of each word
 * - Handles special cases
 */
export const formatProductName = (name: string | undefined): string => {
  if (!name) return "Unnamed Product";
  
  return name
    .trim()
    .split(/\s+/)
    .map(word => {
      // Capitalize first letter, lowercase rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * Format price to INR currency
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
