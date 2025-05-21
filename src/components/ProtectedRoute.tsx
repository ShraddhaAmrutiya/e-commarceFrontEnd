import { FC } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { t } = useTranslation();
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const role = useAppSelector((state) => state.authReducer.Role); // e.g., "admin", "seller", "customer"

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role || "")) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl text-red-600 font-semibold">{t("accessDeniedTitle")}</h1>
        <p>{t("accessDeniedMessage")}</p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
