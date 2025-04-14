import { BsSearch } from "react-icons/bs";
import { FC, useEffect, useState, useRef } from "react";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchCartItems } from "../models/CartSlice";
import { toggleCart1 } from "../redux/features/cartSlice";
import { updateModal } from "../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import CustomPopup from "./CustomPopup";
import { updateDarkMode } from "../redux/features/homeSlice";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Navbar: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);
  const dispatch = useAppDispatch();
  const userId: string =
    useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId") || "";
  const [showNotification, setShowNotification] = useState(false);
  const wishlistCount = useAppSelector((state) => state.wishlistReducer?.wishlistItems?.length);
  const userName = useAppSelector((state) => state.authReducer.userName);
  const isDarkMode = useAppSelector((state) => state.homeReducer.isDarkMode);
  const navigate = useNavigate();
  const Role = useAppSelector((state) => state.authReducer.Role) || localStorage.getItem("role");
  const location = useLocation();
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const finalUserId = userId || storedUserId;
  
    if (finalUserId) {
      dispatch(fetchCartItems(finalUserId));
      fetchCartCount();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); 
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('Auth token not found in localStorage');
    // Optionally, redirect user to login page or show a message
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCartCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/cart/count/${userId}`,
        {
          headers: {
            token, // Use the token here
          },
        }
      );
      const data = response.data as { count: number };
      setCartCount(data.count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };
  
  
  
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const finalUserId = userId || storedUserId;
  
    if (finalUserId) {
      dispatch(fetchCartItems(finalUserId));
      fetchCartCount(); // No argument passed here
    }
  },  [dispatch, userId, fetchCartCount]);
    
  const showCart = () => {
    const storedUserId = localStorage.getItem("userId");
    const finalUserId = userId || storedUserId;

    if (!finalUserId) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return;
    }

    dispatch(fetchCartItems(finalUserId)).then(() => {
      dispatch(toggleCart1());
      navigate(`/cart/${finalUserId}`);
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (authMenuRef.current && !authMenuRef.current.contains(e.target as Node)) {
        setAuthMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="py-4 bg-white dark:bg-slate-800 top-0 sticky z-10 shadow-lg font-karla">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold dark:text-white">
            My E-commerce website
          </Link>

          {/* Search Bar */}
          <div className="lg:flex hidden w-full max-w-[400px]">
            <input
              type="text"
              placeholder="Search for a product..."
              className="border-2 border-blue-500 px-6 py-2 w-full dark:text-white dark:bg-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <div
              className="bg-blue-500 text-white text-[26px] grid place-items-center px-4 cursor-pointer"
              onClick={handleSearch}
            >
              <BsSearch />
            </div>
          </div>

          {/* Icons & Links */}
          <div className="flex gap-4 md:gap-8 items-center dark:text-white">
            <Link to="/products" className="text-xl font-bold text-blue-600">
              Products
            </Link>
            <Link to="/categories" className="text-xl font-bold text-blue-600">
              Categories
            </Link>

            {Role === "admin" && (
              <>
                <Link
                  to="/addcategory"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm md:text-base"
                >
                  Add Category
                </Link>
                <Link
                  to="/Addproduct"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm md:text-base"
                >
                  Add Product
                </Link>
              </>
            )}

            {/* Auth Section */}
            <div className="relative" ref={authMenuRef}>
              {userName ? (
                <div className="flex items-center gap-2">
                  <img src="https://robohash.org/Terry.png?set=set4" alt="avatar" className="w-6" />
                  <CustomPopup />
                </div>
              ) : (
                <div
                  onClick={() => setAuthMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-85"
                >
                  <FaUser className="text-gray-500 text-2xl dark:text-white" />
                  <span className="dark:text-white">Login</span>
                </div>
              )}

              {/* Dropdown Menu */}
              {!userName && authMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-700 rounded-lg shadow-lg border dark:border-gray-600 z-50">
                  <div
                    onClick={() => {
                      dispatch(updateModal(true));
                      setAuthMenuOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                  >
                    Login
                  </div>
                  <Link
                    to="/register"
                    onClick={() => setAuthMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600"
                  >
                    New Customer? Register
                  </Link>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div
              className="text-gray-500 text-[32px] relative hover:cursor-pointer hover:opacity-80"
              onClick={() => {
                const storedUserId = localStorage.getItem("userId");
                const finalUserId = userId || storedUserId;

                if (!finalUserId) {
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                  return;
                }

                navigate("/wishlist");
              }}
            >
              <AiOutlineHeart className="dark:text-white" />
              {wishlistCount > 0 && (
                <div className="absolute top-[-10px] right-[-10px] bg-red-600 w-[20px] h-[20px] rounded-full text-white text-[12px] grid place-items-center">
                  {wishlistCount}
                </div>
              )}
            </div>

            {/* Cart */}
            <div
              className="text-gray-500 text-[32px] relative hover:cursor-pointer hover:opacity-80"
              onClick={showCart}
            >
              <AiOutlineShoppingCart className="dark:text-white" />
              <div
                className="absolute top-[-15px] right-[-10px] bg-red-600 w-[25px] h-[25px] rounded-full text-white text-[14px] grid place-items-center"
                data-test="cart-item-count"
              >
                {cartCount}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div
              onClick={() => {
                dispatch(updateDarkMode(!isDarkMode));
                document.body.classList.toggle("dark");
              }}
            >
              {isDarkMode ? (
                <MdOutlineLightMode className="cursor-pointer" size={30} />
              ) : (
                <MdOutlineDarkMode className="cursor-pointer" size={30} />
              )}
            </div>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-black py-2 px-6 rounded-lg shadow-lg">
          <span>Please Login to see the items</span>
        </div>
      )}
    </div>
  );
};

export default Navbar;
