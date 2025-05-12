import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchWishlistItems, removeWishlistItem } from "../redux/features/WishlistSlice";
import { RootState } from "../redux/store";
import Modal from "react-modal";
import BASE_URL from "../config/apiconfig";

export interface CartItem {
  productId: Product;
  quantity: number;
}

const SingleProduct: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { _id } = useParams<{ _id?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [, setImgs] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<File | string | null>(null);
  const [Category, setCategory] = useState<string>("");
  const [similar, setSimilar] = useState<Product[]>([]);
  const { requireAuth } = useAuth();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const userId = useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId");

  const token = localStorage.getItem("accessToken");
  const Role = useAppSelector((state) => state.authReducer.Role);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "discountPercentage") {
      const discount = parseFloat(value);
      const price = parseFloat(formData.price?.toString() || "0");

      if (!isNaN(discount) && !isNaN(price)) {
        const salePrice = price - (price * discount) / 100;

        setFormData((prev) => ({
          ...prev,
          discountPercentage: discount,
          salePrice: parseFloat(salePrice.toFixed(2)),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          discountPercentage: discount,
        }));
      }
    } else if (name === "price") {
      const price = parseFloat(value);
      const discount = parseFloat(formData.discountPercentage?.toString() || "0");

      if (!isNaN(price) && !isNaN(discount)) {
        const salePrice = price - (price * discount) / 100;

        setFormData((prev) => ({
          ...prev,
          price,
          salePrice: parseFloat(salePrice.toFixed(2)),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          price,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.title || formData.title.trim() === "") errors.title = "Title is required.";
    if (formData.price === undefined || formData.price <= 0) errors.price = "Price must be greater than 0.";
    if (
      formData.discountPercentage !== undefined &&
      (formData.discountPercentage < 0 || formData.discountPercentage > 100)
    )
      if (
        formData.discountPercentage !== undefined &&
        (formData.discountPercentage < 0 || formData.discountPercentage > 100)
      )
        errors.discountPercentage = "Discount must be between 0 and 100.";
    if (formData.stock === undefined || formData.stock < 0) errors.stock = "Stock must be a positive number.";
    if (formData.rating !== undefined && (formData.rating < 0 || formData.rating > 5))
      errors.rating = "Rating must be between 0 and 5.";
    if (!formData.brand || formData.brand.trim() === "") errors.brand = "Brand is required.";

    return errors;
  };
  const handleUpdateProduct = async () => {
    if (!product || !_id || !token) return;

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const formDataToSend = new FormData();

      if (formData.title) formDataToSend.append("title", formData.title);
      if (formData.price !== undefined) formDataToSend.append("price", String(formData.price));
      if (formData.rating !== undefined) formDataToSend.append("rating", String(formData.rating));
      if (formData.category) {
        const categoryValue = typeof formData.category === "string" ? formData.category : formData.category.name;

        formDataToSend.append("category", categoryValue);
      }
      if (formData.description) formDataToSend.append("description", formData.description);
      if (formData.discountPercentage !== undefined)
        formDataToSend.append("discountPercentage", String(formData.discountPercentage));
      if (formData.stock !== undefined) formDataToSend.append("stock", String(formData.stock));
      if (formData.brand) formDataToSend.append("brand", formData.brand);

      if (selectedImg instanceof File) {
        formDataToSend.append("image", selectedImg);
      }

      const res = await fetch(`${BASE_URL}/products/update/${_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      toast.success("Product updated!");
      setProduct(data.product);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error during update product:", error);
      toast.error(`Failed to update product: ${(error as Error).message}`);
    }
  };

  return (
    <div className="container mx-auto pt-8 dark:text-white">
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 font-karla">
        <div className="space-y-4">
          {selectedImg && (
            <img
              src={typeof selectedImg === "string" ? selectedImg : URL.createObjectURL(selectedImg)}
              alt="Selected Product"
              className="h-80 w-full object-cover rounded border"
            />
          )}

          <div className="flex space-x-2 overflow-x-auto">
            {product?.images?.map((img, index) => {
              const imgUrl = img.startsWith("/") ? `${BASE_URL}${img}` : img;
              return (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setSelectedImg(imgUrl)}
                  className={`w-20 h-20 object-cover cursor-pointer border ${
                    selectedImg === imgUrl ? "border-blue-500" : "border-gray-300"
                  }`}
                />
              );
            })}
          </div>
        </div>

     
      
      {similar.length > 0 && <ProductList title="Similar Products" products={similar} />}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setFormData({});
        }}
        className="bg-white p-5 rounded-md shadow-md max-w-md h-[80vh] mx-auto mt-20 overflow-hidden"
      >
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        <div className="overflow-y-auto h-[calc(100%-2rem)] pr-2 space-y-3">
          <form className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="w-full p-2 border"
                placeholder="Title"
              />
              {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
            </div>

            {/* Description Field */}
            <div className="space-y-1">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                name="description"
                id="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full p-2 border"
                placeholder="Description"
              />
              {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
            </div>

            {/* Price Field */}
            <div className="space-y-1">
              <label htmlFor="price" className="text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                className="w-full p-2 border"
                placeholder="Price"
              />
              {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
            </div>

            {/* Sale Price Field */}
            <div className="space-y-1">
              <label htmlFor="salePrice" className="text-sm font-medium text-gray-700">
                Sale Price (sale price is disabled , it update on the basis of discount %)
              </label>
              <input
                type="number"
                name="salePrice"
                id="salePrice"
                value={formData.salePrice !== undefined && formData.salePrice !== null ? formData.salePrice : ""}
                className="w-full p-2 border"
                placeholder="Sale Price"
                disabled // This disables the field
              />
            </div>

            {/* Discount Percentage Field */}
            <div className="space-y-1">
              <label htmlFor="discountPercentage" className="text-sm font-medium text-gray-700">
                Discount %
              </label>
              <input
                type="number"
                name="discountPercentage"
                id="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                className="w-full p-2 border"
                placeholder="Discount %"
                min="0"
                max="100"
              />
              {formErrors.discountPercentage && <p className="text-red-500 text-sm">{formErrors.discountPercentage}</p>}
            </div>

            {/* Stock Quantity Field */}
            <div className="space-y-1">
              <label htmlFor="stock" className="text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                value={formData.stock || ""}
                onChange={handleInputChange}
                className="w-full p-2 border"
                placeholder="Stock Quantity"
              />
              {formErrors.stock && <p className="text-red-500 text-sm">{formErrors.stock}</p>}
            </div>

            {/* Rating Field */}
            <div className="space-y-1">
              <label htmlFor="rating" className="text-sm font-medium text-gray-700">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                id="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || ""}
                onChange={handleInputChange}
                className="w-full p-2 border"
                placeholder="Rating (0 to 5)"
              />
              {formErrors.rating && <p className="text-red-500 text-sm">{formErrors.rating}</p>}
            </div>

            {/* Brand Field */}
            <div className="space-y-1">
              <label htmlFor="brand" className="text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                id="brand"
                value={formData.brand || ""}
                onChange={handleInputChange}
                className="w-full p-2 border"
                placeholder="Brand"
              />
              {formErrors.brand && <p className="text-red-500 text-sm">{formErrors.brand}</p>}
            </div>

            {/* Image Upload Field */}
            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedImg(e.target.files[0]);
                  }
                }}
              />
              {formErrors.image && <p className="text-red-500 text-sm">{formErrors.image}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-between space-x-2">
              <button type="button" onClick={handleUpdateProduct} className="w-full bg-blue-600 text-white p-2 rounded">
                Update
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-600 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal for delete confirmation */}
    
    </div>
  );
};

export default SingleProduct;
