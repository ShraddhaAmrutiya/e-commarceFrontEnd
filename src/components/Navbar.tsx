import { BsSearch } from "react-icons/bs";
import { FC, useEffect, useState } from "react";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { fetchCartItems } from "../models/CartSlice";
import { toggleCart1 } from "../redux/features/cartSlice";
import { updateModal, checkAuthStatus } from "../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import CustomPopup from "./CustomPopup";
import { updateDarkMode } from "../redux/features/homeSlice";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { fetchWishlistItems } from "../redux/features/WishlistSlice";

const Navbar: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const userId: string = useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId") || "";
  const [showNotification, setShowNotification] = useState(false);
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    dispatch(checkAuthStatus());
    if (userId) {
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, userId]);

  const cartCount = useAppSelector((state) => state.cartReducer?.cartItems?.length);
  const totalQuantity = useAppSelector((state) =>
    state.cartReducer.cartItems.reduce((acc, item) => acc + (item.quantity ?? 0), 0)
  );
  const totalPrice = useAppSelector((state) =>
    state.cartReducer.cartItems.reduce((acc, item) => acc + (item.quantity ?? 0) * (item.price ?? 0), 0)
  );

  const wishlistCount = useAppSelector((state) => state.wishlistReducer?.wishlistItems?.length);

  const userName = useAppSelector((state) => state.authReducer.userName);
  const isDarkMode = useAppSelector((state) => state.homeReducer.isDarkMode);

  const navigate = useNavigate();

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

    dispatch(fetchCartItems(finalUserId));
    dispatch(toggleCart1());
    navigate(`/cart/${userId}`);
  };

  return (
    <div className="py-4 bg-white dark:bg-slate-800 top-0 sticky z-10 shadow-lg font-karla">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <div className="bg-blue-500 text-white text-[26px] grid place-items-center px-4">
              <BsSearch />
            </div>
          </div>
          <div className="flex gap-4 md:gap-8 items-center dark:text-white">
            <Link to="/products" className="text-xl font-bold">
              Products
            </Link>
            <Link to="/categories" className="text-xl font-bold">
              Categories
            </Link>
            <div className="flex items-center gap-2">
              {userName ? (
                <>
                  <img src="https://robohash.org/Terry.png?set=set4" alt="avatar" className="w-6" />
                  <CustomPopup />
                </>
              ) : (
                <>
                  <FaUser className="text-gray-500 text-2xl dark:text-white" />
                  <span
                    className="cursor-pointer hover:opacity-85 dark:text-white"
                    onClick={() => dispatch(updateModal(true))}
                  >
                    Login
                  </span>
                </>
              )}
            </div>
            <div
              className="text-gray-500 text-[32px] relative hover:cursor-pointer hover:opacity-80"
              onClick={() => navigate("/wishlist")}
            >
              <AiOutlineHeart className="dark:text-white" />
              {wishlistCount > 0 && (
                <div className="absolute top-[-10px] right-[-10px] bg-red-600 w-[20px] h-[20px] rounded-full text-white text-[12px] grid place-items-center">
                  {wishlistCount}
                </div>
              )}
            </div>
            <div
              className="text-gray-500 text-[32px] relative hover:cursor-pointer hover:opacity-80"
              onClick={showCart}
            >
              <AiOutlineShoppingCart className="dark:text-white" />
              <div className="absolute top-[-15px] right-[-10px] bg-red-600 w-[25px] h-[25px] rounded-full text-white text-[14px] grid place-items-center">
                {cartCount}
              </div>
              <div className="absolute top-[25px] right-[-10px] text-sm text-white">
                {totalQuantity} items - ${totalPrice.toFixed(2)}
              </div>
            </div>
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
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-black py-2 px-6 rounded-lg shadow-lg">
          <span>Please login to view your cart</span>
        </div>
      )}
    </div>
  );
};

export default Navbar;
