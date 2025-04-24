

// import { FC, FormEvent, useEffect, useState } from "react";
// import { useAppSelector, useAppDispatch } from "../redux/hooks";
// import { doLogin, updateModal } from "../redux/features/authSlice";
// import { FaUnlock } from "react-icons/fa";
// import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
// import { RxCross1 } from "react-icons/rx";

// const LoginModal: FC = () => {
//   const [userName, setuserName] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useAppDispatch();
//   const open = useAppSelector((state) => state.authReducer.modalOpen);
//   const userId = useAppSelector((state) => state.authReducer.userId);

//   const submitForm = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     dispatch(doLogin({ userName, password }));
//   };

//   useEffect(() => {
//     if (userId) {
//       dispatch(updateModal(false));
//       setuserName("");
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
//         />
//         <h3 className="font-bold text-center text-2xl flex justify-center items-center gap-2">
//           <FaUnlock />
//           Login
//           <FaUnlock />
//         </h3>
//         <form onSubmit={submitForm} className="flex flex-col space-y-3">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Add your userName here..."
//               className="border w-full py-2 px-8 rounded"
//               value={userName}
//               onChange={(e) => setuserName(e.target.value)}
//             />
//             <RiUser3Fill className="absolute top-3 left-2 text-lg" />
//           </div>
//           <div className="relative">
//             <input
//               type="password"
//               placeholder="Add your password here..."
//               className="border w-full py-2 px-8 rounded"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
//           </div>
//           <input    
//             type="submit"
//             value="Submit"
//             className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
//           />
//         </form>
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

const LoginModal: FC = () => {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");  // State for Forgot Password
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Manage Forgot Password modal view
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.authReducer.modalOpen);
  const userId = useAppSelector((state) => state.authReducer.userId);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(doLogin({ userName, password }));
  };

  const submitForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        const errorData = await response.text(); 
        try {
          const jsonData = JSON.parse(errorData); 
          alert(jsonData.message || "Something went wrong.");
        } catch (error) {
          alert(errorData);
        }
        return;
      }
  
      const data = await response.json();
      if (data.message === "Reset token sent to email.") {
        toast.success("Password reset email sent!");
        setIsForgotPassword(false); 
      } else {
        alert(data.message);  
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };
  
  
  useEffect(() => {
    if (userId) {
      dispatch(updateModal(false));
      setuserName("");
      setPassword("");
    }
  }, [userId, dispatch]);

  if (!open) return null;

  return (
    <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-30 flex items-center justify-center">
      <div className="relative border shadow rounded p-8 bg-white max-w-md w-full">
        <RxCross1
          className="absolute cursor-pointer right-5 top-5 hover:opacity-85"
          onClick={() => dispatch(updateModal(false))}
        />
        <h3 className="font-bold text-center text-2xl flex justify-center items-center gap-2">
          <FaUnlock />
          Login
          <FaUnlock />
        </h3>

        {/* Login Form */}
        {!isForgotPassword ? (
          <form onSubmit={submitForm} className="flex flex-col space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Add your userName here..."
                className="border w-full py-2 px-8 rounded"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
              />
              <RiUser3Fill className="absolute top-3 left-2 text-lg" />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Add your password here..."
                className="border w-full py-2 px-8 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
            </div>
            <input
              type="submit"
              value="Submit"
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-blue-500 text-sm text-center mt-2"
            >
              Forgot Password?
            </button>
          </form>
        ) : (
          // Forgot Password Form
          <form onSubmit={submitForgotPassword} className="flex flex-col space-y-3">
            <h4 className="font-semibold text-center text-lg mb-4">
              Reset Password
            </h4>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                className="border w-full py-2 px-8 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input
              type="submit"
              value="Send Reset Email"
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="text-red-500 text-sm text-center mt-2"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
