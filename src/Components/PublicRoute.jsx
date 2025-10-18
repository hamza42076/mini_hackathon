// components/PublicRoute.jsx
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // Agar user login hai to /create-pitch par redirect kare
  if (currentUser) {
    return <Navigate to="/create-pitch" replace />;
  }

  return children;
};

export default PublicRoute;
