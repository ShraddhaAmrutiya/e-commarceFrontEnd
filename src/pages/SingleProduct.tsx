import { FC, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../models/Product";
import toast from "react-hot-toast";
import ProductList from "../components/ProductList";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchWishlistItems, removeWishlistItem } from "../redux/features/WishlistSlice";
import Modal from "react-modal";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";
import { formatProductName } from "../utils/formatters";
import EnquiryModal from "../components/EnquiryModal";

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
  const [, setImgs] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<File | string | null>(null);
  const [Category, setCategory] = useState<string>("");
  const [similar, setSimilar] = useState<Product[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const language = localStorage.getItem("language") || "en";
  const userId = useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const token = localStorage.getItem("accessToken");
  const Role = useAppSelector((state) => state.authReducer.Role);
  useEffect(() => {
    dispatch(fetchWishlistItems());

    // Scroll to top every time product id changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, _id]);
  useEffect(() => {
    if (!_id) return;

    fetchProductDetails();
    fetchReviews();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [_id]);

  const fetchProductDetails = async () => {
    if (!_id) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/products/${_id}`);
      const data = await res.json();
      if (!data || !data.product || !data.product._id) {
        toast.error(t("productNotFound"));

        return;
      }

      const { images, category } = data.product;

      const categoryName =
        typeof category === "object" && category?.name ? category.name : typeof category === "string" ? category : "";

      const fullImageUrls = Array.isArray(images)
        ? images.map((img) => (img.startsWith("/") ? `${BASE_URL}${img}` : img))
        : [];

      setProduct(data.product);
      setImgs(fullImageUrls);
      setSelectedImg(fullImageUrls.length > 0 ? fullImageUrls[0] : "");
      setCategory(categoryName);
    } catch (error) {
      toast.error(t("errorFatchingProduct"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Category) return;

    fetch(`${BASE_URL}/products/category/${Category}`)
      .then((res) => res.json())
      .then((data) => {
        const cleaned = data.products
          .filter((p: Product) => p._id !== _id)
          .map((p: Product) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { category, ...rest } = p; //
            return rest;
          });

        setSimilar(cleaned);
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

    if (!formData.title || formData.title.trim() === "") errors.title = t("validation.titleRequired");
    if (formData.price === undefined || formData.price <= 0) errors.price = t("validation.pricePositive");
    if (
      formData.discountPercentage !== undefined &&
      (formData.discountPercentage < 0 || formData.discountPercentage > 100)
    ) {
      errors.discountPercentage = t("validation.discountRange");
    }
    if (formData.stock === undefined || formData.stock < 0) errors.stock = t("validation.stockPositive");
    if (formData.rating !== undefined && (formData.rating < 0 || formData.rating > 5))
      errors.rating = t("validation.ratingRange");
    if (!formData.brand || formData.brand.trim() === "") errors.brand = t("validation.brandRequired");

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
        throw new Error(data.message || t("updateFailed"));
      }

      toast.success(t("updated"));
      setProduct(data.product);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(t("updateFailed", { message: (error as Error).message }));
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
      if (!res.ok) throw new Error(data.message || t("validation.Deletefailed"));

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
          toast.success(t("validation.itemRemovedFromCart"));
        } else {
          toast.error(t("failedRemoveItem"));
        }
      }

      await dispatch(removeWishlistItem({ productId: _id }))
        .unwrap()
        .then(() => {
          toast.success(t("validation.removedWwishlist"));
        })
        .catch((error) => {
          toast.error(t("validation.failedRemoveItemWishlist", ` ${error.message}`));
        });

      toast.success(t("validation.productDelete"));
      navigate("/");
    } catch (error) {
      toast.error(t("validation.failedProductDelete"));
    }
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
      if (!res.ok) throw new Error(data.message || t("imageUpdateFail"));

      toast.success(t("imageReplaced"));
      await fetchProductDetails();
    } catch (error) {
      toast.error(t("imgReplaceFailed"));
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
      if (!res.ok) throw new Error(data.message || t("imageDeletationFail"));

      toast.success(t("imageDelete"));
      await fetchProductDetails();
    } catch (error) {
      toast.error(t("imageDeletationFail"));
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
      if (!res.ok) throw new Error(data.message || t("addImagefail"));

      toast.success(t("imagesAdded"));
      await fetchProductDetails();
    } catch (error) {
      toast.error(t("addImagefail"));
    }
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 overflow-hidden dark:text-white"
    >
      {loading && <div>{t("loading")}</div>}

      {/* MAIN PRODUCT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* LEFT SIDE - IMAGE SECTION */}
        <div className="space-y-5">
          {selectedImg && (
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700">
              <img
                src={typeof selectedImg === "string" ? selectedImg : URL.createObjectURL(selectedImg)}
                alt={t("selected")}
                className="w-full h-[350px] sm:h-[450px] object-cover cursor-zoom-in hover:scale-[1.02] transition duration-300"
                onClick={() => setIsZoomOpen(true)}
              />
            </div>
          )}

          {/* THUMBNAILS */}
          <div className="flex flex-wrap gap-4">
            {product?.images?.map((img, index) => {
              const imgUrl = img.startsWith("/") ? `${BASE_URL}${img}` : img;

              return (
                <div
                  key={index}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                    selectedImg === imgUrl
                      ? "border-orange-500 scale-105"
                      : "border-gray-200 dark:border-slate-700 hover:border-orange-400"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Product ${index}`}
                    onClick={() => setSelectedImg(imgUrl)}
                    className="w-full h-full object-cover"
                  />

                  {/* ADMIN ACTIONS */}
                  {(Role === "admin" || (Role === "seller" && product?.seller === userId)) && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(t("confirm_delete_image"))) {
                            handleDeleteImage(index);
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        ✕
                      </button>

                      <button
                        type="button"
                        onClick={() => document.getElementById(`replace-input-${index}`)?.click()}
                        className="absolute bottom-1 left-1 bg-yellow-500 text-white text-[10px] px-1 py-[2px] rounded"
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

            {/* ADD IMAGE */}
            {(Role === "admin" || (Role === "seller" && product?.seller === userId)) && (
              <div
                className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  (product?.images?.length ?? 0) >= 5
                    ? "opacity-50 cursor-not-allowed border-gray-300"
                    : "cursor-pointer border-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800"
                }`}
                onClick={() => {
                  if ((product?.images?.length ?? 0) >= 5) {
                    toast.error("You can only add up to 5 images.");
                  }
                }}
              >
                <label htmlFor="add-images" className="cursor-pointer text-sm font-medium text-orange-600">
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

          {/* DELETE CONFIRM */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-2">{t("delete_image")}</h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">{t("delete_image_confirmation")}</p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setImageToDelete(null);
                    }}
                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-700 rounded-lg"
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
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - PRODUCT DETAILS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">{formatProductName(product?.title)}</h1>

          {/* PRODUCT INFO */}
          {product && (
            <div className="space-y-5">
              {product.brand && (
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-slate-700 pb-3">
                  <span className="font-semibold text-gray-500 dark:text-gray-300">{t("brand")}</span>

                  <span className="font-medium text-right">{product.brand}</span>
                </div>
              )}

              {typeof product.category === "object" && product.category?.name && (
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-slate-700 pb-3">
                  <span className="font-semibold text-gray-500 dark:text-gray-300">{t("category")}</span>

                  <span className="font-medium text-right">{product.category.name}</span>
                </div>
              )}

              {product.description && (
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-slate-700 pb-3">
                  <span className="font-semibold text-gray-500 dark:text-gray-300">{t("size of artical")}</span>

                  <span className="font-medium text-right">{product.description}</span>
                </div>
              )}

              {/* STOCK */}
              {product?.stock === 0 && (
                <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl font-semibold">{t("out_of_stock")}</div>
              )}
            </div>
          )}

          {/* ENQUIRY BUTTON */}
          <div className="mt-8">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Get Enquiry
            </button>
          </div>

          {/* ADMIN BUTTONS */}
          {(Role === "admin" || (Role === "seller" && product?.seller === userId)) && (
            <div className="flex flex-wrap gap-4 mt-8">
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
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                {t("edit_product")}
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
              >
                {t("delete_product")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      <div className="mt-16">
        {similar.length > 0 && <ProductList title={t("similar_products")} products={similar} />}
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setFormData({});
        }}
        className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-md max-w-md h-[80vh] mx-auto mt-20 overflow-hidden"
      >
        <h2 className="text-xl font-bold mb-4">{t("edit_product")}</h2>

        <div className="overflow-y-auto h-[calc(100%-2rem)] pr-2 space-y-3">
          <form className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-medium">
                {t("titleLabel")}
              </label>

              <input
                type="text"
                name="title"
                id="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Title"
              />

              {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="text-sm font-medium">
                {t("descriptionLabel")}
              </label>

              <input
                type="text"
                name="description"
                id="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Description"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="price" className="text-sm font-medium">
                {t("priceLabel")}
              </label>

              <input
                type="number"
                name="price"
                id="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Price"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="salePrice" className="text-sm font-medium">
                {t("salePriceLabel")}
              </label>

              <input
                type="number"
                name="salePrice"
                id="salePrice"
                value={formData.salePrice !== undefined && formData.salePrice !== null ? formData.salePrice : ""}
                className="w-full p-2 border rounded-lg bg-gray-100"
                placeholder="Sale Price"
                disabled
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="discountPercentage" className="text-sm font-medium">
                {t("discountLabel")}
              </label>

              <input
                type="number"
                name="discountPercentage"
                id="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Discount %"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-1 mb-4">
              <label htmlFor="rating" className="text-sm font-medium">
                Average Rating
              </label>

              <input
                type="number"
                id="rating"
                value={averageRating}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                min={0}
                max={5}
                step={0.1}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="brand" className="text-sm font-medium">
                {t("brandLabel")}
              </label>

              <input
                type="text"
                name="brand"
                id="brand"
                value={formData.brand || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Brand"
              />
            </div>

            <div className="flex justify-between gap-3 pt-3">
              <button
                type="button"
                onClick={handleUpdateProduct}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl"
              >
                {t("update")}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-xl"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">{t("confirm_delete_product")}</h2>

        <div className="flex justify-between gap-3">
          <button
            onClick={handleDeleteProduct}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl"
          >
            {t("yes_delete")}
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-xl"
          >
            {t("cancel")}
          </button>
        </div>
      </Modal>

      {/* ZOOM MODAL */}
      {isZoomOpen && selectedImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-5xl w-full px-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomOpen(false);
              }}
              className="absolute top-4 right-6 text-white text-3xl z-50"
            >
              ✕
            </button>

            <img
              src={typeof selectedImg === "string" ? selectedImg : selectedImg ? URL.createObjectURL(selectedImg) : ""}
              alt="Zoomed"
              className="w-full h-auto max-h-[90vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* ENQUIRY MODAL */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        productName={product?.title}
        productImage={typeof selectedImg === "string" ? selectedImg : undefined}
        productPrice={product?.price ? `₹${product.price}` : undefined}
      />
    </motion.div>
  );
};

export default SingleProduct;
