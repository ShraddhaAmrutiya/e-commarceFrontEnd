import { FC, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { useTranslation } from "react-i18next";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHandHolding, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import Rating from "react-rating";
import toast from "react-hot-toast";
// import Modal from "react-modal";

import { Product } from "../models/Product";
import { addToCart } from "../redux/features/cartSlice";
import { fetchWishlistItems, removeWishlistItem } from "../redux/features/WishlistSlice";
import BASE_URL from "../config/apiconfig";
import RatingStar from "../components/RatingStar";
import PriceSection from "../components/PriceSection";
import ProductList from "../components/ProductList";
import useAuth from "../hooks/useAuth";
import { RootState } from "../redux/store";
  const language = localStorage.getItem("language") || "en";


interface Review {
  rating: number;
  comment: string;
  user?: { userName?: string };
}

const SingleProduct: FC = () => {
  const { _id } = useParams<{ _id?: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const token = localStorage.getItem("accessToken");
  const userId = useAppSelector((s) => s.authReducer.userId) || localStorage.getItem("userId");
  // const Role = useAppSelector((s) => s.authReducer.Role);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Review>({ rating: 0, comment: "" });
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [similar, setSimilar] = useState<Product[]>([]);
  const cartItems = useAppSelector((s: RootState) => s.cartReducer.cartItems);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return Number((reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1));
  }, [reviews]);

  const fetchProductDetails = async () => {
    if (!_id) return;
    try {
      const res = await fetch(`${BASE_URL}/products/${_id}`);
      const data = await res.json();
      if (!data?.product?._id) return toast.error(t("sp.productNotFound"));

      const productImages = Array.isArray(data.product.images)
        ? data.product.images.map((img: string) =>
            img.startsWith("/") ? `${BASE_URL}${img}` : img
          )
        : [];

      setProduct({ ...data.product, images: productImages });
      setSelectedImg(productImages[0]);
    } catch {
      toast.error(t("sp.errorFatchingProduct"));
    }
  };

  const fetchSimilar = async (category: string) => {
    try {
      const res = await fetch(`${BASE_URL}/products/category/${category}`);
      const data = await res.json();
      setSimilar(data.products?.filter((p: Product) => p._id !== _id));
    } catch {
      console.error("Failed to fetch similar products");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reviews/products/${_id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      toast.error(t("errorFatchingReview"));
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
    dispatch(fetchWishlistItems());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  useEffect(() => {
    if (product?.category && typeof product.category === "string") {
      fetchSimilar(product.category);
    } else if (typeof product?.category === "object") {
      fetchSimilar(product.category.name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

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

  const handleAddToCart = async () => {
    requireAuth(async () => {
      if (!product) return;
      const existing = cartItems.find((i) => i.productId._id === product._id);
      const quantity = existing ? existing.quantity + 1 : 1;
      const maxQty = product.stock ?? 10;

      if (quantity > maxQty) return toast.error(t("sp.maxQuantityReached"));

      try {
        const res = await fetch(`${BASE_URL}/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, productId: product._id, quantity }),
        });

        if (!res.ok) throw new Error();
          const existingProductIndex = cartItems.findIndex((item) => item.productId._id === product._id);
   const existingCartItem = cartItems[existingProductIndex];
      const maxQuantity = product.stock || 10; //
      const newQuantity = existingCartItem ? Math.min(existingCartItem.quantity + 1, maxQuantity) : 1;
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
        toast.success(t("sp.added"));
      } catch {
        toast.error(t("sp.addToCartFailed"));
      }
    });
  };

  const handleWishlistToggle = async () => {
    if (!product || !token || !userId) return;
    try {
      if (isInWishlist) {
        dispatch(removeWishlistItem({ productId: product._id }));
        toast.success(t("sp.removedWwishlist"));
      } else {
        const res = await fetch(`${BASE_URL}/wishlist/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            userId,
          },
          body: JSON.stringify({ productId: product._id, name: product.title }),
        });

        if (!res.ok) return toast.error(t("sp.failedTOaddinWishlist"));

        toast.success(t("sp.addedToWishlist"));
        dispatch(fetchWishlistItems());
      }
      setIsInWishlist(!isInWishlist);
    } catch {
      toast.error(t("sp.failTOUpdateWishlist"));
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    requireAuth(() => {
      sessionStorage.setItem(
        "checkoutItem",
        JSON.stringify({ ...product, productId: product._id, quantity: 1 })
      );
      navigate("/checkoutDirect");
    });
  };

  if (!product) return <div className="text-center py-20">{t("loading")}</div>;

  return (
    <div className="container mx-auto px-4 py-8 font-karla">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Image Section */}
        <div>
          {selectedImg && (
            <img
              src={selectedImg}
              alt={product.title}
              className="w-full h-80 object-cover rounded shadow"
            />
          )}
          <div className="flex gap-2 mt-4">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setSelectedImg(img)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                  selectedImg === img ? "border-blue-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <RatingStar rating={averageRating} />
          <PriceSection price={product.price} discountPercentage={product.discountPercentage ?? 0} />
          <p className="text-gray-600">{product.description}</p>

          <table className="mt-4 text-sm">
            <tbody>
              {product.brand && (
                <tr>
                  <td className="font-semibold pr-2">{t("brand")}:</td>
                  <td>{product.brand}</td>
                </tr>
              )}
              {product.category && (
                <tr>
                  <td className="font-semibold pr-2">{t("category")}:</td>
                  <td>{typeof product.category === "object" ? product.category.name : product.category}</td>
                </tr>
              )}
              <tr>
                <td className="font-semibold pr-2">{t("stock")}:</td>
                <td>{product.stock}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded">
              <AiOutlineShoppingCart /> {t("add_to_cart")}
            </button>
            <button onClick={handleBuyNow} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded">
              <FaHandHolding /> {t("buy_now")}
            </button>
            <button onClick={handleWishlistToggle} className="text-2xl">
              {isInWishlist ? <MdFavorite className="text-red-600" /> : <MdFavoriteBorder />}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">{t("customerReviews")}</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">{t("noReviewsYet")}</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r, idx) => (
              <li key={idx} className="bg-gray-100 p-3 rounded">
                <div className="flex items-center gap-2">
                  <RatingStar rating={r.rating} />
                  <span className="text-sm font-medium">{r.user?.userName}</span>
                </div>
                <p className="text-sm">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
           {similar.length > 0 && (
        <div className="mt-10">
          <ProductList title={t("similar_products")} products={similar} />
        </div>
      )}

        <div className="mt-6">
          <h3 className="text-md font-medium mb-1">{t("addReview")}</h3>
          <Rating
            fractions={10}
            initialRating={newReview.rating}
            onChange={(value: number) => setNewReview((prev) => ({ ...prev, rating: value }))}
            emptySymbol={<FaRegStar size={24} className="text-gray-400" />}
            fullSymbol={<FaStar size={24} className="text-yellow-500" />}
            placeholderSymbol={<FaStarHalfAlt size={24} className="text-yellow-400" />}
          />
          <textarea
            rows={3}
            value={newReview.comment}
            onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
            className="w-full border mt-2 p-2 rounded"
            placeholder={t("Writeyourcomment")}
          />
          <button
            onClick={handleReviewSubmit}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            {t("SubmitReview")}
          </button>
        </div>
      </div>

      {/* Similar Products */}
   
    </div>
  );
};

export default SingleProduct;
