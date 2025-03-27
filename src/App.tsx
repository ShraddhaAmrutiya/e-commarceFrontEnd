// import { Provider } from "react-redux";
// import "./App.css";
// import { store } from "./redux/store";
// import Navbar from "./components/Navbar";
// import { Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
// import { Toaster } from "react-hot-toast";
// // import Cart from "./components/Cart";
// import SingleProduct from "./pages/SingleProduct";
// import LoginModal from "./components/LoginModal";
// import Wishlist from "./pages/Wishlist";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Profile from "./pages/Profile";
// import AllProducts from "./pages/AllProducts";
// import ScrollToTopButton from "./components/ScrollToTopButton";
// import AllCategories from "./pages/AllCategories";
// import SingleCategory from "./pages/SingleCategory";

// function App() {
//   return (
//     <Provider store={store}>
//       <Navbar />
//       <Routes>
//       <Route path="*" element={<h1>Page Not Found</h1>} />
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
//       {/* <Cart /> */}
//       <LoginModal />
//       <ScrollToTopButton />
//     </Provider>
//   );
// }

// export default App;




import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAppDispatch } from "./redux/hooks";
import { updateModal, doLogin } from "./redux/features/authSlice";
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

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Ensure modal is closed on page load
    dispatch(updateModal(false));

    // Load user session from localStorage
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      dispatch(doLogin({ username: savedUsername, password: "" }));
    }
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
        <Route path="/wishlist" element={<ProtectedRoute />}>
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
        <Route path="/account" element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
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

