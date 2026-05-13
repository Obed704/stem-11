import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080a0f] text-white">Loading...</div>;
  }

  return admin ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;