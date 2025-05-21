/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

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
        "Accept-Language": language
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
      const response = await fetch(`${BASE_URL}/users/reset-passwordwitholdpassword/`, {
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
      });

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
    <div className="container mx-auto w-full max-w-5xl dark:text-white bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-lg">
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">{t("profile.title")}</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-purple-200 to-blue-300 rounded-lg p-6 shadow-lg">
            <table className="w-full">
              <tbody>
                <tr><td className="font-semibold py-3 text-lg">{t("profile.username")}</td><td className="py-3 text-lg">{info?.userName}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">{t("profile.firstName")}</td><td className="py-3 text-lg">{info?.firstName}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">{t("profile.lastName")}</td><td className="py-3 text-lg">{info?.lastName}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">{t("profile.email")}</td><td className="py-3 text-lg">{info?.email}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">{t("profile.phone")}</td><td className="py-3 text-lg">{info?.phone}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">{t("profile.age")}</td><td className="py-3 text-lg">{info?.age}</td></tr>
                <tr><td className="font-semibold py-3 text-lg">{t("profile.gender")}</td><td className="py-3 text-lg">{info?.gender}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Password Reset Form */}
          <div className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">{t("profile.resetTitle")}</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder={t("profile.oldPassword")}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />
              <input
                type="password"
                placeholder={t("profile.newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />
              <input
                type="password"
                placeholder={t("profile.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-4 py-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {t("profile.updateButton")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
