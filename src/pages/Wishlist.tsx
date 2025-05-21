import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchWishlistItems, removeWishlistItem } from "../redux/features/WishlistSlice";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

const Wishlist: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { wishlistItems, loading, error } = useSelector((state: RootState) => state.wishlistReducer);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchWishlistItems());
  }, [dispatch]);

  const handleRemove = (productId: string) => {
    dispatch(removeWishlistItem({ productId }));
  };

  const handleCardClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{t("wishlist.title")}</h2>

      {loading && <p className="text-gray-500">{t("wishlist.loading")}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && wishlistItems.length === 0 && <p className="text-gray-600">{t("wishlist.empty")}</p>}

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems && wishlistItems.length > 0 ? (
          wishlistItems.map((wishlist) => {
            return wishlist.products && wishlist.products.length > 0
              ? wishlist.products.map((item) => {
                  const product = item.productId;
                  if (!product) return null;

                  const images = Array.isArray(product.images) ? product.images : [];

                  const imageUrl =
                    images.length > 0
                      ? images[0].startsWith("/")
                        ? `${BASE_URL}${images[0]}`
                        : images[0]
                      : "/placeholder.jpg";

                  return (
                    <div
                      key={product._id}
                      className="border p-4 rounded-lg shadow-lg bg-white cursor-pointer hover:shadow-xl transition"
                      onClick={() => handleCardClick(product._id)}
                    >
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={product.title || t("wishlist.productImageAlt")}
                          className="w-full h-52 object-cover rounded-md"
                        />
                      </div>

                      {/* Product Details */}
                      <h3 className="text-lg font-semibold mt-2">{product.title || t("wishlist.noTitle")}</h3>
                      <p className="text-gray-600">
                        ₹
                        {product.salePrice && product.salePrice > 0
                          ? product.salePrice.toFixed(2)
                          : product.price.toFixed(2)}
                      </p>

                      {/* Remove Button */}
                      <div className="mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // prevent card click from firing
                            handleRemove(product._id);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          {t("wishlist.remove")}
                        </button>
                      </div>
                    </div>
                  );
                })
              : null;
          })
        ) : (
          <p className="text-gray-600">{t("wishlist.noItems")}</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
