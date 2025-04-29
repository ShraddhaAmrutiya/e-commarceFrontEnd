import Modal from 'react-modal';

Modal.setAppElement('#root');

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAppDispatch } from "./redux/hooks";
import { updateModal } from "./redux/features/authSlice";
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
import { checkAuthStatus } from "./redux/features/authSlice";
import SearchPage from "./pages/searchpage";
import Register from "./components/Register"
import Login from "./pages/login";
import AddCategory from "./components/AddCategory";
import AddProduct from "./components/Addproduct";
import CheckoutPage from "./pages/checkOutpage";
import OrdersPage from "./pages/orderPge";
import ResetPassword from "./pages/Resetpassword";
import CheckoutDirectPage from "./pages/checkoutDirect"

// import { useEffe ct } from "react";
import axios from "axios";
function AppContent() {
  const dispatch = useAppDispatch();

useEffect(() => {
  const token = localStorage.getItem("accessToken");
  // const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("Role");
  const userName = localStorage.getItem("userName");

  if (token && userId && role && userName) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.common["userId"] = userId;
    axios.defaults.headers.common["Role"] = role;
    axios.defaults.headers.common["userName"] = userName;
  }
}, []);


  useEffect(() => {
    dispatch(updateModal(false));

    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <>
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


        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkoutDirect" element={<CheckoutDirectPage />} />
          <Route path="/orders" element={<OrdersPage />} />

          <Route path="/Addproduct" element={<AddProduct />} />
          <Route path="/cart/:_userId" element={<Cart />} />
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
  theme="light" // or "dark" based on your UI
/>


    </Provider>
  );
}

export default App;
