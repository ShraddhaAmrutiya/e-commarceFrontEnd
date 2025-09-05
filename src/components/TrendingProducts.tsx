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
    <div className="relative z-10 py-12 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-3xl shadow-lg my-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-wide drop-shadow-sm">
          {t("trendingProducts")}
        </h2>
      </div>

      {/* 🌟 Stylish Glassmorphism Arrows */}
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-2 z-20">
        <button
          aria-label="Previous Slide"
          className="swiper-button-prev bg-white/30 backdrop-blur-md text-purple-800 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
        >
          <AiOutlineLeft size={24} />
        </button>
      </div>
      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-2 z-20">
        <button
          aria-label="Next Slide"
          className="swiper-button-next bg-white/30 backdrop-blur-md text-purple-800 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-400 rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
        >
          <AiOutlineRight size={24} />
        </button>
      </div>

      <Swiper
        spaceBetween={20}
        loop={featuredProducts.length > 3}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {featuredProducts.map((product, index) => (
          <SwiperSlide key={product._id || index}>
            <div className="p-2">
              <ProductCard {...product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrendingProducts;
