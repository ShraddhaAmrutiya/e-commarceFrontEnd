// import { FC, FormEvent, useEffect, useState } from "react";
// import { useAppSelector, useAppDispatch } from "../redux/hooks";
// import { doLogin, updateModal } from "../redux/features/authSlice";
// import { FaUnlock } from "react-icons/fa";
// import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
// import { RxCross1 } from "react-icons/rx";

// import { toast } from "react-toastify";
// import BASE_URL from "../config/apiconfig";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";

// const LoginModal: FC = () => {
//   const { t } = useTranslation();
// const navigate = useNavigate();

//   const [userName, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState(""); // Forgot Password email
//   const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle Forgot Password view
//   const [isSending, setIsSending] = useState(false); // Loading state

//   const dispatch = useAppDispatch();
//   const open = useAppSelector((state) => state.authReducer.modalOpen);
//   const userId = useAppSelector((state) => state.authReducer.userId);

//   const submitForm = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     dispatch(doLogin({ userName, password }));
//   };

//   const submitForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSending(true);

//     try {
//       const response = await fetch(`${BASE_URL}/users/forgot-password/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         toast.error(data.message || t("somethingWentWrong"));
//         return;
//       }

//       if (data.message === "Reset token sent to email.") {
//         toast.success(t("passwordResetEmailSent"));
//         setEmail("");
//         setIsForgotPassword(false);
//         setTimeout(() => {
//           dispatch(updateModal(false));
//         }, 3000);
//       } else {
//         toast.warning(data.message || t("unexpectedResponse"));
//       }
//     } catch (error) {
//       // console.error("Error:", error);
//       toast.error(t("somethingWentWrongTryAgain"));
//     } finally {
//       setIsSending(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       dispatch(updateModal(false));
//       setUserName("");
//       setPassword("");
//     }
//   }, [userId, dispatch]);

//   if (!open) return null;

//   return (
//     <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center">
//       <div className="relative border shadow rounded p-8 bg-white max-w-md w-full">
//         <RxCross1
//           className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
//           onClick={() => dispatch(updateModal(false))}
//           title={t("close")}
//         />
//         <h3 className="font-bold text-center text-2xl flex justify-center items-center gap-2 mb-4">
//           <FaUnlock />
//           {t("login.title")}
//           <FaUnlock /> 
//         </h3>

//         {/* Login Form */}
//         {!isForgotPassword ? (
//           <form onSubmit={submitForm} className="flex flex-col space-y-3">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder={t("enterUserName")}
//                 className="border w-full py-2 px-8 rounded"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 autoComplete="username"
//               />
//               <RiUser3Fill className="absolute top-3 left-2 text-lg" />
//             </div>
//             <div className="relative">
//               <input
//                 type="password"
//                 placeholder={t("enterPassword")}
//                 className="border w-full py-2 px-8 rounded"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 autoComplete="current-password"
//               />
//               <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
//             </div>
//             <input
//               type="submit"
//               value={t("submit")}
//               className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
//             />
//             <button
//               type="button"
//               onClick={() => setIsForgotPassword(true)}
//               className="text-blue-500 text-sm text-center mt-2"
//             >
//               {t("forgotPassword")}
//             </button>
//            <p className="text-center text-sm mt-4">
//   Don’t have an account?{" "}
//   <span
//     onClick={() => {
//       dispatch(updateModal(false));
//       navigate("/register");
//     }}
//     className="text-blue-600 underline cursor-pointer hover:text-blue-800"
//   >
//     Create one
//   </span>
// </p>

//           </form>
//         ) : (
//           // Forgot Password Form
//           <form onSubmit={submitForgotPassword} className="flex flex-col space-y-3">
//             <h4 className="font-semibold text-center text-lg mb-4">
//               {t("resetPassword")}
//             </h4>
//             <div className="relative">
//               <input
//                 type="email"
//                 placeholder={t("enterEmailAddress")}
//                 className="border w-full py-2 px-8 rounded"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <input
//               type="submit"
//               value={isSending ? t("sending") : t("sendResetEmail")}
//               disabled={isSending}
//               className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer disabled:opacity-50"
//             />
//             <button
//               type="button"
//               onClick={() => setIsForgotPassword(false)}
//               className="text-red-500 text-sm text-center mt-2"
//             >
//               {t("backToLogin")}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginModal;

import { FC, FormEvent, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { doLogin, updateModal } from "../redux/features/authSlice";
import { FaUnlock } from "react-icons/fa";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LoginModal: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.authReducer.modalOpen);
  const userId = useAppSelector((state) => state.authReducer.userId);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(doLogin({ userName, password }));
  };

  const submitForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch(`${BASE_URL}/users/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || t("somethingWentWrong"));
        return;
      }

      if (data.message === "Reset token sent to email.") {
        toast.success(t("passwordResetEmailSent"));
        setEmail("");
        setIsForgotPassword(false);
        setTimeout(() => dispatch(updateModal(false)), 3000);
      } else {
        toast.warning(data.message || t("unexpectedResponse"));
      }
    } catch (error) {
      toast.error(t("somethingWentWrongTryAgain"));
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(updateModal(false));
      setUserName("");
      setPassword("");
    }
  }, [userId, dispatch]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 overflow-y-auto">
      <div className="relative bg-white dark:bg-slate-800 text-black dark:text-white border shadow-md rounded w-full max-w-md sm:p-8 p-4 my-10">
        <RxCross1
          className="absolute cursor-pointer right-4 top-4 text-xl hover:opacity-75"
          onClick={() => dispatch(updateModal(false))}
          title={t("close")}
        />
        <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-2 mb-4">
          <FaUnlock />
          {t("login.title")}
          <FaUnlock />
        </h3>

        {/* Login Form */}
        {!isForgotPassword ? (
          <form onSubmit={submitForm} className="flex flex-col space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t("enterUserName")}
                className="w-full border rounded px-10 py-2 dark:bg-slate-700"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoComplete="username"
              />
              <RiUser3Fill className="absolute top-3 left-3 text-lg" />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder={t("enterPassword")}
                className="w-full border rounded px-10 py-2 dark:bg-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <RiLockPasswordFill className="absolute top-3 left-3 text-lg" />
            </div>
            <input
              type="submit"
              value={t("submit")}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded cursor-pointer transition"
            />
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-sm text-blue-600 hover:underline text-center"
            >
              {t("forgotPassword")}
            </button>

            <p className="text-center text-sm mt-2">
              {t("dontHaveAccount")}{" "}
              <span
                onClick={() => {
                  dispatch(updateModal(false));
                  navigate("/register");
                }}
                className="text-blue-600 underline cursor-pointer hover:text-blue-800"
              >
                {t("createAccount")}
              </span>
            </p>
          </form>
        ) : (
          // Forgot Password Form
          <form
            onSubmit={submitForgotPassword}
            className="flex flex-col space-y-4"
          >
            <h4 className="text-lg font-semibold text-center mb-2">
              {t("resetPassword")}
            </h4>
            <div className="relative">
              <input
                type="email"
                placeholder={t("enterEmailAddress")}
                className="w-full border rounded px-4 py-2 dark:bg-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input
              type="submit"
              value={isSending ? t("sending") : t("sendResetEmail")}
              disabled={isSending}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded cursor-pointer transition disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="text-sm text-red-600 hover:underline text-center"
            >
              {t("backToLogin")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
