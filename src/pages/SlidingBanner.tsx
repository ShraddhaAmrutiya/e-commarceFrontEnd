import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    image: "/logo1.jpg",
    title: "✨ Welcome to Aaraksha Resin Art",
    subtitle:
      "Discover timeless resin creations – customized, elegant, and made with love. Each piece tells a story.",
    gradient: "from-resin-500 via-gold-400 to-ocean-500",
  },

  {
    id: 2,
    image: "/banner.png",
    title: " Handcrafted Resin Art Pieces",
    subtitle:
      "From photo frames to keychains – starting at ₹149. Preserve your memories in beautiful art.",
    gradient: "from-ocean-500 via-resin-400 to-gold-500",
  },
  {
    id: 3,
    image: "/mahakumbh.jpg",
    title: "🪔 Mahakumbh 2025 Coasters – Bulk Orders Accepted!",
    subtitle:
      "Celebrate the divine Mahakumbh with our exclusive resin coasters. Perfect for gifts, souvenirs, and events. Contact us for custom bulk orders.",
    gradient: "from-indigo-600 via-blue-500 to-cyan-400",
  },
  {
  id: 4,
  image: "/gbkeychains.jpg", 
  title: "🔑 250 GB Enterprise Keychains – Bulk Order Completed!",
  subtitle:
    "We handle large-scale resin keychain orders for corporate gifts, branding, and events. Custom logos, designs, and packaging available for bulk quantities.",
  gradient: "from-blue-600 via-sky-500 to-cyan-400",
},

];

const SlidingBanner: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full py-8 md:py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pearl-50 via-resin-50 to-ocean-50 pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-resin-200/30 rounded-full animate-float pointer-events-none"></div>
      <div
        className="absolute bottom-10 right-10 w-32 h-32 bg-gold-200/30 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-ocean-200/30 rounded-full animate-float"
        style={{ animationDelay: "4s" }}
      />

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        // Allow clicks inside slides (important for buttons)
        preventClicks={false}
        preventClicksPropagation={false}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-resin-400 !opacity-50",
          bulletActiveClass:
            "swiper-pagination-bullet-active !bg-resin-600 !opacity-100",
        }}
        navigation={false}
        className="w-full relative z-10"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 bg-gradient-to-r ${slide.gradient} rounded-3xl shadow-resin p-8 lg:p-12 text-white mx-4 lg:mx-16 min-h-[500px] relative overflow-hidden`}
            >
              {/* Decorative overlay (non-interactive) */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white/30 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 border-2 border-white/30 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/20 rounded-full"></div>
              </div>

              {/* Image - above overlays */}
              <div
                className="relative z-20 group animate-fadeInLeft"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white/50 group-hover:border-white transition-all duration-500">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold-300 rounded-full animate-bounce-slow pointer-events-none"></div>
                <div
                  className="absolute -bottom-2 -left-2 w-3 h-3 bg-resin-300 rounded-full animate-bounce-slow"
                  style={{ animationDelay: "1s" }}
                />
              </div>

              {/* Text and buttons - ensure they are clickable (z-20 or z-30) */}
              <div
                className="text-center lg:text-left max-w-2xl animate-fadeInRight z-20"
                style={{ animationDelay: `${index * 0.2 + 0.3}s` }}
              >
                <h2 className="text-4xl lg:text-6xl xl:text-7xl font-playfair font-bold mb-4 drop-shadow-2xl leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg lg:text-xl xl:text-2xl drop-shadow-lg mb-6 leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {/* Use type="button", set z-index and pointer-events */}
                  <button
                    type="button"
                    onClick={() => {
                      // small debug log to ensure click is fired
                      console.log("Explore Collection clicked");
                      navigate("/products");
                    }}
                    className="btn-resin px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-gold transition-all duration-300 hover:scale-105 z-30 pointer-events-auto"
                    aria-label="Explore Collection"
                  >
                    Explore Collection
                  </button>

                  {/* <button
                    type="button"
                    onClick={() => console.log("Custom Order clicked")}
                    className="bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105 z-20 pointer-events-auto"
                  >
                    Custom Order
                  </button> */}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlidingBanner;
