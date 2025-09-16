import Modal from "react-modal";

Modal.setAppElement("#root");

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAppDispatch } from "./redux/hooks";
import { updateModal, checkAuthStatus } from "./redux/features/authSlice";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import SingleProduct from "./pages/SingleProduct";
import LoginModal from "./components/LoginModal";
import Wishlist from "./pages/Wishlist";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import AllProducts from "./pages/AllProducts";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AllCategories from "./pages/AllCategories";
import SingleCategory from "./pages/SingleCategory";
import Cart from "./pages/cartPage";
import SearchPage from "./pages/searchpage";
import Register from "./components/Register";
import Login from "./pages/login";
import AddCategory from "./components/AddCategory";
import AddProduct from "./components/Addproduct";
import CheckoutPage from "./pages/checkOutpage";
import OrdersPage from "./pages/orderPge";
import ResetPassword from "./pages/Resetpassword";
import CheckoutDirectPage from "./pages/checkoutDirect";
import axiosInstance from "./utils/axiosInstance";
import LoadingScreen from "./components/LoadingScreen";
import ParticleBackground from "./components/ParticleBackground";

Modal.setAppElement("#root");

function AppContent() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // always set language header
  const language = localStorage.getItem("language") || "en";
  axiosInstance.defaults.headers.common["Accept-Language"] = language;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("Role");
    const userName = localStorage.getItem("userName");
    const language = localStorage.getItem("language") || "en";

    if (token && userId && role && userName) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axiosInstance.defaults.headers.common["userId"] = userId;
      axiosInstance.defaults.headers.common["Role"] = role;
      axiosInstance.defaults.headers.common["userName"] = userName;
    }

    axiosInstance.defaults.headers.common["Accept-Language"] = language;
  }, []);

  useEffect(() => {
    dispatch(updateModal(false));

    // wait for auth check, then hide loader
    const check = async () => {
      await dispatch(checkAuthStatus());
      setIsLoading(false);
    };
    check();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <Routes>
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/products/:_id" element={<SingleProduct />} />
        <Route path="category/:id" element={<SingleCategory />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoute allowedRoles={["admin", "seller", "customer"]} />}>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/checkoutDirect" element={<CheckoutDirectPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/cart/:_userId" element={<Cart />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin", "seller"]} />}>
          <Route path="/Addproduct" element={<AddProduct />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/addCategory" element={<AddCategory />} />
        </Route>
      </Routes>
      <Toaster position="bottom-center" reverseOrder={false} />
      <LoginModal />
      <ScrollToTopButton />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
}

export default App;
