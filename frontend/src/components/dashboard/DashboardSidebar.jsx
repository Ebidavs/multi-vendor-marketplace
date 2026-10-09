
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Store,
  Star,
  Settings,
  LogOut,
  UserCog,
  Tags,
  FileChartColumn,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../../services/api";

import "./dashboard.css";

function DashboardSidebar({ role = "vendor", isOpen, onClose }) {
  const navigate = useNavigate();

  // Logout and redirect to the appropriate sign-in portal
  const handleLogout = () => {
    clearToken();

    if (onClose) {
      onClose();
    }

    if (role === "vendor") {
      navigate("/vendor/login", { replace: true });
    } else if (role === "admin") {
      navigate("/admin/login", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  const vendorLinks = [
    {
      name: "Overview",
      icon: LayoutDashboard,
      path: "/vendor/dashboard",
    },
    {
      name: "Products",
      icon: Package,
      path: "/vendor/products",
    },
    {
      name: "Orders",
      icon: ShoppingBag,
      path: "/vendor/orders",
    },
    {
      name: "Customers",
      icon: Users,
      path: "/vendor/customers",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/vendor/analytics",
    },
    {
      name: "Store Profile",
      icon: Store,
      path: "/vendor/profile",
    },
    {
      name: "Reviews",
      icon: Star,
      path: "/vendor/reviews",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/vendor/settings",
    },
  ];

  const adminLinks = [
    {
      name: "Overview",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      name: "Vendors",
      icon: Store,
      path: "/admin/vendors",
    },
    {
      name: "Products",
      icon: Package,
      path: "/admin/products",
    },
    {
      name: "Categories",
      icon: Tags,
      path: "/admin/categories",
    },
    {
      name: "Orders",
      icon: ShoppingBag,
      path: "/admin/orders",
    },
    {
      name: "Reports",
      icon: FileChartColumn,
      path: "/admin/reports",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const links = role === "admin" ? adminLinks : vendorLinks;

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`dashboard-sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            <ShoppingBag size={22} />
          </div>

          <span>XI Market</span>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-role">
          {role === "admin" ? (
            <>
              <UserCog size={18} />
              <span>Admin Panel</span>
            </>
          ) : (
            <>
              <Store size={18} />
              <span>Vendor Center</span>
            </>
          )}
        </div>

        <nav className="sidebar-navigation">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                to={link.path}
                end={
                  link.path === "/vendor/dashboard" ||
                  link.path === "/admin/dashboard"
                }
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
                key={link.name}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default DashboardSidebar;
