// import React, { useState, useEffect } from "react";
// import { IoIosArrowUp } from "react-icons/io";

// const ScrollToTopButton: React.FC = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   const toggleVisibility = () => {
//     if (window.scrollY > 300) {
//       setIsVisible(true);
//     } else {
//       setIsVisible(false);
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", toggleVisibility);
//     return () => window.removeEventListener("scroll", toggleVisibility);
//   }, []);

//   return (
//     <div className="fixed bottom-10 right-8 z-50">
//       {isVisible && (
//         <button
//           onClick={scrollToTop}
//           className="bg-gray-800 dark:bg-white text-white dark:text-slate-800 rounded-full h-10 w-10 shadow-md hover:bg-gray-700 transition-opacity duration-300 opacity-50 hover:opacity-100"
//         >
//           <IoIosArrowUp size={30} className="m-auto" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default ScrollToTopButton;


import React, { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="group bg-resin-gradient text-white rounded-full h-14 w-14 shadow-resin hover:shadow-gold transition-all duration-300 opacity-90 hover:opacity-100 flex items-center justify-center hover:scale-110 animate-fadeInUp"
        >
          <IoIosArrowUp size={28} className="group-hover:animate-bounce" />
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-resin-gradient opacity-0 group-hover:opacity-30 animate-ping"></div>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
