import  { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface OrderSuccessPageProps {
  userId: string;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ userId }) => {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const getPastOrdersUrl = async () => {
      try {
        const response = await axiosInstance.get<{ redirectUrl: string }>(`/orders/redirect/${userId}`);
        if (response.data.redirectUrl) {
          setRedirectUrl(response.data.redirectUrl);
        }
      } catch (error) {
        console.error("Error fetching past orders redirect URL:", error);
      }
    };

    getPastOrdersUrl();
  }, [userId]);

  const handleRedirect = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 text-center p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        {t("orderSuccess.title")}
      </h1>
      <p className="mb-6">{t("orderSuccess.message")}</p>

      {redirectUrl && (
        <button
          onClick={handleRedirect}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {t("orderSuccess.viewOrders")}
        </button>
      )}
    </div>
  );
};

export default OrderSuccessPage;
