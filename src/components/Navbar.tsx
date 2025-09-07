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
    <header className="bg-gradient-to-r from-indigo-300 via-pink-200 to-yellow-100 shadow-lg sticky top-0 z-50 font-karla">
      <div className="container mx-auto px-6 py-4 flex flex-nowrap items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-5 text-2xl font-extrabold tracking-tight text-pink-800 whitespace-nowrap"
        >
          <img
            src="/logo1.jpg"
            alt="Logo"
            className="w-16 h-16 object-cover rounded-full shadow-lg hover:shadow-2xl transition duration-300"
          />

          <span className="text-4xl font-bold drop-shadow-sm leading-tight hidden sm:block">
            Araksha
            <br />
            Resin Art
          </span>
        </Link>
        {/* Search Bar */}
        <div className="flex flex-grow max-w-sm">
          <input
            type="text"
            placeholder={t("searchPlaceholder") || "Search unique pieces..."}
            className="w-full px-3 py-2 border-2 border-pink-400 rounded-l-md text-sm focus:outline-none bg-white bg-opacity-70 backdrop-blur-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-r-md"
            onClick={handleSearch}
          >
            <BsSearch size={18} />
          </button>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-[25px] font-medium text-pink-900">
          <Link
            to="/products"
            className="hover:text-indigo-700 transition-colors"
          >
            {t("products")}
          </Link>
          <Link to="/categories" className="text-xl font-bold text-blue-600">
            Categories
          </Link>

          {(Role === "admin" || Role === "seller") && (
            <div className="flex gap-2">
              <Link
                to="/addcategory"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm md:text-base"
              >
                Add Category
              </Link>
              <Link
                to="/Addproduct"
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm shadow-sm"
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
            className="relative"
          >
            <AiOutlineHeart size={26} className="hover:text-red-500" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button onClick={showCart} className="relative">
            <AiOutlineShoppingCart size={26} className="hover:text-pink-600" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative" ref={authMenuRef}>
            {userName ? (
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src="/profilepic.jpg"
                  className="w-14 h-14 rounded-full shadow"
                />
                <CustomPopup />
              </div>
            ) : (
              <div
                onClick={() => setAuthMenuOpen(!authMenuOpen)}
                className="flex items-center gap-1 cursor-pointer hover:text-indigo-500"
              >
                <FaUser className="text-xl" />
                <span>{t("loginCommon")}</span>
              </div>
            )}

            {!userName && authMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white bg-opacity-90 backdrop-blur-md rounded shadow-lg z-50 border border-pink-300">
                <div
                  onClick={() => {
                    dispatch(updateModal(true));
                    setAuthMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-pink-100 cursor-pointer"
                >
                  {t("loginCommon")}
                </div>
                <Link
                  to="/register"
                  onClick={() => setAuthMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-pink-100"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>

          <select
            value={language}
            onChange={handleLanguageChange}
            className="ml-2 px-2 py-1 text-sm border border-pink-300 rounded bg-white bg-opacity-70 backdrop-blur-sm"
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
            className="text-2xl text-pink-800 hover:text-pink-600"
          >
            <HiOutlineDotsVertical />
          </button>
        </div>
        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-full right-4 mt-2 w-56 md:hidden flex flex-col gap-3 text-pink-900 bg-white bg-opacity-95 p-4 rounded-xl shadow-lg z-50"
          >
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
              {t("products")}
            </Link>

            {(Role === "admin" || Role === "seller") && (
              <Link
                to="/Addproduct"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm shadow-sm"
              >
                + {t("addProduct")}
              </Link>
            )}

            <button
              onClick={() => {
                showCart();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2"
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
              className="flex items-center gap-2"
            >
              <AiOutlineHeart size={20} />
              Wishlist ({wishlistCount})
            </button>

            <div>
              {userName ? (
                <CustomPopup />
              ) : (
                <>
                  <div
                    onClick={() => {
                      setAuthMenuOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="cursor-pointer hover:text-indigo-500 flex items-center gap-2"
                  >
                    <FaUser className="text-lg" />
                    {t("loginCommon")}
                  </div>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("register")}
                  </Link>
                  <Link
                    to="/categories"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-bold"
                  >
                    Categories
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
         
        {showNotification && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white px-6 py-4 rounded-lg shadow-lg z-50">
            {t("pleaseLogin")}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
