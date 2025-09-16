// //

// // <ProductCard {...product} />

// import { useAppSelector } from "../redux/hooks";
// import { useTranslation } from "react-i18next";
// import ProductCard from "./ProductCard";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // ⬅️ Icon imports
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// const TrendingProducts = () => {
//   const { t } = useTranslation();
//   const featuredProducts = useAppSelector(
//     (state) => state.productReducer.featuredProducts
//   );

//   return (
//     <div className="relative z-10 py-12 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-3xl shadow-lg my-10">
//       <div className="text-center mb-10">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white drop-shadow-sm tracking-wide">
//           {t("trendingProducts")}
//         </h2>
//       </div>

//       {/* ✅ Stylish Arrows */}
//       <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
//         <button className="swiper-button-prev text-4xl text-white bg-purple-600 hover:bg-purple-800 rounded-full p-2 shadow-lg transition duration-300">
//           <AiOutlineLeft />
//         </button>
//       </div>
//       <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
//         <button className="swiper-button-next text-4xl text-white bg-purple-600 hover:bg-purple-800 rounded-full p-2 shadow-lg transition duration-300">
//           <AiOutlineRight />
//         </button>
//       </div>

//       <Swiper
//         spaceBetween={20}
//         loop={true}
//         autoplay={{ delay: 2500, disableOnInteraction: false }}
//         pagination={{ clickable: true }}
//         navigation={{
//           nextEl: ".swiper-button-next",
//           prevEl: ".swiper-button-prev",
//         }}
//         breakpoints={{
//           640: { slidesPerView: 1 },
//           768: { slidesPerView: 2 },
//           1024: { slidesPerView: 3 },
//         }}
//         modules={[Autoplay, Pagination, Navigation]}
//       >
//         {featuredProducts.map((product, index) => (
//           <SwiperSlide key={product._id || index}>
//             <ProductCard {...product} />{" "}
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default TrendingProducts;

import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

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
    <div className="relative z-10 py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-resin-50 via-pearl-50 to-ocean-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-3xl shadow-resin my-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-resin-gradient"></div>
      <div className="absolute top-8 left-8 w-16 h-16 bg-gold-200/30 rounded-full animate-float"></div>
      <div className="absolute bottom-8 right-8 w-20 h-20 bg-resin-200/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-ocean-200/30 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold resin-text-gradient tracking-wide drop-shadow-sm animate-fadeInUp">
          {t("trendingProducts") || "✨ Featured Creations ✨"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg mt-4 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          Discover our most popular resin art pieces
        </p>
      </div>

      {/* Enhanced Navigation Arrows */}
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 z-20">
        <button
          aria-label="Previous Slide"
          className="swiper-button-prev bg-white/80 backdrop-blur-lg text-resin-600 hover:text-white hover:bg-resin-gradient rounded-full p-4 shadow-resin transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-gold"
        >
          <AiOutlineLeft size={28} />
        </button>
      </div>
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-4 z-20">
        <button
          aria-label="Next Slide"
          className="swiper-button-next bg-white/80 backdrop-blur-lg text-resin-600 hover:text-white hover:bg-resin-gradient rounded-full p-4 shadow-resin transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-gold"
        >
          <AiOutlineRight size={28} />
        </button>
      </div>

      <Swiper
        spaceBetween={24}
        loop={featuredProducts.length > 3}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-resin-400 !opacity-50',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-resin-600 !opacity-100'
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 16 },
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="relative z-10"
      >
        {featuredProducts.map((product, index) => (
          <SwiperSlide key={product._id || index}>
            <div className="p-2 animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
              <ProductCard {...product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrendingProducts;
