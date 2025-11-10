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
    title: "✨ Welcome to Aaraksha Resin Art ✨",
    subtitle: "Discover timeless resin creations – customized, elegant, and made with love. Each piece tells a story.",
    gradient: "from-resin-500 via-gold-400 to-ocean-500",
  },
  {
    id: 2,
    image: "/banner.png",
    title: "Handcrafted Resin Art Pieces - Custom, Timeless & Stunning",
    subtitle: "From photo frames to keychains – starting at ₹149. Preserve your memories in beautiful art.",
    gradient: "from-ocean-500 via-resin-400 to-gold-500",
  },
  {
    id: 3,
    image: "/mahakumbh.jpg",
    title: "🪔 Bulk Mahakumbh Coasters",
    subtitle:
      "Celebrate the divine Mahakumbh with our exclusive resin coasters. Perfect for gifts, souvenirs, and events. Contact us for custom bulk orders.",
    gradient: "from-indigo-600 via-blue-500 to-cyan-400",
  },
  {
    id: 4,
    image: "/gbkeychains.jpg",
    title: "🔑 250 GB Keychains – Bulk Order!",
    subtitle:
      "We handle large-scale resin keychain orders for corporate gifts, branding, and events. Custom logos, designs, and packaging available for bulk quantities.",
    gradient: "from-blue-600 via-sky-500 to-cyan-400",
  },
];

const SlidingBanner: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full py-6 md:py-10 relative overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        navigation={false}
        className="w-full relative z-10"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 bg-gradient-to-r ${slide.gradient} rounded-3xl shadow-resin p-6 lg:p-10 text-white mx-4 lg:mx-16 relative overflow-hidden`}
              style={{ minHeight: "320px" }}
            >
              {/* Image */}
              <div className="relative z-20 group animate-fadeInLeft flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72">
                <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/50 transition-all duration-500 bg-white/10">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Text */}
              <div
                className="text-center lg:text-left max-w-xl animate-fadeInRight z-20"
                style={{ animationDelay: `${index * 0.2 + 0.3}s` }}
              >
                <h2 className="text-3xl lg:text-4xl font-playfair font-bold mb-3 leading-tight">{slide.title}</h2>

                {/* Subtitle hidden on mobile */}
                <p className="hidden sm:block text-base lg:text-lg mb-4 leading-relaxed">{slide.subtitle}</p>

                <button
                  onClick={() => navigate("/products")}
                  className="px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold rounded-full
                             bg-gradient-to-r from-gold-400 via-yellow-300 to-gold-500
                             text-black shadow-[0_0_22px_rgba(255,215,0,0.6)]
                             transition-all duration-500 hover:scale-110 hover:shadow-[0_0_32px_rgba(255,215,0,0.9)]
                             animate-pulse"
                >
                  ✨ Explore more collection ✨
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlidingBanner;
