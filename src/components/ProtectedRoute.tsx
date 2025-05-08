// import { FC } from "react";
// import { Outlet, Navigate } from "react-router-dom";
// import { useAppSelector } from "../redux/hooks";

// const ProtectedRoute: FC = () => {
//   const isLoggedin = useAppSelector((state) => state.authReducer.isLoggedIn);
//   return isLoggedin ? <Outlet /> : <Navigate to="/" />;
// };

// export default ProtectedRoute;

import { FC } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const role = useAppSelector((state) => state.authReducer.Role); // e.g., "admin", "seller", "customer"

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role || "")) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl text-red-600 font-semibold">
          Access Denied: You do not have permission to view this page.
        </h1>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
