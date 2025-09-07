/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";
import { MdEmail, MdPhone, MdPerson, MdCake, MdWc } from "react-icons/md";

interface Address {
  address: string;
  city: string;
  postalCode: string;
  state: string;
}

interface UserInfo {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: Address;
}

const Profile: FC = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState<UserInfo>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const language = localStorage.getItem("language") || "en";

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    if (!userId || !token) return;

    fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": language,
      },
    })
      .then((res) => res.json())
      .then((data) => setInfo(data))
      .catch((err) => console.error(err.message));
  }, []);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();

    if (!info?.userName) return toast.error(t("profile.toast.userNotLoaded"));
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error(t("profile.toast.fillFields"));
    }

    if (newPassword !== confirmPassword) {
      return toast.error(t("profile.toast.passwordMismatch"));
    }

    try {
      const response = await fetch(
        `${BASE_URL}/users/reset-passwordwitholdpassword/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": language,
          },
          body: JSON.stringify({
            userName: info.userName,
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || t("profile.toast.updateFailed"));
        return;
      }

      toast.success(data.message || t("profile.toast.updateSuccess"));

      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(t("profile.toast.genericError"));
    }
  };

  return (
    <div className="container mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
        {t("profile.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Info Cards */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-slate-700 dark:to-slate-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">{t("profile.details")}</h2>
            <div className="space-y-3 text-base">
              <div className="flex items-center gap-3">
                <MdPerson className="text-purple-600 text-xl" />
                <span className="font-semibold">{info?.userName}</span>
              </div>
              {/* <div className="flex items-center gap-3">
                <MdPerson className="text-blue-600 text-xl" />
                <span>
                  {info?.firstName} {info?.lastName}
                </span>
              </div> */}
              <div className="flex items-center gap-3">
                <MdEmail className="text-red-500 text-xl" />
                <span className="break-all">{info?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-green-500 text-xl" />
                <span>{info?.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MdCake className="text-orange-500 text-xl" />
                <span>{info?.age} {t("profile.age")}</span>
              </div>
              <div className="flex items-center gap-3">
                <MdWc className="text-pink-500 text-xl" />
                <span>{info?.gender}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Password Reset Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {t("profile.resetTitle")}
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              placeholder={t("profile.oldPassword")}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder={t("profile.newPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder={t("profile.confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
            >
              {t("profile.updateButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
