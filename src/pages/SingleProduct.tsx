

import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../redux/features/cartSlice";
import { Product } from "../models/Product";
import RatingStar from "../components/RatingStar";
import PriceSection from "../components/PriceSection";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHandHoldingDollar } from "react-icons/fa6";
import ProductList from "../components/ProductList";
import useAuth from "../hooks/useAuth";
import { MdFavoriteBorder } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addWishlistItem } from "../redux/features/WishlistSlice";
import Modal from "react-modal";

export interface CartItem {
  productId: Product;
  quantity: number;
}

const SingleProduct: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { _id } = useParams<{ _id?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [imgs, setImgs] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [Category, setScategory] = useState<string>("");
  const [similar, setSimilar] = useState<Product[]>([]);
  const { requireAuth } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);  // Loading state for the product details
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal

  const userId = useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const Role = useAppSelector((state) => state.authReducer.Role); // Assuming role is stored in Redux

  useEffect(() => {
    if (!_id) {
      toast.error("Invalid product ID!");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);  // Set loading to true before fetching data
      try {
        const res = await fetch(`http://localhost:5000/products/${_id}`);
        const data = await res.json();
        if (!data || !data.product || !data.product._id) {
          toast.error("Product not found!");
          return;
        }

        const { image, category } = data.product;
        const categoryName = typeof category === "object" && category?.name ? category.name : "Unknown";

        const fullImageUrls = Array.isArray(image)
          ? image.map((img) => (img.startsWith("/") ? `http://localhost:5000${img}` : img))
          : image
          ? [image.startsWith("/") ? `http://localhost:5000${image}` : image]
          : [];

        setProduct(data.product);
        setImgs(fullImageUrls);
        setScategory(categoryName);
        setSelectedImg(fullImageUrls.length > 0 ? fullImageUrls[0] : "");
      } catch (error) {
        toast.error("Error fetching product details!");
        console.error(error);
      } finally {
        setLoading(false);  // Set loading to false after fetch completes
      }
    };

    fetchProduct();
  }, [_id]);

  useEffect(() => {
    if (!Category) return;

    fetch(`http://localhost:5000/products/category/${Category}`)
      .then((res) => res.json())
      .then((data) => {
        setSimilar(data.products.filter((p: Product) => p._id !== _id));
      });
  }, [Category, _id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProduct = async () => {
    if (!product || !_id || !token) return;

    // Simple validation: Ensure title and description are not empty
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/products/update/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Product updated!");
      setProduct(data.product);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("❌ Failed to update product.");
      console.error("Error during update product", error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!_id || !token) return;

    setIsDeleteModalOpen(false);  // Close the modal after confirming delete

    try {
      const res = await fetch(`http://localhost:5000/products/delete/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast.success("Product deleted");
      navigate("/");
    } catch (error) {
      console.error("Error delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const addCart = () => {
    requireAuth(() => {
      if (!product) return;

      dispatch(addToCart({
        _id: product._id,
        title: product.title,
        price: product.price,
        rating: product.rating,
        category: product.category,
        productId: product,
        quantity: 1,
      }));
      toast.success("Added to cart!");
    });
  };

  const buyNow = () => {
    requireAuth(async () => {
      if (!product || !_id || !token) return;

      try {
        const res = await fetch("http://localhost:5000/order/direct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            productId: _id,
            stock: 1,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }

        dispatch(addToCart({
          _id: product._id,
          title: product.title,
          price: product.price,
          rating: product.rating,
          category: product.category,
          productId: product,
          quantity: 1,
        }));
        toast.success("Order placed!");
      } catch (error) {
        console.error("Error order product:", error);
        toast.error("Failed to place order");
      }
    });
  };

  const addWishlist = async () => {
    requireAuth(async () => {
      if (!product || !_id) return;

      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication failed! Please log in.");
        return;
      }
      const imageUrl = product.image ? product.image : "";

      const wishlistItem = {
        id: _id,
        productId: _id,
        name: product.title,
        price: product.price,
        image: imageUrl,
      };

      dispatch(addWishlistItem(wishlistItem));
      toast.success("Item added to your wishlist");
    });
  };

  return (
    <div className="container mx-auto pt-8 dark:text-white">
      {loading && <div>Loading...</div>} {/* Loading indicator */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 font-karla">
        <div className="space-y-2">
          {selectedImg && <img src={selectedImg} alt="Product" className="h-80 object-cover" />}
          <div className="flex space-x-1 items-center">
            {imgs.map((img) => (
              <img
                key={img}
                src={img}
                className={`w-12 cursor-pointer hover:border-2 hover:border-black ${img === selectedImg ? "border-2 border-black" : ""}`}
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </div>
        </div>

        <div className="px-2">
          <h2 className="text-2xl">{product?.title}</h2>
          {product?.rating && <RatingStar rating={product.rating} />}
          {product?.discountPercentage && <PriceSection discountPercentage={product.discountPercentage} price={product.price} />}

          {product && (
            <table className="mt-2">
              <tbody>
                {product.brand && <tr><td className="pr-2 font-bold">Brand</td><td>{product.brand}</td></tr>}
                {typeof product.category === "object" && product.category?.name && <tr><td className="pr-2 font-bold">Category</td><td>{product.category.name}</td></tr>}
                {product.description && <tr><td className="pr-2 font-bold">Description</td><td>{product.description}</td></tr>}
              </tbody>
            </table>
          )}

          <div className="flex justify-between mt-4">
            <button className="flex items-center bg-black text-white p-2 rounded w-24" onClick={addCart}>
              <AiOutlineShoppingCart /> Add to Cart
            </button>
            <button className="flex items-center bg-black text-white p-2 rounded w-24" onClick={buyNow}>
              <FaHandHoldingDollar /> Buy Now
            </button>
          </div>

          <div className="flex mt-4 items-center space-x-2">
            <button className="text-xl dark:text-white" onClick={addWishlist}><MdFavoriteBorder /></button>
            <span>Add to Wishlist</span>
          </div>

          {/* Conditionally render buttons based on role */}
          {Role === "admin" && (
            <div className="mt-6 space-x-3">
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit Product</button>
              <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded">Delete Product</button>
            </div>
          )}
        </div>
      </div>

      {similar.length > 0 && <ProductList title="Similar Products" products={similar} />}

      {/* Modal for updating product */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setFormData({});
        }}
        className="bg-white p-6 rounded-md shadow-md max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form className="space-y-3">
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            className="w-full p-2 border"
            placeholder="Title"
          />
          <input
            type="text"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            className="w-full p-2 border"
            placeholder="Description"
          />
          <div className="flex justify-between space-x-2">
            <button type="button" onClick={handleUpdateProduct} className="w-full bg-blue-600 text-white p-2 rounded">Update</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="w-full bg-gray-600 text-white p-2 rounded">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="bg-white p-6 rounded-md shadow-md max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this product?</h2>
        <div className="flex justify-between space-x-2">
          <button onClick={handleDeleteProduct} className="w-full bg-red-600 text-white p-2 rounded">Yes, Delete</button>
          <button onClick={() => setIsDeleteModalOpen(false)} className="w-full bg-gray-600 text-white p-2 rounded">Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default SingleProduct;
