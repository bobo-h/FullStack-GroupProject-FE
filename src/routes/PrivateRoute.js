import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    // 인증되지 않은 경우 로그인 페이지로 리디렉션
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.level !== requiredRole) {
    // 권한이 없는 경우 접근 차단
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
