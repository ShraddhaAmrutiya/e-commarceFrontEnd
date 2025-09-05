// import { FC, useEffect, useRef, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import {
//   MdOutlineAccountCircle,
//   MdOutlineLogout,
// } from "react-icons/md";
// import { doLogout } from "../redux/features/authSlice";
// import { resetCartItems } from "../redux/features/cartSlice";  
// import { resetWishlistItems } from "../redux/features/WishlistSlice";  
// import { Link, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const CustomPopup: FC = () => {
//   const { t } = useTranslation();
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const [isVisible, setVisible] = useState(false);
//   const userName = useAppSelector((state) => state.authReducer.userName);
//   const popupRef = useRef<HTMLDivElement>(null);

//   const handlePopup = () => {
//     setVisible((v) => !v);
//   };

//   const handleLogout = () => {
//     dispatch(doLogout()); 
//     dispatch(resetCartItems()); 
//     dispatch(resetWishlistItems());  
//     navigate("/");  
//     hidePopup();  
//   };
//   const hidePopup = () => {
//     setVisible(false);
//   };

//   // Outside click handling
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
//         hidePopup();
//       }
//     };

//     if (isVisible) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     // Cleanup
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isVisible]);

//   return (
//     <div className="relative font-karla" ref={popupRef}>
//       <div
//         className="inline-block cursor-pointer hover:opacity-85 dark:text-white"
//         onClick={handlePopup}
//         data-test="userName-popup"
//       >
//         {userName}
//       </div>
//       {isVisible && (
//         <div
//           className="absolute p-4 left-[-50px] w-40 z-50 mt-2 rounded-md shadow-2xl bg-white ring-1 transition-all ring-black ring-opacity-5 focus:outline-none dark:bg-slate-600 dark:text-white"
//           data-test="popup-content-list"
//         >
//           <table>
//             <tbody>
//               <tr>
//                 <td className="text-center">
//                   <MdOutlineAccountCircle />
//                 </td>
//                 <td className="hover:underline cursor-pointer text-lg pl-2">
//                   <Link to="/account" onClick={hidePopup}>
//                     {t("account")}
//                   </Link>
//                 </td>
//               </tr>
//               <tr>
//                 <td className="text-center">🧾</td>
//                 <td className="hover:underline cursor-pointer text-lg pl-2">
//                   <Link to="/orders" onClick={hidePopup}>
//                     {t("ordersCommon")}
//                   </Link>
//                 </td>
//               </tr>
//               <tr>
//                 <td className="text-center">
//                   <MdOutlineLogout />
//                 </td>
//                 <td
//                   className="hover:underline cursor-pointer text-lg pl-2"
//                   onClick={handleLogout}
//                   data-test="logout-btn"
//                 >
//                   {t("logout")}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomPopup;

import { FC, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  MdOutlineAccountCircle,
  MdOutlineLogout,
} from "react-icons/md";
import { doLogout } from "../redux/features/authSlice";
import { resetCartItems } from "../redux/features/cartSlice";
import { resetWishlistItems } from "../redux/features/WishlistSlice";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CustomPopup: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isVisible, setVisible] = useState(false);
  const userName = useAppSelector((state) => state.authReducer.userName);
  const popupRef = useRef<HTMLDivElement>(null);

  const handlePopup = () => setVisible((v) => !v);
  const hidePopup = () => setVisible(false);

  const handleLogout = () => {
    dispatch(doLogout());
    dispatch(resetCartItems());
    dispatch(resetWishlistItems());
    navigate("/");
    hidePopup();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        hidePopup();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="relative font-karla" ref={popupRef}>
      <div
        className="inline-block cursor-pointer hover:opacity-85 dark:text-white text-sm sm:text-base"
        onClick={handlePopup}
        data-test="userName-popup"
      >
        {userName}
      </div>

      {isVisible && (
        <div
          className="absolute right-0 sm:left-auto w-48 sm:w-56 z-50 mt-2 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-600 dark:text-white transition-all"
          data-test="popup-content-list"
        >
          <ul className="divide-y divide-gray-200 dark:divide-slate-500">
            <li className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              <MdOutlineAccountCircle className="text-xl" />
              <Link
                to="/account"
                onClick={hidePopup}
                className="ml-2 text-sm sm:text-base hover:underline"
              >
                {t("account")}
              </Link>
            </li>
            <li className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              <span role="img" aria-label="orders" className="text-xl">
                🧾
              </span>
              <Link
                to="/orders"
                onClick={hidePopup}
                className="ml-2 text-sm sm:text-base hover:underline"
              >
                {t("ordersCommon")}
              </Link>
            </li>
            <li
              className="flex items-center p-3 hover:bg-red-50 dark:hover:bg-red-800 transition cursor-pointer"
              onClick={handleLogout}
              data-test="logout-btn"
            >
              <MdOutlineLogout className="text-xl text-red-500" />
              <span className="ml-2 text-sm sm:text-base text-red-600 dark:text-red-400 hover:underline">
                {t("logout")}
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomPopup;
