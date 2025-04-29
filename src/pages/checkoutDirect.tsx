import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BASE_URL from '../config/apiconfig';

interface Product {
  productId: string;
  title: string;
  image: string;
  price: number;
  salePrice: number;
  stock?: number;
}

const CheckoutDirectPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const storedItem = sessionStorage.getItem("checkoutItem");
    if (!storedItem) {
      toast.error("No product selected for direct checkout.");
      navigate('/');
      return;
    }

    const parsed = JSON.parse(storedItem);
    setProduct(parsed);
  }, [navigate]);

  const handleDirectOrder = async () => {
    if (!product || !userId || !token) return;

    // Optional: Skip if stock info exists and is zero
    if (product.stock !== undefined && product.stock < 1) {
      toast.error(`${product.title} is out of stock`);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/order/direct`,
        {
          userId,
          productId: product.productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully!");
      sessionStorage.removeItem("checkoutItem");
      setTimeout(() => navigate('/orders', { replace: true }), 300);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Order failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const price = product.salePrice ?? product.price;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Confirm Your Order</h2>

      <div className="bg-white rounded-xl shadow-md p-4 flex gap-4 items-center">
        <img
          src={`${BASE_URL}${product.image}`}
          alt={product.title}
          className="w-24 h-24 object-cover rounded"
        />
        <div>
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p className="text-gray-600">Price: ₹{price}</p>
          <p className="text-gray-700 font-medium">Quantity: 1</p>
          <p className="text-gray-800 font-bold mt-2">Total: ₹{price}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleDirectOrder}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutDirectPage;
