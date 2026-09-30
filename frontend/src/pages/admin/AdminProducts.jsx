import { useState } from "react";
import {
  Search,
  Package,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./admin.css";

function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      vendor: "TechHub Store",
      category: "Electronics",
      price: "₦45,000",
      stock: 24,
      status: "Active",
    },
    {
      id: 2,
      name: "Smart Watch",
      vendor: "TechHub Store",
      category: "Electronics",
      price: "₦85,000",
      stock: 12,
      status: "Active",
    },
    {
      id: 3,
      name: "Running Sneakers",
      vendor: "Urban Fashion",
      category: "Fashion",
      price: "₦58,000",
      stock: 18,
      status: "Active",
    },
    {
      id: 4,
      name: "Kitchen Blender",
      vendor: "Home Essentials",
      category: "Home & Living",
      price: "₦36,500",
      stock: 3,
      status: "Low Stock",
    },
  ];

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.vendor} ${product.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading">
          <div>
            <h1>Products</h1>
            <p>
              Monitor products listed by vendors across
              MarketHub.
            </p>
          </div>
        </div>

        <div className="admin-mini-stats">
          <MiniStat
            icon={Package}
            title="Total Products"
            value="1,845"
          />

          <MiniStat
            icon={CheckCircle2}
            title="Active Products"
            value="1,792"
            type="blue"
          />

          <MiniStat
            icon={AlertTriangle}
            title="Low Stock"
            value="53"
            type="orange"
          />
        </div>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <select>
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Living</option>
            </select>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-product-avatar">
                          <Package size={18} />
                        </div>

                        <strong>
                          {product.name}
                        </strong>
                      </div>
                    </td>

                    <td>{product.vendor}</td>
                    <td>{product.category}</td>

                    <td>
                      <strong>{product.price}</strong>
                    </td>

                    <td>{product.stock}</td>

                    <td>
                      <span
                        className={`admin-status ${product.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {product.status}
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

export default AdminProducts;