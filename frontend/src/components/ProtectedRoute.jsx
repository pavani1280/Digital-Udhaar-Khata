import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    // Redirect to home page if not authenticated
    return <Navigate to="/" replace />;
  }

  // Check for account activation status
  if (user.status === "inactive") {
    return <Navigate to="/" replace state={{ error: "Account is deactivated. Contact Admin." }} />;
  }

  // Check role authorization if restricted
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If shopkeeper tries to visit admin routes, redirect to shopkeeper dashboard
    if (user.role === "shopkeeper") {
      return <Navigate to="/dashboard" replace />;
    }
    // If admin tries to visit shopkeeper routes, redirect to admin dashboard
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
