
// import { useEffect } from "react";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
// import { useAppDispatch } from "./redux/hooks";
// import { updateModal } from "./redux/features/authSlice";
// import Navbar from "./components/Navbar";
// import { Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import { Toaster } from "react-hot-toast";
// import SingleProduct from "./pages/SingleProduct";
// import LoginModal from "./components/LoginModal";
// import Wishlist from "./pages/Wishlist";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Profile from "./pages/Profile";
// import AllProducts from "./pages/AllProducts";
// import ScrollToTopButton from "./components/ScrollToTopButton";
// import AllCategories from "./pages/AllCategories";
// import SingleCategory from "./pages/SingleCategory";
// import { checkAuthStatus } from "./redux/features/authSlice";
// function AppContent() {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     // Ensure modal is closed on page load
//     dispatch(updateModal(false));

//     // 🔥 Load user authentication status
//     dispatch(checkAuthStatus()); 
//   }, [dispatch]);

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="*" element={<h1>Page Not Found</h1>} />
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<AllProducts />} />
//         <Route path="/categories" element={<AllCategories />} />
//         <Route path="/products/:_id" element={<SingleProduct />} />
        
//         <Route path="category/:id" element={<SingleCategory />} />
//         <Route path="/wishlist" element={<ProtectedRoute />}>
//           <Route path="/wishlist" element={<Wishlist />} />
//         </Route>
//         <Route path="/account" element={<ProtectedRoute />}>
//           <Route path="/account" element={<Profile />} />
//         </Route>
//       </Routes>
//       <Toaster position="bottom-center" reverseOrder={false} />
//       <LoginModal />
//       <ScrollToTopButton />
//     </>
//   );
// }

// function App() {
//   return (
//     <Provider store={store}>
//       <AppContent />
//     </Provider>
//   );
// }

// export default App;

import { useEffect } from "react";
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

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Ensure modal is closed on page load
    dispatch(updateModal(false));

    // 🔥 Load user authentication status
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="*" element={<h1>Page Not Found</h1>} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/products/:_id" element={<SingleProduct />} />
        <Route path="category/:id" element={<SingleCategory />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/cart/:_userId" element={<Cart />} /> {/* Add Cart route here */}
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
    </Provider>
  );
}

export default App;
