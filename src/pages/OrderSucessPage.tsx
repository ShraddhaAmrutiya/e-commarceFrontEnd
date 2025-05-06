import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessPageProps {
  userId: string;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ userId }) => {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const getPastOrdersUrl = async () => {
      try {
        const response = await axios.get<{ redirectUrl: string }>(`/orders/redirect/${userId}`);
        console.log('Order data:', response.data);

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
    <div>
      <h1>Your Order Was Successfully Placed!</h1>
      <p>Thank you for your purchase. You can view your past orders below.</p>

      {redirectUrl && (
        <button onClick={handleRedirect}>
          View Past Orders
        </button>
      )}
    </div>
  );
};

export default OrderSuccessPage;
