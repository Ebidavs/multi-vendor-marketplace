import { useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserPlus,
  MoreVertical,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./admin.css";

function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: 1,
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "Customer",
      joined: "Sep 29, 2026",
      status: "Active",
    },
    {
      id: 2,
      name: "David Johnson",
      email: "david@example.com",
      role: "Customer",
      joined: "Sep 27, 2026",
      status: "Active",
    },
    {
      id: 3,
      name: "Michael James",
      email: "michael@example.com",
      role: "Vendor",
      joined: "Sep 24, 2026",
      status: "Active",
    },
    {
      id: 4,
      name: "Grace Peter",
      email: "grace@example.com",
      role: "Customer",
      joined: "Sep 20, 2026",
      status: "Suspended",
    },
  ];

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <AdminPageHeading
          title="Users"
          description="Manage MarketHub customers and user accounts."
        />

        <div className="admin-mini-stats">
          <MiniStat
            icon={Users}
            title="Total Users"
            value="2,481"
          />

          <MiniStat
            icon={UserCheck}
            title="Active Users"
            value="2,327"
            type="blue"
          />

          <MiniStat
            icon={UserPlus}
            title="New This Month"
            value="186"
            type="orange"
          />
        </div>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <select>
              <option>All Roles</option>
              <option>Customer</option>
              <option>Vendor</option>
            </select>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-avatar">
                          {user.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <strong>{user.name}</strong>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span className="admin-role">
                        {user.role}
                      </span>
                    </td>

                    <td>{user.joined}</td>

                    <td>
                      <span
                        className={`admin-status ${user.status.toLowerCase()}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <button className="admin-icon-button">
                        <MoreVertical size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}

function AdminPageHeading({
  title,
  description,
}) {
  return (
    <div className="admin-page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
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
      <div
        className={`admin-mini-icon ${type}`}
      >
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