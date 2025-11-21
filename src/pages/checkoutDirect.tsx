
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { toast } from "react-toastify";
// import BASE_URL from "../config/apiconfig";
// import { useTranslation } from "react-i18next";

// interface Product {
//   productId: string;
//   title: string;
//   image: string[];
//   price: number;
//   salePrice?: number;
//   stock?: number;
// }

// const CheckoutDirectPage = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [customization, setCustomization] = useState("");
//   const [customImage, setCustomImage] = useState<File | null>(null);

//   const userId = localStorage.getItem("userId");
//   const token = localStorage.getItem("accessToken");
//   const language = localStorage.getItem("language") || "en";

//   useEffect(() => {
//     const storedItem = sessionStorage.getItem("checkoutItem");
//     if (!storedItem) {
//       toast.error(t("noProductSelected") || "No product selected for direct checkout.");
//       navigate("/", { replace: true });
//       return;
//     }

//     try {
//       const parsed: Product = JSON.parse(storedItem);
//       if (parsed && parsed.image && !Array.isArray(parsed.image)) {
//         parsed.image = [parsed.image];
//       }
//       setProduct(parsed);
//     } catch {
//       toast.error(t("invalidProductData") || "Invalid product data.");
//       navigate("/", { replace: true });
//     }
//   }, [navigate, t]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setCustomImage(e.target.files[0]);
//     }
//   };

//   const handleDirectOrder = async () => {
//     if (!product || !userId || !token) return;
//     if (product.stock !== undefined && product.stock < 1) {
//       toast.error(`${product.title} ${t("outOfStock") || "is out of stock"}`);
//       return;
//     }

//     setLoading(true);
//     try {
//       // ⭐ 1) Generate the order URL from the frontend
//       const orderUrl = `${window.location.origin}/orders`;

//       const formData = new FormData();
//       formData.append("userId", userId);
//       formData.append("productId", product.productId);
//       formData.append("quantity", "1");
//       formData.append("customization", customization || "");

//       // ⭐ 2) Send order URL with the form data (backend will put it in email)
//       formData.append("orderUrl", orderUrl);

//       if (customImage) formData.append("customImage", customImage);

//       await axiosInstance.post(`${BASE_URL}/order/direct`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Accept-Language": language,
//         },
//       });

//       toast.success(t("orderSuccess") || "Order placed successfully!");
//       sessionStorage.removeItem("checkoutItem");
//       navigate("/orders", { replace: true });
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || t("orderFailed") || "Order failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackClick = () => {
//     if (product) navigate(`/products/${product.productId}`);
//   };

//   if (!product) return null;
//   const price = product.salePrice ?? product.price;

//   return (
//     <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-8">
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={handleBackClick}
//           className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition"
//         >
//           {t("backToProduct") || "Back to product"}
//         </button>
//       </div>

//       <h2 className="text-2xl font-bold mb-6 text-center">{t("Confirm Your Order") || "Confirm Your Order"}</h2>

//       <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
//         <img
//           src={product.image?.[0]?.startsWith("http") ? product.image[0] : `${BASE_URL}${product.image?.[0]}`}
//           alt={product.title}
//           className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-md"
//         />
//         <div className="flex-1 w-full">
//           <h3 className="text-lg sm:text-xl font-semibold">{product.title}</h3>
//           <p className="text-gray-600 mt-1">
//             {t("price") || "Price"}: ₹{price}
//           </p>
//           <p className="text-gray-700">{t("quantity") || "Quantity"}: 1</p>
//           <p className="text-gray-800 font-bold mt-2">
//             {t("total") || "Total"}: ₹{price}
//           </p>
//         </div>
//       </div>

//       {/* Customization */}
//       <div className="mt-6">
//         <label className="block mb-2 font-medium">{t("customizationDescription") || "Customization Description"}</label>
//         <textarea
//           value={customization}
//           onChange={(e) => setCustomization(e.target.value)}
//           placeholder={t("enterCustomizationDetails") || "Enter your customization details"}
//           className="w-full border rounded-md p-2"
//           rows={4}
//         />
//       </div>

//       {/* Upload Image */}
//       <div className="mt-4">
//         <label className="block mb-2 font-medium">{t("uploadPhoto") || "Upload Photo"}</label>
//         <input type="file" accept="image/*" onChange={handleFileChange} />
//       </div>

//       <div className="mt-8 flex justify-center sm:justify-end">
//         <button
//           onClick={handleDirectOrder}
//           disabled={loading}
//           className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition w-full sm:w-auto"
//         >
//           {loading ? t("placingOrder") || "Placing Order..." : t("placeOrder") || "Place Order"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CheckoutDirectPage;

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

interface Product {
  productId: string;
  title: string;
  image: string[];
  price: number;
  salePrice?: number;
  stock?: number;
}

export default function CheckoutDirectPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [customization, setCustomization] = useState("");
  const [customImage, setCustomImage] = useState<File | null>(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const language = localStorage.getItem("language") || "en";

  useEffect(() => {
    const storedItem = sessionStorage.getItem("checkoutItem");
    if (!storedItem) {
      toast.error(t("noProductSelected") || "No product selected for direct checkout.");
      navigate("/", { replace: true });
      return;
    }

    try {
      const parsed: Product = JSON.parse(storedItem);
      if (parsed && parsed.image && !Array.isArray(parsed.image)) parsed.image = [parsed.image];
      setProduct(parsed);
    } catch {
      toast.error(t("invalidProductData") || "Invalid product data.");
      navigate("/", { replace: true });
    }
  }, [navigate, t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCustomImage(e.target.files[0]);
  };

  const handleDirectOrder = async () => {
    if (!product || !userId || !token) return;
    if (product.stock !== undefined && product.stock < 1) {
      toast.error(`${product.title} ${t("outOfStock") || "is out of stock"}`);
      return;
    }

    setLoading(true);
    try {
      const orderUrl = `${window.location.origin}/orders`;
      const formData = new FormData();

      formData.append("userId", userId);
      formData.append("productId", product.productId);
      formData.append("quantity", "1");
      formData.append("customization", customization || "");
      formData.append("orderUrl", orderUrl);

      if (customImage) formData.append("customImage", customImage);

      await axiosInstance.post(`${BASE_URL}/order/direct`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      });

      toast.success(t("Order placed successfully!") || "Order placed successfully!");
      sessionStorage.removeItem("checkoutItem");
      navigate("/orders", { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("orderFailed") || "Order failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (product) navigate(`/products/${product.productId}`);
  };

  if (!product) return null;
  const price = product.salePrice ?? product.price;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="mb-5 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 text-sm font-medium transition flex items-center gap-2"
        >
          ← {t("backToProduct") || "Back to product"}
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-tight">
          {t("Confirm Your Order") || "Confirm Your Order"}
        </h2>

        {/* Product Card */}
        <div className="bg-white rounded-2xl border shadow-md p-6 flex gap-6">
          <img
            src={product.image?.[0]?.startsWith("http") ? product.image[0] : `${BASE_URL}${product.image?.[0]}`}
            alt={product.title}
            className="w-32 h-32 object-cover rounded-xl shadow-sm border"
          />

          <div className="flex flex-col justify-between w-full">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{product.title}</h3>
              <p className="text-gray-600 mt-2 text-lg">
                {t("price") || "Price"}: <span className="font-semibold">₹{price}</span>
              </p>
              <p className="text-gray-700 text-lg">{t("quantity") || "Quantity"}: 1</p>
            </div>

            <p className="text-gray-900 font-extrabold text-2xl mt-4">
              {t("total") || "Total"}: ₹{price}
            </p>
          </div>
        </div>

        {/* Customization */}
        <div className="mt-8">
          <label className="block mb-2 text-lg font-medium text-gray-700">
            {t("customizationDescription") || "Customization Description"}
          </label>
          <textarea
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            placeholder={t("Enter Customization Details") || "Enter your customization details"}
            rows={4}
            className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        {/* Upload Image */}
        <div className="mt-6">
          <label className="block mb-2 text-lg font-medium text-gray-700">{t("Upload Photo") || "Upload Photo"}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-xl shadow-sm cursor-pointer focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleDirectOrder}
            disabled={loading}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-semibold shadow-lg transition active:scale-95"
          >
            {loading ? t("placingOrder") || "Placing Order..." : t("placeOrder") || "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
