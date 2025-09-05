// import { FC, useEffect } from "react";
// // import HeroSection from "../components/HeroSection";
// import SlidingBannerq from "./SlidingBanner";
// // import Features from "../components/Features";
// import TrendingProducts from "../components/TrendingProducts";
// import { useNavigate } from "react-router-dom";

// import { useAppDispatch } from "../redux/hooks";
// import BASE_URL from "../config/apiconfig";
// interface Category {
//   category: string;
//   products: Product[];
// }
// import { updateNewList, updateFeaturedList } from "../redux/features/productSlice";
// import { Product } from "../models/Product";

// const Home: FC = () => {
//   const navigate = useNavigate();

//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     const fetchProducts = () => {
//       fetch(`${BASE_URL}/products/all`)
//         .then((res) => res.json())
//         .then(({ categories }) => {
//           const productList: Product[] = [];

//           categories.forEach(({ category, products }: Category) => {
//             products.forEach((product: Product) => {
//               productList.push({
//                 _id: product._id,
//                 title: product.title,
//                 images: Array.isArray(product.images)
//                   ? product.images.map((img) => (img.startsWith("/") ? `${BASE_URL}${img}` : img))
//                   : ["default_image_url"],
//                 price: product.price,
//                 rating: product.rating || 0,
//                 description: product.description,
//                 category,
//                 discountPercentage: product.discountPercentage,
//                 stock: product.stock,
//               });
//             });
//           });

//           dispatch(updateFeaturedList(productList.slice(0, 4)));
//           dispatch(updateNewList(productList.slice(8, 16)));
//         })
//         .catch((error) => console.error("Error fetching products:", error));
//     };

//     fetchProducts();
//   }, [dispatch]);

//   return (
//     <div className="dark:bg-slate-800">
//       <SlidingBannerq />
//       {/* <Features /> */}
//       <TrendingProducts />

//       {/* CTA Button */}
//       <div className="flex justify-center my-12 px-4">
//         <button
//           onClick={() => navigate("/products")}
//           className="px-6 py-3 md:px-10 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-lg md:text-xl font-semibold shadow-lg transition-transform duration-300 transform hover:scale-105"
//         >
//           Show All Products
//         </button>
//       </div>

//       {/* About Section */}
//       <section className="bg-white dark:bg-slate-700 py-10 px-4 text-center">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
//           About Aaraksha Resin Art
//         </h2>
//         <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 text-base md:text-lg">
//           At Aaraksha Resin Art, we specialize in preserving your memories with handcrafted, customizable resin creations.
//           From photo frames and keychains to flower-preserved clocks and rakhis — every piece is made with love and detail.
//         </p>
//         <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm md:text-base">
//           📞 <strong>WhatsApp:</strong>{" "}
//           <a
//             href="https://wa.me/7874501471"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-teal-600"
//           >
//             +91 7874501471
//           </a>
//         </p>
//         <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
//           📷 <strong>Instagram:</strong>{" "}
//           <a
//             href="https://instagram.com/araksha_resin"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-pink-600"
//           >
//             @aaraksha_resin
//           </a>
//         </p>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-teal-100 to-blue-100 dark:from-slate-800 dark:to-slate-900 text-center py-6 mt-10 shadow-inner px-4">
//         <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 italic">
//           “Art is not what you see, but what you make others see.” – Edgar Degas
//         </p>
//         <p className="mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
//           © {new Date().getFullYear()}{" "}
//           <span className="font-semibold text-teal-700 dark:text-teal-300">Aaraksha Resin Art</span> – Crafted
//           with ❤️ in India.
//         </p>
//       </footer>

//       <br />
//     </div>
//   );
// };

// export default Home;

import { FC, useEffect } from "react";
// import HeroSection from "../components/HeroSection";
import SlidingBannerq from "./SlidingBanner";
// import Features from "../components/Features";
import TrendingProducts from "../components/TrendingProducts";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../redux/hooks";
import BASE_URL from "../config/apiconfig";
interface Category {
  category: string;
  products: Product[];
}
import { updateNewList, updateFeaturedList } from "../redux/features/productSlice";
import { Product } from "../models/Product";

const Home: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProducts = () => {
      fetch(`${BASE_URL}/products/all`)
        .then((res) => res.json())
        .then(({ categories }) => {
          const productList: Product[] = [];

          categories.forEach(({ category, products }: Category) => {
            products.forEach((product: Product) => {
              productList.push({
                _id: product._id,
                title: product.title,
                images: Array.isArray(product.images)
                  ? product.images.map((img) => (img.startsWith("/") ? `${BASE_URL}${img}` : img))
                  : ["default_image_url"],
                price: product.price,
                rating: product.rating || 0,
                description: product.description,
                category,
                discountPercentage: product.discountPercentage,
                stock: product.stock,
              });
            });
          });

          dispatch(updateFeaturedList(productList.slice(0, 4)));
          dispatch(updateNewList(productList.slice(8, 16)));
        })
        .catch((error) => console.error("Error fetching products:", error));
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="dark:bg-slate-800">
      <SlidingBannerq />
      {/* <Features /> */}
      <TrendingProducts />

      {/* CTA Button */}
      <div className="flex justify-center my-8 sm:my-12 px-4">
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-base sm:text-lg md:text-xl font-semibold shadow-lg transition-transform duration-300 transform hover:scale-105"
        >
          Show All Products
        </button>
      </div>

      {/* About Section */}
      <section className="bg-white dark:bg-slate-700 py-8 sm:py-10 px-4 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
          About Aaraksha Resin Art
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4 text-sm sm:text-base md:text-lg">
          At Aaraksha Resin Art, we specialize in preserving your memories with handcrafted, customizable resin creations.
          From photo frames and keychains to flower-preserved clocks and rakhis — every piece is made with love and detail.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm sm:text-base">
          📞 <strong>WhatsApp:</strong>{" "}
          <a
            href="https://wa.me/7874501471"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600"
          >
            +91 7874501471
          </a>
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
          📷 <strong>Instagram:</strong>{" "}
          <a
            href="https://instagram.com/araksha_resin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600"
          >
            @aaraksha_resin
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-teal-100 to-blue-100 dark:from-slate-800 dark:to-slate-900 text-center py-6 mt-10 shadow-inner px-4">
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 italic">
          “Art is not what you see, but what you make others see.” – Edgar Degas
        </p>
        <p className="mt-2 text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-teal-700 dark:text-teal-300">Aaraksha Resin Art</span> – Crafted
          with ❤️ in India.
        </p>
      </footer>

      <br />
    </div>
  );
};

export default Home;
