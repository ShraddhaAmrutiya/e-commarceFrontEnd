import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt4, HiX } from "react-icons/hi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { updateModal } from "../redux/features/authSlice";
import { toggleTheme } from "../redux/features/themeSlice";
import { fetchWishlistItems } from "../redux/features/WishlistSlice";
import CustomPopup from "./CustomPopup";
import axiosInstance from "../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.themeReducer.isDark);
  const userId: string = useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId") || "";
  const userName = useAppSelector((state) => state.authReducer.userName);
  const Role = useAppSelector((state) => state.authReducer.Role) || localStorage.getItem("role");

  const location = useLocation();

  // Scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem("language", "en");
    axiosInstance.defaults.headers.common["Accept-Language"] = "en";
    i18n.changeLanguage("en");
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 w-full z-50 font-inter transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg shadow-sm border-b border-zinc-200 dark:border-zinc-800 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-zinc-100 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
            <img
              src="/logo1.jpg"
              alt="Logo"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <span className="text-xl sm:text-2xl font-poppins font-bold text-zinc-900 dark:text-zinc-100 tracking-tight hidden sm:block">
            Aaraksha
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {(Role === "admin" || Role === "seller") && (
            <div className="flex gap-4">
              <Link
                to="/addcategory"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Categories
              </Link>
              <Link
                to="/Addproduct"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                + Product
              </Link>
            </div>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <Link
            to="/products"
            className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors"
          >
            {t(" All products")}
          </Link>
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <HiOutlineMenuAlt4 size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col p-6"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-full bg-zinc-100 dark:bg-zinc-800"
                >
                  <HiX size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6 font-poppins text-lg">
                <Link
                  to="/products"
                  className="text-zinc-900 dark:text-white font-medium hover:text-resin-600 transition-colors"
                >
                  {t(" products")}
                </Link>

                {(Role === "admin" || Role === "seller") && (
                  <>
                    <Link
                      to="/addcategory"
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                      Add Category
                    </Link>
                    <Link
                      to="/Addproduct"
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                      + {t("addProduct")}
                    </Link>
                  </>
                )}

                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2"></div>

                {userName ? (
                  <div className="mt-4">
                    <CustomPopup />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 mt-2">
                    <button
                      onClick={() => {
                        dispatch(updateModal(true));
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-center text-zinc-900 dark:text-white font-medium border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {t("loginCommon")}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
