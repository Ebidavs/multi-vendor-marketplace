import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/products";
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
      <Route path="/" element={<Home />} />

      <Route path="/products" element={<Products />} />

      <Route path="/vendor" element={<VendorDashboard />} />

      <Route path="/vendor/products" element={<VendorProducts />} />
      <Route path="/vendor/products/add" element={<AddProduct />} />
      <Route path="/vendor/orders" element={<VendorOrders />} />
      <Route path="/vendor/orders/:orderId" element={<VendorOrderDetails />} />
      <Route path="/vendor/customers" element={<VendorCustomers />} />

      <Route path="/vendor/analytics" element={<VendorAnalytics />} />

      <Route path="/vendor/store" element={<VendorStoreProfile />} />

      <Route path="/vendor/reviews" element={<VendorReviews />} />

      <Route path="/vendor/settings" element={<VendorSettings />} />
      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="/admin/users" element={<AdminUsers />} />

      <Route path="/admin/vendors" element={<AdminVendors />} />

      <Route path="/admin/products" element={<AdminProducts />} />

      <Route path="/admin/categories" element={<AdminCategories />} />

      <Route path="/admin/orders" element={<AdminOrders />} />

      <Route path="/admin/reports" element={<AdminReports />} />

      <Route path="/admin/settings" element={<AdminSettings />} />
    </Routes>
  );
}

export default App;
