import { FC, useEffect, useState, useMemo } from "react";
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
import { useTranslation } from "react-i18next";

import * as Rating from "react-rating";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
export interface CartItem {
  productId: Product;
  quantity: number;
}
interface ReviewUser {
  userName?: string;
}

interface Review {
  rating: number;
  comment: string;
  user?: ReviewUser;
}

const SingleProduct: FC = () => {
  const { t } = useTranslation();
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const language = localStorage.getItem("language") || "en";
  const userId = useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId");
  const [reviews, setReviews] = useState<Review[]>([
    { rating: 4, comment: "Good product!" },
    { rating: 5, comment: "Excellent!" },
  ]);
  const [newReview, setNewReview] = useState<Review>({ rating: 0, comment: "" });
  const token = localStorage.getItem("accessToken");
  const Role = useAppSelector((state) => state.authReducer.Role);
  useEffect(() => {
    dispatch(fetchWishlistItems());
  }, [dispatch]);

  const fetchProductDetails = async () => {
    if (!_id) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/products/${_id}`);
      const data = await res.json();
      if (!data || !data.product || !data.product._id) {
        toast.error(t("sp.productNotFound"));

        return;
      }

      const { images, category } = data.product;

      const categoryName =
        typeof category === "object" && category?.name
          ? category.name
          : typeof category === "string"
          ? category
          : "Unknown";

      const fullImageUrls = Array.isArray(images)
        ? images.map((img) => (img.startsWith("/") ? `${BASE_URL}${img}` : img))
        : [];

      setProduct(data.product);
      setImgs(fullImageUrls);
      setSelectedImg(fullImageUrls.length > 0 ? fullImageUrls[0] : "");
      setCategory(categoryName);
    } catch (error) {
      toast.error(t("sp.errorFatchingProduct"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!_id) {
      toast.error(t("sp.invalidpId"));

      return;
    }

    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (!formData.title || formData.title.trim() === "") errors.title = t("sp.validation.titleRequired");
    if (formData.price === undefined || formData.price <= 0) errors.price = t("sp.validation.pricePositive");
    if (
      formData.discountPercentage !== undefined &&
      (formData.discountPercentage < 0 || formData.discountPercentage > 100)
    ) {
      errors.discountPercentage = t("sp.validation.discountRange");
    }
    if (formData.stock === undefined || formData.stock < 0) errors.stock = t("sp.validation.stockPositive");
    if (formData.rating !== undefined && (formData.rating < 0 || formData.rating > 5))
      errors.rating = t("sp.validation.ratingRange");
    if (!formData.brand || formData.brand.trim() === "") errors.brand = t("sp.validation.brandRequired");

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
      // if (formData.rating !== undefined) formDataToSend.append("rating", String(formData.rating));
      if (formData.category) {
        const categoryValue = typeof formData.category === "string" ? formData.category : formData.category.name;

        formDataToSend.append("category", categoryValue);
      }
      if (formData.description) formDataToSend.append("description", formData.description);
      if (formData.discountPercentage !== undefined)
        formDataToSend.append("discountPercentage", String(formData.discountPercentage));
      if (formData.stock !== undefined) formDataToSend.append("stock", String(formData.stock));
      if (formData.brand) formDataToSend.append("brand", formData.brand);

      const res = await fetch(`${BASE_URL}/products/update/${_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || t("sp.updateFailed"));
      }

      toast.success(t("sp.updated"));
      setProduct(data.product);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(t("sp.updateFailed", { message: (error as Error).message }));
    }
  };
  const handleDeleteProduct = async () => {
    if (!_id || !token) return;

    setIsDeleteModalOpen(false);

    try {
      const res = await fetch(`${BASE_URL}/products/delete/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await fetch(`${BASE_URL}/cart/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept-Language": language,
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

      await dispatch(removeWishlistItem({ productId: _id }))
        .unwrap()
        .then(() => {
          toast.success("Product removed from wishlist.");
        })
        .catch((error) => {
          toast.error(`Failed to remove product from wishlist: ${error.message}`);
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
        toast.error(t("sp.productNotFound"));
        return;
      }

      const existingProductIndex = cartItems.findIndex((item) => item.productId._id === product._id);

      const existingCartItem = cartItems[existingProductIndex];
      const maxQuantity = product.stock || 10; //
      const newQuantity = existingCartItem ? Math.min(existingCartItem.quantity + 1, maxQuantity) : 1;

      if (existingCartItem && existingCartItem.quantity >= maxQuantity) {
        toast(t("sp.maxQuantityReached"));

        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
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
              images: product.images,
              discountPercentage: product.discountPercentage,
              stock: product.stock,
            })
          );
          toast.success(existingCartItem ? t("sp.quantityIncreased") : t("sp.added"));
        } else {
          throw new Error(data.message || t("sp.addToCartFailed"));
        }
      } catch (error) {
        toast.error(t("sp.addToCartFailed"));
      }
    });
  };
  const handleReplaceImage = async (file: File, index: number) => {
    if (!_id || !token) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${BASE_URL}/products/${_id}/images/${index}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image update failed");

      toast.success("Image replaced successfully!");
      await fetchProductDetails();
    } catch (error) {
      toast.error("Failed to replace image");
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (!_id || !token) return;

    try {
      const res = await fetch(`${BASE_URL}/products/${_id}/images/${index}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("sp.imageDeletationFail"));

      toast.success(t("sp.imageDelete"));
      await fetchProductDetails();
    } catch (error) {
      toast.error(t("sp.imageDeletationFail"));
    }
  };

  const handleAddImages = async (files: File[]) => {
    if (!_id || !token || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(`${BASE_URL}/products/${_id}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("sp.addImagefail"));

      toast.success(t("sp.imagesAdded"));
      await fetchProductDetails();
    } catch (error) {
      toast.error(t("sp.addImagefail"));
    }
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
        image: product.images,
      };

      sessionStorage.setItem("checkoutItem", JSON.stringify(checkoutData));

      navigate("/checkoutDirect");
    });
  };
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

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
    if (!token) return toast.error(t("sp.NOtoken"));
    if (!userId) return toast.error(t("sp.NoUserId"));

    try {
      if (isInWishlist) {
        dispatch(removeWishlistItem({ productId: product._id }));
        toast.success(t("sp.removedWwishlist"));
      } else {
        const response = await fetch(`${BASE_URL}/wishlist/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept-Language": language,
            userId,
          },
          body: JSON.stringify({
            productId: product._id,
            name: product.title,
            price: product.price,
            image: product.images || [],
          }),
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          const errorObj = JSON.parse(errorDetails);

          if (errorObj.message === "Product already in wishlist") {
            toast.error(t("sp.alreadyInWishlist"));
            setIsInWishlist(true);
            return;
          }

          throw new Error(t("sp.failedTOaddinWishlist"));
        }
        toast.success(t("sp.addedToWishlist"));
        setIsInWishlist(true);
        dispatch(fetchWishlistItems());
      }
    } catch (error) {
      toast.error((error as Error).message || t("sp.failTOUpdateWishlist"));
    }
  };
  const fetchReviews = async () => {
    if (!_id) return;
    try {
      const res = await fetch(`${BASE_URL}/reviews/products/${_id}`);
      const data = await res.json();
      if (res.ok) setReviews(data.reviews || []);
    } catch (err) {
      toast.error(t("errorFatchingReview"));
    }
  };

  const handleReviewSubmit = async () => {
    if (newReview.rating < 1 || newReview.rating > 5) {
      alert(t("ratingRange"));
      return;
    }

    if (!token || !userId || !_id) {
      return toast.error(t("loginrequired"));
    }

    try {
      const res = await fetch(`${BASE_URL}/reviews/products/${_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
        body: JSON.stringify({
          userId,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || t("failTOSUbmitRev"));
        return;
      }

      toast.success(t("Reviewsubmitted"));
      setNewReview({ rating: 0, comment: "" });
      await fetchReviews();
    } catch (err) {
      toast.error(t("Errorsubmittingreview"));
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);
  return (
    <div className="container mx-auto pt-8 dark:text-white">
      {loading && <div>{t("loading")}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 font-karla">
        <div className="space-y-4 mt-6">
          {selectedImg && (
            <img
              src={typeof selectedImg === "string" ? selectedImg : URL.createObjectURL(selectedImg)}
              alt={t("selected")}
              className="h-80 w-full object-cover rounded border"
            />
          )}

          <div className="flex flex-wrap gap-4">
            {/* Image Thumbnails visible to all */}
            {product?.images?.map((img, index) => {
              const imgUrl = img.startsWith("/") ? `${BASE_URL}${img}` : img;

              return (
                <div key={index} className="relative w-12 h-12 border rounded overflow-hidden group">
                  <img
                    src={imgUrl}
                    alt={`Image ${index}`}
                    onClick={() => setSelectedImg(imgUrl)}
                    className={`w-full h-full object-cover cursor-pointer transition ${
                      selectedImg === imgUrl ? "ring-2 ring-blue-500" : ""
                    }`}
                  />

                  {/* Show Delete and Replace only to Admin or Product Owner Seller */}
                  {(Role === "admin" || (Role === "seller" && product?.seller === userId)) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(t("confirm_delete_image"))) {
                            handleDeleteImage(index);
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>

                      <button
                        type="button"
                        onClick={() => document.getElementById(`replace-input-${index}`)?.click()}
                        className="absolute bottom-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded"
                      >
                        {t("replace")}
                      </button>

                      <input
                        type="file"
                        id={`replace-input-${index}`}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReplaceImage(file, index);
                        }}
                      />
                    </>
                  )}
                </div>
              );
            })}

            {(Role === "admin" || (Role === "seller" && product?.seller === userId)) && (
              <div
                className={`flex flex-col items-center justify-center w-24 h-24 border border-dashed rounded cursor-pointer hover:bg-gray-100 ${
                  (product?.images?.length ?? 0) >= 5 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if ((product?.images?.length ?? 0) >= 5) {
                    toast.error("You can only add up to 5 images.");
                  }
                }}
              >
                <label
                  htmlFor="add-images"
                  className={`text-center text-sm ${
                    (product?.images?.length ?? 0) >= 5 ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  + Add
                </label>
                <input
                  type="file"
                  id="add-images"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={(product?.images?.length ?? 0) >= 5}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      handleAddImages(Array.from(files));
                    }
                  }}
                />
              </div>
            )}
          </div>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-2">{t("delete_image")}</h2>
                <p className="text-sm text-gray-600 mb-4">{t("delete_image_confirmation")}</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setImageToDelete(null);
                    }}
                    className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={() => {
                      if (imageToDelete !== null) {
                        handleDeleteImage(imageToDelete);
                        setShowDeleteConfirm(false);
                        setImageToDelete(null);
                      }
                    }}
                    className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-2 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
          <h2 className="text-2xl">{product?.title}</h2>
          {product?.rating !== undefined && <RatingStar rating={averageRating} />}
          {product?.price !== undefined && (
            <PriceSection discountPercentage={product.discountPercentage ?? 0} price={product.price} />
          )}

          {product && (
            <table className="mt-2">
              <tbody>
                {product.brand && (
                  <tr>
                    <td className="pr-2 font-bold">{t("brand")}</td>
                    <td>{product.brand}</td>
                  </tr>
                )}
                {typeof product.category === "object" && product.category?.name && (
                  <tr>
                    <td className="pr-2 font-bold">{t("category")}</td>
                    <td>{product.category.name}</td>
                  </tr>
                )}
                {product.description && (
                  <tr>
                    <td className="pr-2 font-bold">{t("description")}</td>
                    <td>{product.description}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {product?.stock === 0 && <p className="text-red-600 mt-4 font-semibold">{t("out_of_stock")}</p>}

          <div className="flex justify-between mt-4">
            <button className="flex items-center bg-black text-white p-2 rounded w-24" onClick={addCart}>
              <AiOutlineShoppingCart /> {t("add_to_cart")}
            </button>
            <button className="flex items-center bg-black text-white p-2 rounded w-24" onClick={buyNow}>
              <FaHandHoldingDollar /> {t("buy_now")}
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
            <span>{isInWishlist ? t("remove_from_wishlist") : t("add_to_wishlist")}</span>
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
                    images: product?.images || [],
                  });
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {t("edit_product")}
              </button>

              <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded">
                {t("delete_product")}
              </button>
            </div>
          )}
        </div>
      </div>
      {similar.length > 0 && <ProductList title={t("similar_products")} products={similar} />}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setFormData({});
        }}
        className="bg-white p-5 rounded-md shadow-md max-w-md h-[80vh] mx-auto mt-20 overflow-hidden"
      >
        <h2 className="text-xl font-bold mb-4">{t("edit_product")}</h2>

        <div className="overflow-y-auto h-[calc(100%-2rem)] pr-2 space-y-3">
          <form className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                {t("titleLabel")}
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
                {t("descriptionLabel")}
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
                {t("priceLabel")}
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
                {t("salePriceLabel")}
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
                {t("discountLabel")}
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
                {t("stockLabel")}
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

            <div className="space-y-1 mb-4">
              <label htmlFor="rating" className="text-sm font-medium text-gray-700">
                Average Rating
              </label>
              <input
                type="number"
                id="rating"
                value={averageRating}
                readOnly
                className="w-full p-2 border bg-gray-100 cursor-not-allowed"
                min={0}
                max={5}
                step={0.1}
              />
            </div>

            {/* Brand Field */}
            <div className="space-y-1">
              <label htmlFor="brand" className="text-sm font-medium text-gray-700">
                {t("brandLabel")}
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

            {/* Buttons */}
            <div className="flex justify-between space-x-2">
              <button type="button" onClick={handleUpdateProduct} className="w-full bg-blue-600 text-white p-2 rounded">
                {t("update")}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-600 text-white p-2 rounded"
              >
                {t("cancel")}
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
        <h2 className="text-xl font-bold mb-4">{t("confirm_delete_product")}</h2>
        <div className="flex justify-between space-x-2">
          <button onClick={handleDeleteProduct} className="w-full bg-red-600 text-white p-2 rounded">
            {t("yes_delete")}
          </button>
          <button onClick={() => setIsDeleteModalOpen(false)} className="w-full bg-gray-600 text-white p-2 rounded">
            {t("cancel")}
          </button>
        </div>
      </Modal>
      <div className="border p-6 rounded shadow bg-white h-fit">
        <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-600">No reviews yet.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {reviews.map((review: Review, index: number) => (
              <li key={index} className="border p-2 rounded">
                <div className="flex items-center">
                  <RatingStar rating={review.rating} />
                  <span className="ml-2 font-medium">{review.user?.userName}</span>
                </div>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Add Review Form */}

        <div className="mt-4">
          <h4 className="font-semibold">Add Your Review</h4>
          <div className="flex items-center space-x-2">
            <label className="mr-2">{t("Rating")}:</label>
            <Rating.default
              fractions={10}
              initialRating={newReview.rating}
              onChange={(value: number) => setNewReview({ ...newReview, rating: value })}
              emptySymbol={<FaRegStar size={30} className="text-gray-400" />}
              fullSymbol={<FaStar size={30} className="text-yellow-400" />}
              placeholderSymbol={<FaStarHalfAlt size={30} className="text-yellow-300" />}
            />
          </div>

          <textarea
            rows={3}
            className="w-full border p-2 mt-2"
            placeholder={t("Writeyourcomment")}
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />
          <button onClick={handleReviewSubmit} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded w-full">
            {t("SubmitReview")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
