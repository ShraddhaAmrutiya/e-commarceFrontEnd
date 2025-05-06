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
  useEffect(() => {
    dispatch(fetchWishlistItems());
  }, [dispatch]);
  useEffect(() => {
    if (!_id) {
      toast.error("Invalid product ID!");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/products/${_id}`);
        const data = await res.json();
        if (!data || !data.product || !data.product._id) {
          toast.error("Product not found!");
          return;
        }

        const { image, category } = data.product;

        const categoryName =
          typeof category === "object" && category?.name
            ? category.name
            : typeof category === "string"
            ? category
            : "Unknown";

        const fullImageUrls = Array.isArray(image)
          ? image.map((img) => (img.startsWith("/") ? `${BASE_URL}${img}` : img))
          : image
          ? [image.startsWith("/") ? `${BASE_URL}${image}` : image]
          : [];

        setProduct(data.product);
        setImgs(fullImageUrls);
        setSelectedImg(fullImageUrls.length > 0 ? fullImageUrls[0] : "");
        setCategory(categoryName); // ✅ Add this
      } catch (error) {
        toast.error("Error fetching product details!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [_id]);

  useEffect(() => {
    if (!Category) return;

    fetch(`${BASE_URL}/products/category/${Category}`)
      .then((res) => res.json())
      .then((data) => {
        setSimilar(data.products.filter((p: Product) => p._id !== _id));
      });
  }, [Category, _id]);

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

      // 👇 Safely append image
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

  // const handleDeleteProduct = async () => {
  //   if (!_id || !token) return;

  //   setIsDeleteModalOpen(false);

  //   try {
  //     const res = await fetch(`${BASE_URL}/products/delete/${_id}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || "Delete failed");

  //     const userId = localStorage.getItem("userId");
  //     if (userId) {
  //       const response = await fetch(`${BASE_URL}/cart/${userId}`, {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ productId: _id }),
  //       });

  //       await response.json();
  //       if (response.ok) {
  //         toast.success("Product deleted and removed from cart.");
  //       } else {
  //         toast.error("Failed to remove product from cart.");
  //       }
  //     }

  //     await dispatch(removeWishlistItem({ productId: _id }))
  //       .unwrap()
  //       .then(() => {
  //         toast.success("Product removed from wishlist.");
  //       })
  //       .catch((error) => {
  //         console.error(`Failed to remove product from wishlist: ${error.message}`);
  //       });

  //     toast.success("Product deleted successfully.");
  //     navigate("/");
  //   } catch (error) {
  //     // console.error("Error deleting product:", error);
  //     toast.error("Failed to delete product.");
  //   }
  // };
  const handleDeleteProduct = async () => {
    if (!_id || !token) return;
  
    setIsDeleteModalOpen(false);
  
    try {
      // 1. Delete the product
      const res = await fetch(`${BASE_URL}/products/delete/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
  
      // 2. Optional: Remove from admin's cart (or skip this if backend handles globally)
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await fetch(`${BASE_URL}/cart/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: _id }),
        });
  
        await response.json();
        if (response.ok) {
          toast.success("Product removed from your cart.");
        } else {
          toast.error("Failed to remove product from your cart.");
        }
      }
  
      // 3. Remove from wishlist in Redux (assumes local session)
      await dispatch(removeWishlistItem({ productId: _id }))
        .unwrap()
        .then(() => {
          toast.success("Product removed from wishlist.");
        })
        .catch((error) => {
          console.error(`Failed to remove product from wishlist: ${error.message}`);
        });
  
      toast.success("Product deleted successfully.");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };
  
  const cartItems = useSelector((state: RootState) => state.cartReducer.cartItems);

  const addCart = async () => {
    requireAuth(async () => {
      if (!product || !product._id) {
        toast.error("Product not found!");
        return;
      }

      const existingProductIndex = cartItems.findIndex((item) => item.productId._id === product._id);

      const existingCartItem = cartItems[existingProductIndex];
      const maxQuantity = product.stock || 10; // fallback default max quantity
      const newQuantity = existingCartItem ? Math.min(existingCartItem.quantity + 1, maxQuantity) : 1;

      if (existingCartItem && existingCartItem.quantity >= maxQuantity) {
        toast("You've reached the maximum quantity for this product.");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            productId: product._id,
            quantity: newQuantity,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch(
            addToCart({
              _id: existingCartItem?._id || "unique-cart-id",
              title: product.title,
              price: product.price,
              rating: product.rating,
              category: product.category,
              productId: product,
              quantity: newQuantity,
              image: product.image,
              discountPercentage: product.discountPercentage,
            })
          );

          toast.success(existingCartItem ? "Quantity increased!" : "Added to cart!");
        } else {
          throw new Error(data.message || "Failed to add to cart.");
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        toast.error("Failed to add product to cart!");
      }
    });
  };

  const buyNow = () => {
    requireAuth(() => {
      if (!product || !_id) return;

      const checkoutData = {
        productId: _id,
        quantity: 1,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        rating: product.rating,
        category: product.category,
        image: product.image,
      };

      sessionStorage.setItem("checkoutItem", JSON.stringify(checkoutData));

      navigate("/checkoutDirect");
    });
  };

  const wishlistItems = useAppSelector((state) => state.wishlistReducer.wishlistItems);

  useEffect(() => {
    if (product) {
      const isProductInWishlist = wishlistItems.some((wishlistItem) =>
        wishlistItem.products.some((item) => item.productId && item.productId._id === product._id)
      );
      setIsInWishlist(isProductInWishlist);
    }
  }, [wishlistItems, product]);

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (!token) return toast.error("Authentication failed! Please log in.");
    if (!userId) return toast.error("User ID missing");

    try {
      if (isInWishlist) {
        dispatch(removeWishlistItem({ productId: product._id }));
        toast.success("Item removed from wishlist");
      } else {
        const response = await fetch(`${BASE_URL}/wishlist/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            userId,
          },
          body: JSON.stringify({
            productId: product._id,
            name: product.title,
            price: product.price,
            image: product.image || "",
          }),
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          const errorObj = JSON.parse(errorDetails);

          if (errorObj.message === "Product already in wishlist") {
            toast.error("This product is already in your wishlist");
            setIsInWishlist(true);
            return;
          }

          throw new Error(`Failed to add item to wishlist: ${errorDetails}`);
        }

        toast.success("Item added to wishlist");
        setIsInWishlist(true);
        dispatch(fetchWishlistItems());
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error((error as Error).message || "Failed to update wishlist");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto pt-8 dark:text-white">
      {loading && <div>Loading...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 font-karla">
        <div className="space-y-2">
          {selectedImg && (
            <img
              src={typeof selectedImg === "string" ? selectedImg : URL.createObjectURL(selectedImg)}
              alt="Product"
              className="h-80 object-cover"
            />
          )}
        </div>

        <div className="px-2 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
          <h2 className="text-2xl">{product?.title}</h2>
          {product?.rating && <RatingStar rating={product.rating} />}
          {product?.price !== undefined && (
            <PriceSection discountPercentage={product.discountPercentage ?? 0} price={product.price} />
          )}

          {product && (
            <table className="mt-2">
              <tbody>
                {product.brand && (
                  <tr>
                    <td className="pr-2 font-bold">Brand</td>
                    <td>{product.brand}</td>
                  </tr>
                )}
                {typeof product.category === "object" && product.category?.name && (
                  <tr>
                    <td className="pr-2 font-bold">Category</td>
                    <td>{product.category.name}</td>
                  </tr>
                )}
                {product.description && (
                  <tr>
                    <td className="pr-2 font-bold">Description</td>
                    <td>{product.description}</td>
                  </tr>
                )}
              </tbody>
              {product && product.stock === 0 && (
                <p className="text-red-600 mt-4 font-semibold">This product is out of stock.</p>
              )}
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
            <button
              className="flex items-center text-2xl ml-4"
              onClick={handleWishlistToggle}
              style={{ color: isInWishlist ? "red" : "black" }}
            >
              {isInWishlist ? <MdFavorite /> : <MdFavoriteBorder />}
            </button>
            <span>{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
          </div>

          {(Role === "admin" || (Role === "seller" && product?.seller === userId)) && (
            <div className="mt-6 space-x-3">
              <button
                onClick={() => {
                  setFormData({
                    title: product?.title || "",
                    description: product?.description || "",
                    price: product?.price,
                    salePrice: product?.salePrice,
                    discountPercentage: product?.discountPercentage,
                    stock: product?.stock,
                    brand: product?.brand,
                    rating: product?.rating,
                    category: typeof product?.category === "object" ? product.category.name : product?.category,
                    image: product?.image || "",
                  });
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit Product
              </button>

              <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded">
                Delete Product
              </button>
            </div>
          )}
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
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="bg-white p-6 rounded-md shadow-md max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this product?</h2>
        <div className="flex justify-between space-x-2">
          <button onClick={handleDeleteProduct} className="w-full bg-red-600 text-white p-2 rounded">
            Yes, Delete
          </button>
          <button onClick={() => setIsDeleteModalOpen(false)} className="w-full bg-gray-600 text-white p-2 rounded">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SingleProduct;
