import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchCartItems } from "../models/CartSlice";
import { toggleCart1, setCartItems } from "../redux/features/cartSlice";
import { updateModal } from "../redux/features/authSlice";
import { fetchWishlistItems } from "../redux/features/WishlistSlice";
import CustomPopup from "./CustomPopup";
import { CartItem } from "../models/CartItem";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
type CartApiResponse = {
  cartItems: CartItem[];
  cartCount: number;
};
type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number;
  discountPercentage: number;
  stock: number;
  brand: string;
  images: string[];
  rating: number;
};

type CategoryResponse = {
  category: string;
  products: Product[];
};

type ProductsApiResponse = {
  message: string;
  categories: CategoryResponse[];
};

const Navbar: FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const userId: string = useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId") || "";
  const userName = useAppSelector((state) => state.authReducer.userName);
  const Role = useAppSelector((state) => state.authReducer.Role) || localStorage.getItem("role");

  const cartCount = useAppSelector((state) => {
    const cartItems = state.cartReducer?.cartItems;
    return Array.isArray(cartItems) && cartItems.length > 0 ? cartItems.length : 0;
  });

  const wishlistCount = useAppSelector((state) => {
    const wishlistItems = state.wishlistReducer?.wishlistItems;
    return Array.isArray(wishlistItems)
      ? wishlistItems.reduce((total, item) => total + (item.products?.length || 0), 0)
      : 0;
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get<ProductsApiResponse>("/products/all");

        const allProducts: Product[] = res.data.categories.flatMap((cat) => cat.products);

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filter suggestions when typing
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = products.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
      setSuggestions(filtered.slice(0, 6)); // max 6 suggestions
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setSuggestions([]);
    }
  };
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const finalUserId = userId || storedUserId;

    if (finalUserId) {
      dispatch(fetchCartItems(finalUserId)).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          dispatch(setCartItems((response.payload as CartApiResponse).cartItems));
        }
      });
    }
  }, [dispatch, location.pathname, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (authMenuRef.current && !authMenuRef.current.contains(e.target as Node)) {
        setAuthMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    localStorage.setItem("language", selectedLang);
    axiosInstance.defaults.headers.common["Accept-Language"] = selectedLang;
    i18n.changeLanguage(selectedLang);
    window.location.reload();
  };

  const showCart = () => {
    const storedUserId = localStorage.getItem("userId");
    const finalUserId = userId || storedUserId;

    if (!finalUserId) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    dispatch(fetchCartItems(finalUserId)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        dispatch(setCartItems((response.payload as CartApiResponse).cartItems));
        dispatch(toggleCart1());
        navigate(`/cart/${finalUserId}`);
      }
    });
  };
  return (
    <header className="bg-white dark:bg-slate-800 shadow-lg sticky top-0 z-50 font-karla transition-all">
      <div className="container mx-auto px-6 py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-600 dark:text-white"
        >
          <img src="/public/emptyCart.jpg" alt="Logo" className="w-10 h-10 object-contain rounded" />
          ArtStore
        </Link>

        {/* ✅ Search with suggestions */}
        <div className="relative flex w-full max-w-xl flex-grow">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full px-4 py-3 border-2 border-blue-500 rounded-l-md text-sm focus:outline-none dark:bg-slate-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-r-md" onClick={handleSearch}>
            <BsSearch size={20} />
          </button>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-b-md shadow-lg z-50">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600"
                  onClick={() => {
                    setSearchTerm("");
                    setSuggestions([]);
                    navigate(`/products/${item._id}`);
                  }}
                >
                  <img
                    src={
                      item.images?.[0] ? `${axiosInstance.defaults.baseURL}${item.images[0]}` : "/default-product.jpg"
                    }
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded"
                  />

                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">₹{item.salePrice}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Navigation + Icons */}
        <div className="flex items-center gap-6 mt-2 md:mt-0 text-[15px] font-medium dark:text-white">
          {/* Nav Links */}
          <div className="flex items-center gap-6 text-lg font-semibold">
            <Link to="/products" className="hover:text-blue-600 transition-colors">
              {t("products")}
            </Link>
            <Link to="/categories" className="hover:text-blue-600 transition-colors">
              {t("categories")}
            </Link>
          </div>

          {/* Admin/Seller Buttons */}
          {(Role === "admin" || Role === "seller") && (
            <Link to="/Addproduct" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
              + {t("addProduct")}
            </Link>
          )}
          {Role === "admin" && (
            <Link to="/addcategory" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
              + {t("addCategory")}
            </Link>
          )}

          {/* Wishlist */}
          <button
            onClick={() => {
              if (!userId) {
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
                return;
              }
              navigate("/wishlist");
            }}
            className="relative"
          >
            <AiOutlineHeart size={28} className="hover:text-red-500" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button onClick={showCart} className="relative">
            <AiOutlineShoppingCart size={28} className="hover:text-blue-600" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          <div className="relative" ref={authMenuRef}>
            {userName ? (
              <div className="flex items-center gap-2 cursor-pointer">
                <img src="https://robohash.org/Terry.png?set=set4" alt="avatar" className="w-8 h-8 rounded-full" />
                <CustomPopup />
              </div>
            ) : (
              <div
                onClick={() => setAuthMenuOpen(!authMenuOpen)}
                className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
              >
                <FaUser className="text-xl" />
                <span>{t("loginCommon")}</span>
              </div>
            )}

            {!userName && authMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-700 rounded shadow-lg z-50 border dark:border-slate-600">
                <div
                  onClick={() => {
                    dispatch(updateModal(true));
                    setAuthMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                >
                  {t("loginCommon")}
                </div>
                <Link
                  to="/register"
                  onClick={() => setAuthMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="ml-2 px-2 py-1 text-sm border border-gray-300 dark:border-slate-500 rounded dark:bg-slate-800 dark:text-white"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="he">HE</option>
          </select>
        </div>

        {/* Login Required Notification */}
        {showNotification && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg z-50">
            {t("pleaseLogin")}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
