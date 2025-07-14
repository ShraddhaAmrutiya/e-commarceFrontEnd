
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    image: "/public/emptyCart.jpg",
    title: "🎨 Embrace the World of Fine Art",
    subtitle: "Exclusive hand-painted pieces now available.",
  },
  {
    id: 2,
    image: "/assets/banner2.jpg",
    title: "🖌️ Abstract Expression Reimagined",
    subtitle: "Modern art for modern homes. 30% off today.",
  },
  {
    id: 3,
    image: "/assets/banner3.jpg",
    title: "🖼️ Canvas Prints for Every Space",
    subtitle: "Timeless beauty. Affordable art starts at $19.",
  },
];

const SlidingBanner: FC = () => {
  return (
    <div className="w-full py-6 md:py-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        navigation={false}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 bg-gradient-to-r from-pink-500 via-orange-400 to-purple-600 rounded-2xl shadow-xl p-6 md:p-10 text-white mx-4 md:mx-16 h-96">
              
              {/* Image - Slightly bigger and circular */}
              <div className="w-56 h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text - Centered and bold */}
              <div className="text-center md:text-left max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-md">{slide.title}</h2>
                <p className="text-lg md:text-xl drop-shadow-sm">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlidingBanner;
