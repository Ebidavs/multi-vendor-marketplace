import {
  Users,
  Store,
  Package,
} from "lucide-react";

import DashboardCard from "./DashboardCard";

function AdminOverview({ stats }) {
  return (
    <div className="admin-stats-grid">
      <DashboardCard
        title="Total Users"
        value={stats.totalUsers}
        icon={Users}
      />

      <DashboardCard
        title="Total Vendors"
        value={stats.totalVendors}
        icon={Store}
      />

      <DashboardCard
        title="Total Customers"
        value={stats.totalCustomers}
        icon={Users}
      />

      <DashboardCard
        title="Total Products"
        value={stats.totalProducts}
        icon={Package}
      />
    </div>
  );
}

export default AdminOverview;