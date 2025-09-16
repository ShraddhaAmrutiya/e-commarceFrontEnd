
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
    <div className="min-h-screen bg-gradient-to-br from-pearl-50 via-white to-resin-50 dark:bg-slate-800">
      <SlidingBannerq />
      {/* <Features /> */}
      <TrendingProducts />

      {/* CTA Button */}
      <div className="flex justify-center my-12 sm:my-16 px-4">
        <button
          onClick={() => navigate("/products")}
          className="btn-resin px-8 py-4 sm:px-12 sm:py-5 text-lg sm:text-xl font-bold shadow-resin hover:shadow-gold transition-all duration-500 hover:scale-110 animate-pulse-slow"
        >
          ✨ Explore All Products ✨
        </button>
      </div>

      {/* About Section */}
      <section className="relative py-16 sm:py-20 px-4 text-center overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-pearl-50 to-resin-50"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-resin-100/50 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gold-100/50 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-ocean-100/50 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold resin-text-gradient mb-6 animate-fadeInUp">
            About Aaraksha Resin Art
          </h2>
          <div className="glass-bg max-w-3xl mx-auto mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-6">
              At <span className="font-semibold resin-text-gradient">Aaraksha Resin Art</span>, we specialize in preserving your precious memories with handcrafted, customizable resin creations. 
              From elegant photo frames and unique keychains to flower-preserved clocks and beautiful rakhis — every piece is crafted with love, attention to detail, and artistic excellence.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              Our mission is to transform your special moments into timeless art pieces that you can treasure forever. 
              Each creation is unique, just like your memories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="bg-gradient-to-r from-resin-50 to-gold-50 p-6 rounded-2xl shadow-pearl hover:shadow-resin transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3">📞</div>
              <p className="text-gray-700 font-semibold mb-2">WhatsApp</p>
              <a
                href="https://wa.me/7874501471"
                target="_blank"
                rel="noopener noreferrer"
                className="text-resin-600 hover:text-resin-500 font-medium transition-colors duration-300"
              >
                +91 7874501471
              </a>
            </div>
            
            <div className="bg-gradient-to-r from-gold-50 to-ocean-50 p-6 rounded-2xl shadow-pearl hover:shadow-gold transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3">📷</div>
              <p className="text-gray-700 font-semibold mb-2">Instagram</p>
              <a
                href="https://www.instagram.com/aaraksha_resin__art?igsh=MTl3aHIxN2d2c2U5cg=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocean-600 hover:text-ocean-500 font-medium transition-colors duration-300"
              >
                @aaraksha_resin__art
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-resin-100 via-pearl-50 to-ocean-100 dark:from-slate-800 dark:to-slate-900 text-center py-12 mt-16 shadow-resin px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-resin-gradient"></div>
        <div className="absolute top-4 left-1/4 w-2 h-2 bg-gold-400 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-8 right-1/3 w-1 h-1 bg-resin-400 rounded-full animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-ocean-400 rounded-full animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10">
          <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 italic mb-4 font-playfair">
            "Art is not what you see, but what you make others see." – Edgar Degas
          </p>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold resin-text-gradient">Aaraksha Resin Art</span> – Crafted
            with ❤️ in India.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="https://wa.me/7874501471" target="_blank" rel="noopener noreferrer" 
               className="text-resin-600 hover:text-resin-500 transition-colors duration-300 text-lg">
              📞 WhatsApp
            </a>
            <a href="https://www.instagram.com/aaraksha_resin__art?igsh=MTl3aHIxN2d2c2U5cg==" target="_blank" rel="noopener noreferrer"
               className="text-ocean-600 hover:text-ocean-500 transition-colors duration-300 text-lg">
              📷 Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
