import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    image: "/logo1.jpg",
    title: "Timeless Resin Creations",
    subtitle: "Discover customized, elegant pieces made with love. Each creation tells your unique story.",
  },
  {
    id: 2,
    image: "/banner.png",
    title: "Handcrafted Artistry",
    subtitle: "Preserve your memories in beautiful, handcrafted resin art. From photo frames to bespoke keychains.",
  },
  {
    id: 3,
    image: "/mahakumbh.jpg",
    title: "Exclusive Coasters",
    subtitle: "Celebrate the divine with our exclusive resin coasters. Perfect for premium gifting and souvenirs.",
  },
  {
    id: 4,
    image: "/gbkeychains.jpg",
    title: "Corporate Gifting",
    subtitle: "Elegant, large-scale resin keychain orders for corporate events. Custom logos and premium packaging available.",
  },
];

const SlidingBanner: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-900 pt-24 pb-12 sm:pt-32 sm:pb-16 font-inter">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        pagination={{ 
          clickable: true,
          renderBullet: function (_index, className) {
            return `<span class="${className} w-3 h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-all duration-300 mx-1"></span>`;
          }
        }}
        navigation={false}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="pb-12">
            {({ isActive }) => (
              <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left z-20">
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold text-zinc-900 dark:text-white leading-tight tracking-tight mb-6"
                  >
                    {slide.title}
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed"
                  >
                    {slide.subtitle}
                  </motion.p>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    onClick={() => navigate("/products")}
                    className="group relative px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-full overflow-hidden transition-transform duration-300 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Explore Collection
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </span>
                    <div className="absolute inset-0 bg-resin-600 dark:bg-resin-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out"></div>
                  </motion.button>
                </div>

                {/* Image Content */}
                <div className="flex-1 w-full max-w-lg lg:max-w-xl relative">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1 }}
                    className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-3xl shadow-2xl"
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                  </motion.div>
                  
                  {/* Decorative Element */}
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-resin-100 dark:bg-resin-900/30 rounded-full blur-2xl -z-10"></div>
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-gold-100 dark:bg-gold-900/20 rounded-full blur-3xl -z-10"></div>
                </div>
                
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlidingBanner;
