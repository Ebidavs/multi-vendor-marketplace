import { useState } from "react";
import { Search, Users, ShoppingBag, UserPlus, Mail } from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./vendor.css";

function VendorCustomers() {
  const [searchTerm, setSearchTerm] = useState("");

  const customers = [
    {
      id: 1,
      name: "Sarah Williams",
      email: "sarah@example.com",
      orders: 5,
      spent: "₦245,000",
      lastOrder: "Sep 29, 2026",
    },
    {
      id: 2,
      name: "David Johnson",
      email: "david@example.com",
      orders: 3,
      spent: "₦135,000",
      lastOrder: "Sep 29, 2026",
    },
    {
      id: 3,
      name: "Michael James",
      email: "michael@example.com",
      orders: 7,
      spent: "₦320,500",
      lastOrder: "Sep 28, 2026",
    },
    {
      id: 4,
      name: "Grace Peter",
      email: "grace@example.com",
      orders: 2,
      spent: "₦78,000",
      lastOrder: "Sep 28, 2026",
    },
  ];

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();

    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search)
    );
  });

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-customers-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Customers</h1>
            <p>View customers who have purchased from your store.</p>
          </div>
        </div>

        <div className="customer-stat-grid">
          <div className="customer-stat-card">
            <Users size={22} />

            <div>
              <span>Total Customers</span>
              <strong>327</strong>
            </div>
          </div>

          <div className="customer-stat-card">
            <UserPlus size={22} />

            <div>
              <span>New This Month</span>
              <strong>28</strong>
            </div>
          </div>

          <div className="customer-stat-card">
            <ShoppingBag size={22} />

            <div>
              <span>Repeat Customers</span>
              <strong>86</strong>
            </div>
          </div>

          <div className="customer-stat-card">
            <div className="naira-stat-icon">₦</div>

            <div>
              <span>Average Spend</span>
              <strong>₦72,500</strong>
            </div>
          </div>
        </div>

        <section className="dashboard-panel">
          <div className="customers-toolbar">
            <div className="orders-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="vendor-orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Last Order</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="order-customer">
                        <div className="customer-avatar">
                          {customer.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <strong>{customer.name}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="customer-email">
                        <Mail size={14} />
                        {customer.email}
                      </span>
                    </td>

                    <td>{customer.orders}</td>

                    <td className="vendor-order-amount">{customer.spent}</td>

                    <td>{customer.lastOrder}</td>
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

export default VendorCustomers;
