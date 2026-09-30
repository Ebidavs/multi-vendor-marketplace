import { useState } from "react";
import {
  Plus,
  Search,
  Tags,
  Package,
  Edit3,
  Trash2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./admin.css";

function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", products: 485, status: "Active" },
    { id: 2, name: "Fashion", products: 392, status: "Active" },
    { id: 3, name: "Home & Living", products: 286, status: "Active" },
    { id: 4, name: "Beauty", products: 214, status: "Active" },
    { id: 5, name: "Sports", products: 176, status: "Active" },
    { id: 6, name: "Food & Groceries", products: 292, status: "Active" },
  ]);

  const addCategory = () => {
    const name = window.prompt("Enter category name:");

    if (!name?.trim()) return;

    setCategories((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: name.trim(),
        products: 0,
        status: "Active",
      },
    ]);
  };

  const deleteCategory = (id) => {
    setCategories((previous) =>
      previous.filter((category) => category.id !== id)
    );
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading admin-heading-action">
          <div>
            <h1>Categories</h1>
            <p>
              Organize marketplace products into clear shopping
              categories.
            </p>
          </div>

          <button className="admin-primary-button" onClick={addCategory}>
            <Plus size={17} />
            Add Category
          </button>
        </div>

        <div className="admin-mini-stats">
          <MiniStat icon={Tags} title="Categories" value={categories.length} />

          <MiniStat
            icon={Package}
            title="Categorized Products"
            value="1,845"
            type="blue"
          />

          <MiniStat
            icon={Tags}
            title="Active Categories"
            value={categories.length}
            type="orange"
          />
        </div>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-category-avatar">
                          <Tags size={18} />
                        </div>

                        <strong>{category.name}</strong>
                      </div>
                    </td>

                    <td>{category.products}</td>

                    <td>
                      <span className="admin-status active">
                        {category.status}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">
                        <button className="admin-icon-button">
                          <Edit3 size={15} />
                        </button>

                        <button
                          className="admin-icon-button danger"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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

function MiniStat({ icon: Icon, title, value, type = "green" }) {
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

export default AdminCategories;