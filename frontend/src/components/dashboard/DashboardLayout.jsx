import { useState } from "react";

import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

import "./dashboard.css";

function DashboardLayout({ role = "vendor", children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <DashboardSidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="dashboard-main">
        <DashboardHeader
          role={role}
          onMenuClick={openSidebar}
        />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;