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

type CartApiResponse = {
  cartItems: CartItem[];
  cartCount: number;
};

const Navbar: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const userId: string = useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId") || "";
  const userName = useAppSelector((state) => state.authReducer.userName);
  const Role = useAppSelector((state) => state.authReducer.Role) || localStorage.getItem("role");
  const cartCount = useAppSelector((state) => {
    const cartItems = state.cartReducer?.cartItems;
    return Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  });

  const wishlistCount = useAppSelector((state) => {
    const wishlistItems = state.wishlistReducer?.wishlistItems;
    return Array.isArray(wishlistItems) ? wishlistItems.reduce((total, item) => total + item.products.length, 0) : 0;
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);

  // Fetch Cart Items on mount
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

  // Fetch Wishlist Items on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistItems()).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          console.log("Fetched Wishlist Items:", response.payload);
        }
      });
    }
  }, [dispatch, userId]);

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

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
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
    <div className="py-4 bg-white dark:bg-slate-600 top-0 sticky z-10 shadow-lg font-karla">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold dark:text-white">
            My E-commerce website
          </Link>

          <div className="lg:flex hidden w-full max-w-[400px]">
            <input
              type="text"
              placeholder="Search for a product..."
              className="border-2 border-blue-500 px-6 py-2 w-full dark:text-white dark:bg-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <div
              className="bg-blue-500 text-white text-[26px] grid place-items-center px-4 cursor-pointer"
              onClick={handleSearch}
            >
              <BsSearch />
            </div>
          </div>

          <div className="flex gap-4 md:gap-8 items-center dark:text-white">
            <Link to="/products" className="text-xl font-bold text-blue-600">
              Products
            </Link>
            <Link to="/categories" className="text-xl font-bold text-blue-600">
              Categories
            </Link>

            {Role === "admin" && (
              <Link
                to="/addcategory"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm md:text-base"
              >
                Add Category
              </Link>
            )}

            {(Role === "admin" || Role === "seller") && (
              <Link
                to="/Addproduct"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm md:text-base"
              >
                Add Product
              </Link>
            )}

            {/* Auth */}
            <div className="relative" ref={authMenuRef}>
              {userName ? (
                <div className="flex items-center gap-2">
                  <img src="https://robohash.org/Terry.png?set=set4" alt="avatar" className="w-6" />
                  <CustomPopup />
                </div>
              ) : (
                <div
                  onClick={() => setAuthMenuOpen(!authMenuOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-85"
                >
                  <FaUser className="text-gray-500 text-2xl dark:text-white" />
                  <span className="dark:text-white">Login</span>
                </div>
              )}

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
                if (!userId) {
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                  return;
                }
                navigate("/wishlist");
              }}
            >
              <AiOutlineHeart className="dark:text-white" />
              {typeof wishlistCount === "number" && (
                <div className="absolute top-[-10px] right-[-10px] bg-red-600 w-[25px] h-[25px] rounded-full text-white text-[12px] grid place-items-center">
                  {wishlistCount}
                </div>
              )}
            </div>

            {/* Cart */}
            {!location.pathname.includes("/cart") && (
              <div
                className="text-gray-500 text-[32px] relative hover:cursor-pointer hover:opacity-80"
                onClick={showCart}
              >
                <AiOutlineShoppingCart className="dark:text-white" />
                <div className="absolute top-[-15px] right-[-10px] bg-red-600 w-[25px] h-[25px] rounded-full text-white text-[14px] grid place-items-center">
                  {cartCount}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-400 text-black py-12 px-16 rounded-lg shadow-lg">
          <span>Please Login to see the items</span>
        </div>
      )}
    </div>
  );
};

export default Navbar;
