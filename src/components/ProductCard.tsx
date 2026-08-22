import { FC, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "../models/Product";
import { Link } from "react-router-dom";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";
import { MdMailOutline } from "react-icons/md";
import { formatProductName } from "../utils/formatters";
import EnquiryModal from "./EnquiryModal";

const ProductCard: FC<Product> = (product) => {
  const { _id, images, title } = product;
  const { t } = useTranslation();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const imageUrl =
    Array.isArray(images) && images[0] ? (images[0].startsWith("http") ? images[0] : `${BASE_URL}${images[0]}`) : null;

  const handleEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEnquiryOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <Link to={`/products/${_id}`} className="block h-full group">
        <div className="relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-zinc-200 dark:hover:shadow-black/50 transition-all duration-500 border border-zinc-100 dark:border-zinc-700 font-inter cursor-pointer h-full flex flex-col">
          {/* Product Image Container */}
          <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-900 aspect-[4/5] sm:aspect-square flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                <p className="text-zinc-400 font-medium">{t("noImageAvailable")}</p>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Product Details */}
          <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-4">
            {/* Title */}
            <h3
              className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg line-clamp-2 leading-tight tracking-tight group-hover:text-resin-600 dark:group-hover:text-resin-400 transition-colors duration-300"
              title={title}
            >
              {formatProductName(title)}
            </h3>

            {/* Bottom Section (Action) */}
            <div className="flex items-end justify-end gap-3 mt-auto">
              {/* Get Enquiry Button */}
              <button
                onClick={handleEnquiry}
                className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-500 transition-all duration-300 active:scale-90 shadow-sm"
                aria-label="Get enquiry"
              >
                <MdMailOutline size={18} />
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        productName={title}
        productImage={imageUrl || undefined}
      />
    </motion.div>
  );
};

export default ProductCard;

