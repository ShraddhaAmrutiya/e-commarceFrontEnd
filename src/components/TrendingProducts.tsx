import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const TrendingProducts = () => {
  const { t } = useTranslation();
  const featuredProducts = useAppSelector(
    (state) => state.productReducer.featuredProducts
  );

  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <div className="relative z-10 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {t("trendingProducts") || "Trending Now"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base font-light">
              Discover our most popular resin art pieces
            </p>
          </motion.div>

          {/* Custom Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden sm:flex gap-3"
          >
            <button className="swiper-button-prev-custom w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95">
              <AiOutlineLeft size={20} />
            </button>
            <button className="swiper-button-next-custom w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95">
              <AiOutlineRight size={20} />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Swiper
            spaceBetween={24}
            loop={featuredProducts.length > 3}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination-custom',
              renderBullet: function (_index, className) {
                return `<span class="${className} w-2 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-all duration-300 mx-1 inline-block"></span>`;
              }
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="pb-12"
          >
            {featuredProducts.map((product, index) => (
              <SwiperSlide key={product._id || index} className="h-auto">
                <div className="h-full py-2">
                  <ProductCard {...product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Mobile Pagination Container */}
          <div className="swiper-pagination-custom flex justify-center sm:hidden mt-4"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrendingProducts;
