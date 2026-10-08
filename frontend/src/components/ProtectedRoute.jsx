
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "../services/api";

function ProtectedRoute({ allowedRole }) {
  const location = useLocation();
  const token = getToken();

  let user = null;

  try {
    const storedUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    // Support both the user object and older
    // stored API response formats.
    user = storedUser?.data?.user || storedUser?.user || storedUser;
  } catch {
    user = null;
  }

  const role = String(user?.role || "").toLowerCase();

  const loginPaths = {
    admin: "/admin/login",
    vendor: "/vendor/login",
    customer: "/login",
  };

  const loginPath = loginPaths[allowedRole] || "/login";

  // No authenticated session
  if (!token || !role) {
    return (
      <Navigate
        to={loginPath}
        replace
        state={{ from: location }}
      />
    );
  }

  // User is authenticated but has the wrong role
  if (role !== allowedRole) {
    const roleDestinations = {
      admin: "/admin/dashboard",
      vendor: "/vendor/dashboard",
      customer: "/products",
    };

    const destination = roleDestinations[role];

    // Avoid redirecting to another protected route
    // when the stored role is not recognized.
    if (!destination) {
      return <Navigate to={loginPath} replace />;
    }

    // If the current page is already the destination,
    // avoid navigating to the same location repeatedly.
    if (location.pathname === destination) {
      return <Navigate to="/products" replace />;
    }

    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
