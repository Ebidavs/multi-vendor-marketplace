import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";

// Vendor Pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import AddProduct from "./pages/vendor/AddProduct";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorOrderDetails from "./pages/vendor/VendorOrderDetails";
import VendorCustomers from "./pages/vendor/VendorCustomers";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import VendorStoreProfile from "./pages/vendor/VendorStoreProfile";
import VendorReviews from "./pages/vendor/VendorReviews";
import VendorSettings from "./pages/vendor/VendorSettings";
import EditProduct from "./pages/vendor/EditProduct";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Vendor Routes */}

      {/* Redirect old vendor route to PRD route */}
      <Route
        path="/vendor"
        element={<Navigate to="/vendor/dashboard" replace />}
      />

      <Route
        path="/vendor/dashboard"
        element={<VendorDashboard />}
      />

      <Route
        path="/vendor/products"
        element={<VendorProducts />}
      />

      <Route
        path="/vendor/products/new"
        element={<AddProduct />}
      />
      <Route
        path="/vendor/products/:id/edit"
        element={<EditProduct />}
      />

      <Route
        path="/vendor/orders"
        element={<VendorOrders />}
      />

      <Route
        path="/vendor/orders/:orderId"
        element={<VendorOrderDetails />}
      />

      <Route
        path="/vendor/profile"
        element={<VendorStoreProfile />}
      />

      {/* Extra Vendor Pages */}
      <Route
        path="/vendor/customers"
        element={<VendorCustomers />}
      />

      <Route
        path="/vendor/analytics"
        element={<VendorAnalytics />}
      />

      <Route
        path="/vendor/reviews"
        element={<VendorReviews />}
      />

      <Route
        path="/vendor/settings"
        element={<VendorSettings />}
      />

      {/* Admin Routes */}

      {/* Redirect old admin route to PRD route */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/vendors"
        element={<AdminVendors />}
      />

      {/* Extra Admin Pages */}
      <Route
        path="/admin/users"
        element={<AdminUsers />}
      />

      <Route
        path="/admin/products"
        element={<AdminProducts />}
      />

      <Route
        path="/admin/categories"
        element={<AdminCategories />}
      />

      <Route
        path="/admin/orders"
        element={<AdminOrders />}
      />

      <Route
        path="/admin/reports"
        element={<AdminReports />}
      />

      <Route
        path="/admin/settings"
        element={<AdminSettings />}
      />
    </Routes>
  );
}

export default App;
