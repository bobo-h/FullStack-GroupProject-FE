import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.level !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
