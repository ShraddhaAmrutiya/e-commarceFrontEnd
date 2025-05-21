import { useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t, i18n } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const language = localStorage.getItem("language") || "en";
  i18n.changeLanguage(language); // Ensure UI uses stored language

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error(t("reset.fillFields"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("reset.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/users/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || t("reset.genericError"));
        return;
      }

      toast.success(data.message || t("reset.success"));
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(t("reset.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">{t("reset.title")}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder={t("reset.newPassword")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
          <input
            type="password"
            placeholder={t("reset.confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? t("reset.resetting") : t("reset.button")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
