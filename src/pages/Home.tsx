import { FC, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import SlidingBanner from "./SlidingBanner";
import TrendingProducts from "../components/TrendingProducts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import BASE_URL from "../config/apiconfig";
import { updateNewList, updateFeaturedList } from "../redux/features/productSlice";
import { Product } from "../models/Product";

interface Category {
  category: string;
  products: Product[];
}

interface GoogleReview {
  _id: string;
  reviewId: string;
  placeId: string;
  businessName: string;
  reviewerName: string;
  rating: number;
  text: string;
  reviewUrl: string;
  businessUrl: string;
  lastSyncedAt: string;
}

const GOOGLE_BUSINESS_URL = "https://share.google/zVsWuubvu3dGUWGbM";

const INSTAGRAM_URL = "https://www.instagram.com/aaraksha_resin__art";

const WHATSAPP_URL = "https://wa.me/919033094705";

const Home: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [currentReview, setCurrentReview] = useState(0);

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products/all`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const { categories } = await response.json();

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
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  // ============================================================
  // FETCH GOOGLE REVIEWS
  // ============================================================

  useEffect(() => {
    const fetchGoogleReviews = async () => {
      try {
        const response = await fetch("https://e-commerce-website-sfiy.onrender.com/google-reviews/");

        if (!response.ok) {
          throw new Error("Failed to fetch Google reviews");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.result)) {
          setReviews(data.result);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching Google reviews:", error);
        setReviews([]);
      }
    };

    fetchGoogleReviews();
  }, []);

  // ============================================================
  // CALCULATE GOOGLE RATING
  // ============================================================

  const averageRating = useMemo(() => {
    if (!reviews.length) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);

    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  // ============================================================
  // AUTO SLIDE
  // ============================================================

  useEffect(() => {
    if (reviews.length <= 3) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  // ============================================================
  // NEXT REVIEW
  // ============================================================

  const nextReview = () => {
    setCurrentReview((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1));
  };

  // ============================================================
  // PREVIOUS REVIEW
  // ============================================================

  const previousReview = () => {
    setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  // ============================================================
  // GET REVIEWER INITIAL
  // ============================================================

  const getInitial = (name: string) => {
    if (!name) {
      return "G";
    }

    return name.charAt(0).toUpperCase();
  };

  // ============================================================
  // RENDER STARS
  // ============================================================

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= rating ? "text-yellow-400" : "text-zinc-300 dark:text-zinc-600"}>
        ★
      </span>
    ));
  };

  // ============================================================
  // HOME
  // ============================================================

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="
        min-h-screen
        bg-gradient-to-b
        from-zinc-50
        via-white
        to-zinc-50
        dark:from-zinc-950
        dark:via-zinc-900
        dark:to-zinc-950
        font-inter
        selection:bg-resin-500
        selection:text-white
      "
    >
      {/* ============================================================
          HERO
      ============================================================ */}

      <SlidingBanner />

      {/* ============================================================
          WHY CHOOSE AARAKSHA
      ============================================================ */}

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="
          py-16
          sm:py-24
          px-4
          border-b
          border-zinc-200
          dark:border-zinc-800
        "
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-resin-50
                dark:bg-resin-900/20
                border
                border-resin-100
                dark:border-resin-800
                text-resin-700
                dark:text-resin-300
                text-sm
                font-semibold
                mb-5
              "
            >
              ✨ Crafted With Passion
            </span>

            <h2
              className="
                text-3xl
                sm:text-4xl
                md:text-5xl
                font-poppins
                font-bold
                text-zinc-900
                dark:text-zinc-100
                tracking-tight
              "
            >
              Why Choose{" "}
              <span
                className="
                  bg-gradient-to-r
                  from-resin-600
                  to-gold-500
                  bg-clip-text
                  text-transparent
                "
              >
                Aaraksha?
              </span>
            </h2>

            <p
              className="
                max-w-2xl
                mx-auto
                mt-5
                text-zinc-600
                dark:text-zinc-400
                leading-relaxed
              "
            >
              Beautifully handcrafted resin creations designed to turn your special moments, memories and emotions into
              something you can treasure forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FEATURE 1 */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="
                group
                p-8
                rounded-3xl
                bg-white
                dark:bg-zinc-800/50
                border
                border-zinc-100
                dark:border-zinc-700/50
                hover:border-resin-200
                dark:hover:border-resin-900/50
                hover:shadow-xl
                hover:shadow-resin-200/20
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-resin-50
                  dark:bg-resin-900/30
                  flex
                  items-center
                  justify-center
                  text-4xl
                  mb-6
                  group-hover:scale-110
                  transition-transform
                "
              >
                ✨
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Handcrafted With Love</h3>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every piece is carefully handmade with patience, creativity and attention to the smallest details.
              </p>
            </motion.div>

            {/* FEATURE 2 */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="
                group
                p-8
                rounded-3xl
                bg-white
                dark:bg-zinc-800/50
                border
                border-zinc-100
                dark:border-zinc-700/50
                hover:border-gold-200
                dark:hover:border-gold-900/50
                hover:shadow-xl
                hover:shadow-gold-200/20
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-gold-50
                  dark:bg-gold-900/30
                  flex
                  items-center
                  justify-center
                  text-4xl
                  mb-6
                  group-hover:scale-110
                  transition-transform
                "
              >
                🎁
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Made Just For You</h3>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Personalize your gifts with names, photographs, flowers, colors and designs that make every creation
                truly yours.
              </p>
            </motion.div>

            {/* FEATURE 3 */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="
                group
                p-8
                rounded-3xl
                bg-white
                dark:bg-zinc-800/50
                border
                border-zinc-100
                dark:border-zinc-700/50
                hover:border-emerald-200
                dark:hover:border-emerald-900/50
                hover:shadow-xl
                hover:shadow-emerald-200/20
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-emerald-50
                  dark:bg-emerald-900/30
                  flex
                  items-center
                  justify-center
                  text-4xl
                  mb-6
                  group-hover:scale-110
                  transition-transform
                "
              >
                ❤️
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Memories That Last</h3>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Premium-quality resin creations made to beautifully preserve your favourite memories for years to come.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================
          TRENDING PRODUCTS
      ============================================================ */}

      <div className="py-16 sm:py-24">
        <TrendingProducts />
      </div>

      {/* ============================================================
          EXPLORE BUTTON
      ============================================================ */}

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="flex justify-center my-12 sm:my-20 px-4"
      >
        <div className="relative group">
          <div
            className="
              absolute
              -inset-1
              bg-gradient-to-r
              from-resin-500
              to-gold-500
              rounded-full
              blur
              opacity-30
              group-hover:opacity-60
              transition
              duration-500
            "
          />

          <button
            onClick={() => navigate("/products")}
            className="
              relative
              px-8
              sm:px-12
              py-5
              sm:py-6
              bg-gradient-to-r
              from-resin-600
              to-resin-700
              hover:from-resin-700
              hover:to-resin-800
              text-white
              text-base
              sm:text-lg
              font-semibold
              rounded-full
              shadow-xl
              transition-all
              duration-300
              hover:scale-105
              active:scale-95
              flex
              items-center
              gap-3
              border
              border-resin-500/50
            "
          >
            Explore Our Collection
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* ============================================================
          GOOGLE REVIEWS
      ============================================================ */}

      {reviews.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="
            py-20
            sm:py-28
            px-4
            bg-gradient-to-b
            from-white
            via-resin-50/30
            to-white
            dark:from-zinc-950
            dark:via-zinc-900
            dark:to-zinc-950
            border-y
            border-zinc-200
            dark:border-zinc-800
          "
        >
          <div className="max-w-7xl mx-auto">
            {/* HEADER */}

            <div className="text-center mb-14">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  mb-5
                  rounded-full
                  bg-white
                  dark:bg-zinc-800
                  border
                  border-zinc-200
                  dark:border-zinc-700
                  shadow-sm
                "
              >
                <span className="text-xl">⭐</span>

                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Loved By Our Customers</span>
              </div>

              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  font-poppins
                  font-bold
                  text-zinc-900
                  dark:text-white
                  tracking-tight
                "
              >
                Real Stories.{" "}
                <span
                  className="
                    bg-gradient-to-r
                    from-resin-600
                    to-gold-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  Real Smiles.
                </span>
              </h2>

              <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                See what our customers have to say about their experience with Aaraksha Resin Art.
              </p>

              {/* RATING */}

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-7">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-white">{averageRating.toFixed(1)}</span>

                  <div className="flex text-yellow-400 text-xl">{renderStars(Math.round(averageRating))}</div>
                </div>

                <span className="hidden sm:block text-zinc-300">|</span>

                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Based on {reviews.length} Google {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>

              {/* GOOGLE BUTTON */}

              <motion.a
                href={GOOGLE_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="
                  inline-flex
                  items-center
                  gap-2
                  mt-7
                  px-6
                  py-3
                  rounded-full
                  bg-white
                  dark:bg-zinc-800
                  border
                  border-zinc-200
                  dark:border-zinc-700
                  shadow-md
                  text-sm
                  font-semibold
                  text-zinc-800
                  dark:text-white
                  hover:border-blue-400
                  hover:shadow-lg
                  transition-all
                "
              >
                <span className="text-lg">G</span>
                View Aaraksha on Google
                <span>→</span>
              </motion.a>
            </div>

            {/* REVIEW CAROUSEL */}

            <div className="relative">
              {reviews.length > 1 && (
                <button
                  onClick={previousReview}
                  className="
                    absolute
                    left-0
                    top-1/2
                    -translate-y-1/2
                    -translate-x-2
                    sm:-translate-x-5
                    z-20
                    w-11
                    h-11
                    rounded-full
                    bg-white
                    dark:bg-zinc-800
                    border
                    border-zinc-200
                    dark:border-zinc-700
                    shadow-lg
                    flex
                    items-center
                    justify-center
                    text-zinc-700
                    dark:text-white
                    hover:scale-110
                    hover:border-resin-400
                    transition-all
                  "
                  aria-label="Previous review"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div className="overflow-hidden px-2 sm:px-5">
                <motion.div
                  className="flex"
                  animate={{
                    x: `-${currentReview * 33.333333}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                >
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="
                        w-full
                        md:w-1/2
                        lg:w-1/3
                        flex-shrink-0
                        px-3
                      "
                    >
                      <motion.div
                        whileHover={{
                          y: -8,
                          scale: 1.01,
                        }}
                        className="
                          h-full
                          min-h-[330px]
                          p-7
                          rounded-3xl
                          bg-white
                          dark:bg-zinc-800
                          border
                          border-zinc-200
                          dark:border-zinc-700
                          shadow-sm
                          hover:shadow-2xl
                          hover:shadow-resin-500/10
                          transition-all
                          duration-300
                          relative
                          overflow-hidden
                        "
                      >
                        {/* DECORATION */}

                        <div
                          className="
                            absolute
                            -top-20
                            -right-20
                            w-40
                            h-40
                            rounded-full
                            bg-gradient-to-br
                            from-resin-400/10
                            to-gold-400/10
                            blur-2xl
                          "
                        />

                        <div
                          className="
                            absolute
                            top-2
                            right-5
                            text-8xl
                            font-serif
                            text-resin-100
                            dark:text-zinc-700
                            select-none
                          "
                        >
                          "
                        </div>

                        {/* USER */}

                        <div className="flex items-center gap-4 mb-5 relative z-10">
                          <div
                            className="
                              w-12
                              h-12
                              rounded-full
                              bg-gradient-to-br
                              from-resin-500
                              to-gold-500
                              flex
                              items-center
                              justify-center
                              text-white
                              font-bold
                              text-lg
                              shadow-md
                              flex-shrink-0
                            "
                          >
                            {getInitial(review.reviewerName)}
                          </div>

                          <div className="min-w-0">
                            <h3
                              className="
                                font-bold
                                text-zinc-900
                                dark:text-white
                                truncate
                              "
                            >
                              {review.reviewerName || "Google Customer"}
                            </h3>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">Google Review</span>

                              <span
                                className="
                                  w-4
                                  h-4
                                  rounded-full
                                  bg-blue-500
                                  text-white
                                  text-[10px]
                                  flex
                                  items-center
                                  justify-center
                                  font-bold
                                "
                              >
                                ✓
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* STARS */}

                        <div className="flex items-center gap-1 mb-5 text-xl">{renderStars(review.rating)}</div>

                        {/* TEXT */}

                        <p
                          className="
                            text-zinc-600
                            dark:text-zinc-300
                            leading-relaxed
                            text-sm
                            sm:text-base
                            line-clamp-5
                            min-h-[120px]
                          "
                        >
                          {review.text || "Amazing experience with Aaraksha Resin Art!"}
                        </p>

                        {/* FOOTER */}

                        <div
                          className="
                            mt-6
                            pt-4
                            border-t
                            border-zinc-100
                            dark:border-zinc-700
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >
                          <span className="text-xs text-zinc-400">Verified Google review</span>

                          {review.reviewUrl && (
                            <a
                              href={review.reviewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                text-sm
                                font-semibold
                                text-resin-600
                                dark:text-resin-400
                                hover:text-resin-800
                                dark:hover:text-resin-300
                                transition
                                whitespace-nowrap
                              "
                            >
                              Read on Google →
                            </a>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {reviews.length > 1 && (
                <button
                  onClick={nextReview}
                  className="
                    absolute
                    right-0
                    top-1/2
                    -translate-y-1/2
                    translate-x-2
                    sm:translate-x-5
                    z-20
                    w-11
                    h-11
                    rounded-full
                    bg-white
                    dark:bg-zinc-800
                    border
                    border-zinc-200
                    dark:border-zinc-700
                    shadow-lg
                    flex
                    items-center
                    justify-center
                    text-zinc-700
                    dark:text-white
                    hover:scale-110
                    hover:border-resin-400
                    transition-all
                  "
                  aria-label="Next review"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* ============================================================
          ABOUT AARAKSHA
      ============================================================ */}

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="
          py-20
          sm:py-28
          px-4
          border-y
          border-zinc-200
          dark:border-zinc-800
          bg-gradient-to-r
          from-resin-50/50
          to-gold-50/50
          dark:from-zinc-900/50
          dark:to-zinc-900/50
        "
      >
        <div className="max-w-5xl mx-auto">
          {/* ABOUT HEADER */}

          <div className="text-center mb-14">
            <span
              className="
                inline-flex
                items-center
                px-4
                py-2
                rounded-full
                bg-white
                dark:bg-zinc-800
                border
                border-zinc-200
                dark:border-zinc-700
                text-sm
                font-semibold
                text-zinc-600
                dark:text-zinc-300
                shadow-sm
              "
            >
              💖 Made To Make Memories
            </span>

            <h2
              className="
                mt-5
                text-3xl
                sm:text-4xl
                md:text-5xl
                font-poppins
                font-bold
                text-zinc-900
                dark:text-zinc-100
              "
            >
              The Story Behind{" "}
              <span
                className="
                  bg-gradient-to-r
                  from-resin-600
                  to-gold-500
                  bg-clip-text
                  text-transparent
                "
              >
                Aaraksha
              </span>
            </h2>
          </div>

          {/* STORY */}

          <div
            className="
              max-w-4xl
              mx-auto
              text-center
              text-zinc-700
              dark:text-zinc-300
              text-base
              sm:text-lg
              leading-relaxed
            "
          >
            <p>
              At <strong className="font-semibold text-zinc-900 dark:text-white">Aaraksha Resin Art</strong>, we turn
              ordinary moments into extraordinary keepsakes. From cherished photographs and flowers to personalized
              gifts and artistic creations, every piece is thoughtfully designed and handcrafted with love.
            </p>

            <p className="mt-6">
              Whether you're celebrating a birthday, anniversary, wedding, festival or simply want to preserve a
              beautiful memory, we're here to create something that feels uniquely yours.
            </p>
          </div>

          {/* COLLECTIONS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div
              className="
                p-8
                rounded-3xl
                bg-white
                dark:bg-zinc-800
                border
                border-zinc-200
                dark:border-zinc-700
                shadow-sm
              "
            >
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">✨ Our Creations</h3>

              <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-3">
                  <span className="text-resin-600">✓</span>
                  Photo Frames & Memory Displays
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-resin-600">✓</span>
                  Personalized Resin Keychains
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-resin-600">✓</span>
                  Flower-Preserved Resin Art
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-resin-600">✓</span>
                  Beautiful Resin Clocks
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-resin-600">✓</span>
                  Festival & Personalized Gifts
                </li>
              </ul>
            </div>

            <div
              className="
                p-8
                rounded-3xl
                bg-white
                dark:bg-zinc-800
                border
                border-zinc-200
                dark:border-zinc-700
                shadow-sm
              "
            >
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">💎 Why Customers Choose Us</h3>

              <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-3">
                  <span className="text-gold-600">✓</span>
                  Thoughtfully handcrafted designs
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-gold-600">✓</span>
                  Personalized & custom-made creations
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-gold-600">✓</span>
                  Premium-quality resin materials
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-gold-600">✓</span>
                  Carefully finished & beautifully packaged
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-gold-600">✓</span>
                  Personal customer support
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================
              CONTACT CARDS
          ======================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {/* WHATSAPP */}

            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="
                group
                relative
                overflow-hidden
                p-8
                rounded-3xl
                bg-white
                dark:bg-zinc-800
                border
                border-zinc-200
                dark:border-zinc-700
                hover:border-emerald-300
                dark:hover:border-emerald-700
                hover:shadow-xl
                hover:shadow-emerald-200/30
                dark:hover:shadow-emerald-900/20
                transition-all
                duration-300
              "
            >
              <div
                className="
                  absolute
                  -right-10
                  -top-10
                  w-28
                  h-28
                  rounded-full
                  bg-emerald-500/10
                  group-hover:scale-150
                  transition-transform
                  duration-500
                "
              />

              <div className="relative">
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform">💬</div>

                <h3 className="text-lg text-zinc-900 dark:text-white font-bold mb-2">Chat With Us</h3>

                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Have a custom idea in mind? Message us on WhatsApp and let's create something special together.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  +91 9033094705
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.a>

            {/* INSTAGRAM */}

            <motion.a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="
                group
                relative
                overflow-hidden
                p-8
                rounded-3xl
                bg-white
                dark:bg-zinc-800
                border
                border-zinc-200
                dark:border-zinc-700
                hover:border-pink-300
                dark:hover:border-pink-700
                hover:shadow-xl
                hover:shadow-pink-200/30
                dark:hover:shadow-pink-900/20
                transition-all
                duration-300
              "
            >
              <div
                className="
                  absolute
                  -right-10
                  -top-10
                  w-28
                  h-28
                  rounded-full
                  bg-pink-500/10
                  group-hover:scale-150
                  transition-transform
                  duration-500
                "
              />

              <div className="relative">
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform">📸</div>

                <h3 className="text-lg text-zinc-900 dark:text-white font-bold mb-2">Follow Our Journey</h3>

                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Discover our latest creations, behind-the-scenes work and beautiful resin art on Instagram.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold text-sm">
                  @aaraksha_resin__art
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.a>

            {/* GOOGLE */}

            <motion.a
              href={GOOGLE_BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="
                group
                relative
                overflow-hidden
                p-8
                rounded-3xl
                bg-white
                dark:bg-zinc-800
                border
                border-zinc-200
                dark:border-zinc-700
                hover:border-blue-300
                dark:hover:border-blue-700
                hover:shadow-xl
                hover:shadow-blue-200/30
                dark:hover:shadow-blue-900/20
                transition-all
                duration-300
              "
            >
              <div
                className="
                  absolute
                  -right-10
                  -top-10
                  w-28
                  h-28
                  rounded-full
                  bg-blue-500/10
                  group-hover:scale-150
                  transition-transform
                  duration-500
                "
              />

              <div className="relative">
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform">⭐</div>

                <h3 className="text-lg text-zinc-900 dark:text-white font-bold mb-2">Find Us on Google</h3>

                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Explore our Google Business Profile, discover what customers are saying and leave us a review.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  View Google Profile
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      {/* ============================================================
    PREMIUM COMPACT FOOTER
============================================================ */}

      <footer
        className="
    relative
    border-t
    border-zinc-200/80
    dark:border-zinc-800
    bg-gradient-to-r
    from-resin-50/70
    via-white
    to-gold-50/70
    dark:from-zinc-950
    dark:via-zinc-900
    dark:to-zinc-950
  "
      >
        {/* Subtle top glow */}
        <div
          className="
      absolute
      top-0
      left-1/2
      -translate-x-1/2
      w-40
      h-px
      bg-gradient-to-r
      from-transparent
      via-resin-400
      to-transparent
    "
        />

        <div className="max-w-7xl mx-auto px-4 py-7 sm:py-8">
          {/* Main Footer Row */}
          <div
            className="
        flex
        flex-col
        md:flex-row
        items-center
        justify-between
        gap-5
      "
          ></div>

          {/* Divider */}
          <div />

          {/* Bottom */}
          <div
            className="
        flex
        flex-col
        sm:flex-row
        items-center
        justify-between
        gap-2
        text-xs
        text-zinc-500
        dark:text-zinc-500
      "
          >
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Aaraksha Resin Art</span>. All rights
              reserved.
            </p>

            <p>
              Handcrafted with <span className="text-red-500">♥</span> in India 🇮🇳
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
