
import { FC, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  MdOutlineAccountCircle,
  MdOutlineLogout,
} from "react-icons/md";
import { doLogout } from "../redux/features/authSlice";
import { Link } from "react-router-dom";

const CustomPopup: FC = () => {
  const dispatch = useAppDispatch();
  const [isVisible, setVisible] = useState(false);
  const userName = useAppSelector((state) => state.authReducer.userName);
  const popupRef = useRef<HTMLDivElement>(null);

  const handlePopup = () => {
    setVisible((v) => !v);
  };

  const handleLogout = () => {
    dispatch(doLogout());
    hidePopup();
  };

  const hidePopup = () => {
    setVisible(false);
  };

  // Outside click handling
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

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="relative font-karla" ref={popupRef}>
      <div
        className="inline-block cursor-pointer hover:opacity-85 dark:text-white"
        onClick={handlePopup}
        data-test="userName-popup"
      >
        {userName}
      </div>
      {isVisible && (
        <div
          className="absolute p-4 left-[-50px] w-40 z-50 mt-2 rounded-md shadow-2xl bg-white ring-1 transition-all ring-black ring-opacity-5 focus:outline-none dark:bg-slate-600 dark:text-white"
          data-test="popup-content-list"
        >
          <table>
            <tbody>
              <tr>
                <td className="text-center">
                  <MdOutlineAccountCircle />
                </td>
                <td className="hover:underline cursor-pointer text-lg pl-2">
                  <Link to="/account" onClick={hidePopup}>
                    Account
                  </Link>
                </td>
              </tr>
              <tr>
    <td className="text-center">🧾</td>
    <td className="hover:underline cursor-pointer text-lg pl-2">
      <Link to="/orders" onClick={hidePopup}>
        Orders
      </Link>
    </td>
  </tr>
              <tr>
                <td className="text-center">
                  <MdOutlineLogout />
                </td>
                <td
                  className="hover:underline cursor-pointer text-lg pl-2"
                  onClick={handleLogout}
                  data-test="logout-btn"
                >
                  Logout
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomPopup;
