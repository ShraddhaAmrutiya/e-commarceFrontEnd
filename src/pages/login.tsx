import { FC, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { doLogin } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import { FaUnlock } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Login: FC = () => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userId, isLoggedIn } = useAppSelector((state) => state.authReducer);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const result = await dispatch(doLogin({ userName, password }));
    if (doLogin.rejected.match(result)) {
      setError(result.payload as string || t("login.loginFailed"));
    }
  };

  useEffect(() => {
    if (isLoggedIn && userId) {
      navigate("/");
    }
  }, [isLoggedIn, userId, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <FaUnlock />
          {t("login.title")}
          <FaUnlock />
        </h2>
        {error && (
          <div className="text-red-600 text-center mb-4 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        <form onSubmit={submitForm} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t("login.username")}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border w-full py-2 px-10 rounded"
              required
            />
            <RiUser3Fill className="absolute top-3 left-2 text-lg" />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder={t("login.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full py-2 px-10 rounded"
              required
            />
            <RiLockPasswordFill className="absolute top-3 left-2 text-lg" />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            {t("login.button")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
