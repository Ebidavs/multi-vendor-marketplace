
import { useEffect, useState } from "react";

import {
  Search,
  Users,
  UserCheck,
  UserPlus,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  getAdminAnalytics,
  getAdminCustomers,
  getAdminVendors,
} from "../../services/api";

import "./admin.css";

async function fetchAllUsers(fetchPage, key, role) {
  const allUsers = [];
  let page = 1;

  while (true) {
    const response = await fetchPage(page, 50);
    const data = response?.data || {};
    const records = data[key];

    if (!Array.isArray(records)) {
      throw new Error(`Invalid ${role} response from the server.`);
    }

    allUsers.push(
      ...records.map((user) => ({
        id: user.id || user._id,
        name: user.name || "Unknown User",
        email: user.email || "",
        role,
        createdAt: user.createdAt || null,
        isActive: Boolean(user.isActive),
      }))
    );

    const totalPages = Number(data.pagination?.pages);

    if (
      (Number.isFinite(totalPages) && totalPages > 0
        ? page >= totalPages
        : records.length < 50)
    ) {
      break;
    }

    page += 1;
  }

  return allUsers;
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [stats, setStats] = useState({
    totalUsers: null,
    totalCustomers: null,
    totalVendors: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const [customers, vendors, analyticsResponse] =
          await Promise.all([
            fetchAllUsers(
              (page, limit) =>
                getAdminCustomers(page, limit),
              "customers",
              "customer"
            ),

            fetchAllUsers(
              (page, limit) =>
                getAdminVendors(page, limit),
              "vendors",
              "vendor"
            ),

            getAdminAnalytics(),
          ]);

        if (cancelled) return;

        const combinedUsers = [
          ...customers,
          ...vendors,
        ].sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        setUsers(combinedUsers);

        const analytics = analyticsResponse?.data || {};

        setStats({
          totalUsers:
            analytics.totalUsers ?? null,

          totalCustomers:
            analytics.totalCustomers ?? null,

          totalVendors:
            analytics.totalVendors ?? null,
        });
      } catch (err) {
        if (cancelled) return;

        console.error("Admin users error:", err);

        setError(
          err.message ||
            "Failed to load users."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      `${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(search);

    const matchesRole =
      roleFilter === "all" ||
      user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length;

  const formatNumber = (number) =>
    typeof number === "number"
      ? number.toLocaleString("en-NG")
      : "—";

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading">
          <div>
            <h1>Users</h1>
            <p>
              Manage Xi Market customers and
              vendor accounts.
            </p>
          </div>
        </div>

        <div className="admin-mini-stats">
          <MiniStat
            icon={Users}
            title="Total Users"
            value={formatNumber(stats.totalUsers)}
          />

          <MiniStat
            icon={UserCheck}
            title="Active Customers & Vendors"
            value={
              loading || error
                ? "—"
                : formatNumber(activeUsers)
            }
            type="blue"
          />

          <MiniStat
            icon={UserPlus}
            title="Total Customers"
            value={formatNumber(stats.totalCustomers)}
            type="orange"
          />
        </div>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {loading ? (
            <div className="empty-orders">
              <Users size={36} />
              <h3>Loading users...</h3>
            </div>
          ) : !error ? (
            <>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={`${user.role}-${user.id}`}
                      >
                        <td>
                          <div className="admin-user-cell">
                            <div className="admin-avatar">
                              {user.name
                                .split(" ")
                                .filter(Boolean)
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <strong>{user.name}</strong>
                          </div>
                        </td>

                        <td>{user.email || "—"}</td>

                        <td>
                          <span className="admin-role">
                            {user.role === "vendor"
                              ? "Vendor"
                              : "Customer"}
                          </span>
                        </td>

                        <td>
                          {formatDate(user.createdAt)}
                        </td>

                        <td>
                          <span
                            className={`admin-status ${
                              user.isActive
                                ? "approved"
                                : "inactive"
                            }`}
                          >
                            {user.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="empty-orders">
                  <Users size={36} />

                  <h3>No users found</h3>

                  <p>
                    No users match your current
                    search or role filter.
                  </p>
                </div>
              )}
            </>
          ) : null}
        </section>
      </section>
    </DashboardLayout>
  );
}

function MiniStat({
  icon: Icon,
  title,
  value,
  type = "green",
}) {
  return (
    <article className="admin-mini-stat">
      <div className={`admin-mini-icon ${type}`}>
        <Icon size={21} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default AdminUsers;
