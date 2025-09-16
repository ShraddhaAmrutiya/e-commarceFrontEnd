import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
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

const Navbar: FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const authMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const userId: string =
    useAppSelector((state) => state.authReducer.userId) ||
    localStorage.getItem("userId") ||
    "";
  const userName = useAppSelector((state) => state.authReducer.userName);
  const Role =
    useAppSelector((state) => state.authReducer.Role) ||
    localStorage.getItem("role");

  const cartCount = useAppSelector((state) => {
    const cartItems = state.cartReducer?.cartItems;
    return Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems.length
      : 0;
  });

  const wishlistCount = useAppSelector((state) => {
    const wishlistItems = state.wishlistReducer?.wishlistItems;
    return Array.isArray(wishlistItems)
      ? wishlistItems.reduce(
          (total, item) => total + (item.products?.length || 0),
          0
        )
      : 0;
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const finalUserId = userId || storedUserId;

    if (finalUserId) {
      dispatch(fetchCartItems(finalUserId)).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          dispatch(
            setCartItems((response.payload as CartApiResponse).cartItems)
          );
        }
      });
    }
  }, [dispatch, location.pathname, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, userId]);

  // 👇 Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // 👇 Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

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
    <header className="bg-gradient-to-r from-resin-100 via-pearl-50 to-ocean-100 shadow-resin sticky top-0 z-50 font-poppins backdrop-blur-lg border-b border-resin-200/30">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-nowrap items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 sm:gap-5 text-2xl font-extrabold tracking-tight whitespace-nowrap group"
        >
          <div className="relative">
            <img
              src="/logo1.jpg"
              alt="Aaraksha Resin Art Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full shadow-resin hover:shadow-gold transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-resin-400/20 to-gold-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <span className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold resin-text-gradient leading-tight hidden sm:block animate-fadeInDown">
            {/* Aaraksha */}
            <br />
            {/* <span className="text-lg sm:text-xl md:text-2xl gold-text-gradient">Resin Art</span> */}
          </span>
        </Link>
        {/* Search Bar */}
        <div className="flex flex-grow max-w-xs sm:max-w-sm relative group">
          <input
            type="text"
            placeholder={t("searchPlaceholder") || "Search unique resin art..."}
            className="w-full px-4 py-2 sm:py-3 border-2 border-resin-300 rounded-l-xl text-sm focus:outline-none focus:border-resin-500 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-resin"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="btn-resin rounded-l-none rounded-r-xl px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center group-hover:scale-105 transition-all duration-300"
            onClick={handleSearch}
          >
            <BsSearch size={16} className="sm:hidden" />
            <BsSearch size={18} className="hidden sm:block" />
          </button>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-lg font-medium">
          <Link
            to="/products"
            className="text-resin-700 hover:text-resin-500 transition-all duration-300 hover:scale-105 font-semibold"
          >
            {t("products")}
          </Link>
          <Link 
            to="/categories" 
            className="text-ocean-600 hover:text-ocean-500 transition-all duration-300 hover:scale-105 font-semibold"
          >
            Categories
          </Link>

          {(Role === "admin" || Role === "seller") && (
            <div className="flex gap-2">
              <Link
                to="/addcategory"
                className="btn-ocean text-sm px-3 py-1.5 rounded-xl"
              >
                Add Category
              </Link>
              <Link
                to="/Addproduct"
                className="btn-gold text-sm px-3 py-1.5 rounded-xl"
              >
                + {t("addProduct")}
              </Link>
            </div>
          )}

          <button
            onClick={() => {
              if (!userId) {
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
                return;
              }
              navigate("/wishlist");
            }}
            className="relative group p-2 rounded-full hover:bg-resin-100 transition-all duration-300"
          >
            <AiOutlineHeart size={24} className="text-resin-600 group-hover:text-resin-500 group-hover:scale-110 transition-all duration-300" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-resin-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce-slow">
                {wishlistCount}
              </span>
            )}
          </button>

          <button onClick={showCart} className="relative group p-2 rounded-full hover:bg-gold-100 transition-all duration-300">
            <AiOutlineShoppingCart size={24} className="text-gold-600 group-hover:text-gold-500 group-hover:scale-110 transition-all duration-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce-slow">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative" ref={authMenuRef}>
            {userName ? (
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <img
                    src="/profilepic.jpg"
                    className="w-10 h-10 rounded-full shadow-resin group-hover:shadow-gold transition-all duration-300 group-hover:scale-110"
                    alt="Profile"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-resin-400/20 to-gold-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CustomPopup />
              </div>
            ) : (
              <div
                onClick={() => setAuthMenuOpen(!authMenuOpen)}
                className="flex items-center gap-2 cursor-pointer hover:text-resin-500 transition-all duration-300 p-2 rounded-full hover:bg-resin-100"
              >
                <FaUser className="text-lg" />
                <span className="font-medium">{t("loginCommon")}</span>
              </div>
            )}

            {!userName && authMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-resin z-50 border border-resin-200/50 overflow-hidden">
                <div
                  onClick={() => {
                    dispatch(updateModal(true));
                    setAuthMenuOpen(false);
                  }}
                  className="px-6 py-3 hover:bg-resin-50 cursor-pointer transition-all duration-300 font-medium text-resin-700"
                >
                  {t("loginCommon")}
                </div>
                <Link
                  to="/register"
                  onClick={() => setAuthMenuOpen(false)}
                  className="block px-6 py-3 hover:bg-resin-50 transition-all duration-300 font-medium text-resin-700"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>

          <select
            value={language}
            onChange={handleLanguageChange}
            className="ml-2 px-3 py-1.5 text-sm border border-resin-300 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-resin-500 transition-all duration-300"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="he">HE</option>
          </select>
        </div>
        {/* Mobile Menu Icon */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl text-resin-700 hover:text-resin-500 p-2 rounded-full hover:bg-resin-100 transition-all duration-300"
          >
            <HiOutlineDotsVertical />
          </button>
        </div>
        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-full right-4 mt-2 w-64 md:hidden flex flex-col gap-2 text-resin-700 bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-resin z-50 border border-resin-200/50 animate-fadeInDown"
          >
            <Link 
              to="/products" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 rounded-xl hover:bg-resin-50 transition-all duration-300 font-medium"
            >
              {t("products")}
            </Link>

            <Link 
              to="/categories" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 rounded-xl hover:bg-ocean-50 transition-all duration-300 font-medium text-ocean-600"
            >
              Categories
            </Link>

            {(Role === "admin" || Role === "seller") && (
              <Link
                to="/Addproduct"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-gold text-sm px-4 py-2 rounded-xl text-center"
              >
                + {t("addProduct")}
              </Link>
            )}

            <button
              onClick={() => {
                showCart();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gold-50 transition-all duration-300 font-medium text-gold-600"
            >
              <AiOutlineShoppingCart size={20} />
              Cart ({cartCount})
            </button>

            <button
              onClick={() => {
                if (!userId) {
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                  return;
                }
                navigate("/wishlist");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-resin-50 transition-all duration-300 font-medium text-resin-600"
            >
              <AiOutlineHeart size={20} />
              Wishlist ({wishlistCount})
            </button>

            <div className="border-t border-resin-200 pt-2 mt-2">
              {userName ? (
                <CustomPopup />
              ) : (
                <>
                  <div
                    onClick={() => {
                      setAuthMenuOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="cursor-pointer hover:text-resin-500 flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-resin-50 transition-all duration-300 font-medium"
                  >
                    <FaUser className="text-lg" />
                    {t("loginCommon")}
                  </div>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-xl hover:bg-resin-50 transition-all duration-300 font-medium"
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
         
        {showNotification && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-resin-gradient text-white px-6 py-4 rounded-2xl shadow-resin z-50 animate-fadeInUp">
            {t("pleaseLogin")}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
