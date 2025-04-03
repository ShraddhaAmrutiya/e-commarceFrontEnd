

import { FC, FormEvent, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { doLogin, updateModal } from "../redux/features/authSlice";
import { FaUnlock } from "react-icons/fa";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

const LoginModal: FC = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.authReducer.modalOpen);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(doLogin({ userName, password }));
  };

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
        <form onSubmit={submitForm} className="flex flex-col space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Your username here... (atuny0)"
              className="border w-full py-2 px-8 rounded"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
            />
            <RiUser3Fill className="absolute top-3 left-2 text-lg" />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Your password here... (9uQFF1Lh)"
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
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
