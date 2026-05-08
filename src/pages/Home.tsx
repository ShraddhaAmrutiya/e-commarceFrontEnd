import { FC, useEffect } from "react";
import { motion } from "framer-motion";
import SlidingBanner from "./SlidingBanner";
import TrendingProducts from "../components/TrendingProducts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import BASE_URL from "../config/apiconfig";
import { updateNewList, updateFeaturedList } from "../redux/features/productSlice";
import { Product } from "../models/Product";

// Social Icons
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

interface Category {
  category: string;
  products: Product[];
}

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

          dispatch(updateFeaturedList(productList));
          dispatch(updateNewList(productList.slice(8, 16)));
        })
        .catch((error) => console.error("Error fetching products:", error));
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 font-inter selection:bg-resin-500 selection:text-white"
    >
      {/* Hero Section */}
      <SlidingBanner />

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-24 px-4 border-b border-zinc-200 dark:border-zinc-800"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-poppins font-bold text-zinc-900 dark:text-zinc-100 mb-16 tracking-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-resin-600 to-gold-500 bg-clip-text text-transparent">Aaraksha</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group p-8 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 hover:border-resin-200 dark:hover:border-resin-900/50 hover:shadow-lg hover:shadow-resin-200/20 dark:hover:shadow-resin-900/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✨</div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Handcrafted Excellence</h3>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every piece is meticulously crafted with premium resin, attention to detail, and pure artisanal skill.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group p-8 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 hover:border-gold-200 dark:hover:border-gold-900/50 hover:shadow-lg hover:shadow-gold-200/20 dark:hover:shadow-gold-900/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎁</div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Custom Creations</h3>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Personalize your moments with custom designs, colors, and themes that reflect your unique story.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group p-8 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-lg hover:shadow-emerald-200/20 dark:hover:shadow-emerald-900/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">❤️</div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Premium Quality</h3>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                UV-resistant, durable, and long-lasting creations that preserve your memories for years to come.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <div className="py-16 sm:py-24">
        <TrendingProducts />
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="flex justify-center my-12 sm:my-20 px-4"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-resin-500 to-gold-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

          <button
            onClick={() => navigate("/products")}
            className="relative px-12 py-6 bg-gradient-to-r from-resin-600 to-resin-700 hover:from-resin-700 hover:to-resin-800 text-white text-lg font-semibold rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 border border-resin-500/50"
          >
            Explore Handcrafted Collection
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-28 px-4 border-y border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-resin-50/50 to-gold-50/50 dark:from-zinc-900/50 dark:to-zinc-900/50"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-poppins font-bold text-zinc-900 dark:text-zinc-100 mb-12 tracking-tight">
            The Story Behind{" "}
            <span className="bg-gradient-to-r from-resin-600 to-gold-500 bg-clip-text text-transparent">Aaraksha</span>
          </h2>

          <div className="space-y-8 text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed font-light">
            <p className="text-center">
              At <strong className="font-semibold text-zinc-900 dark:text-white">Aaraksha Resin Art</strong>, we believe
              that memories deserve to be preserved in the most beautiful way possible.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-14">
            {/* WhatsApp */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              href="https://wa.me/919033094705"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg hover:shadow-green-200/30 dark:hover:shadow-green-900/30 transition-all duration-300"
            >
              <div className="mb-4">
                <FaWhatsapp className="text-5xl text-green-500 group-hover:scale-110 transition-transform duration-300" />
              </div>

              <h3 className="text-zinc-900 dark:text-white font-bold mb-1 text-xl">WhatsApp</h3>

              <p className="text-zinc-600 dark:text-zinc-400 font-medium">Quick inquiries & orders</p>

              <p className="text-green-600 dark:text-green-400 font-semibold mt-3">+91 9033094705</p>
            </motion.a>

            {/* Instagram */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              href="https://www.instagram.com/aaraksha_resin__art"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-lg hover:shadow-pink-200/30 dark:hover:shadow-pink-900/30 transition-all duration-300"
            >
              <div className="mb-4">
                <FaInstagram className="text-5xl text-pink-500 group-hover:scale-110 transition-transform duration-300" />
              </div>

              <h3 className="text-zinc-900 dark:text-white font-bold mb-1 text-xl">Instagram</h3>

              <p className="text-zinc-600 dark:text-zinc-400 font-medium">See our latest creations</p>

              <p className="text-pink-600 dark:text-pink-400 font-semibold mt-3">@aaraksha_resin__art</p>
            </motion.a>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
