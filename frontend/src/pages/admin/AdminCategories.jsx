
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Tags,
  Package,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  getCategories,
  createCategory,
  getAdminAnalytics,
} from "../../services/api";

import "./admin.css";

function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const [categoryResponse, analyticsResponse] =
        await Promise.allSettled([
          getCategories(),
          getAdminAnalytics(),
        ]);

      if (categoryResponse.status === "rejected") {
        throw categoryResponse.reason;
      }

      const categoryData =
        categoryResponse.value?.data ||
        categoryResponse.value;

      const categoryList = Array.isArray(categoryData)
        ? categoryData
        : categoryData?.categories;

      if (!Array.isArray(categoryList)) {
        throw new Error(
          "The server returned an unexpected categories response."
        );
      }

      setCategories(categoryList);

      if (analyticsResponse.status === "fulfilled") {
        const analytics =
          analyticsResponse.value?.data || {};

        setTotalProducts(
          typeof analytics.totalProducts === "number"
            ? analytics.totalProducts
            : null
        );
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async () => {
    const name = window.prompt("Enter category name:");

    if (!name?.trim()) return;

    const trimmedName = name.trim();

    const alreadyExists = categories.some(
      (category) =>
        category.name?.toLowerCase() ===
        trimmedName.toLowerCase()
    );

    if (alreadyExists) {
      setError("This category already exists.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createCategory({
        name: trimmedName,
      });

      setSuccess("Category created successfully.");

      await loadCategories();
    } catch (err) {
      console.error("Failed to create category:", err);

      setError(
        err.message || "Failed to create category."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      (category.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const activeCategories = categories.filter(
    (category) => category.isActive !== false
  ).length;

  const formatNumber = (number) =>
    typeof number === "number"
      ? number.toLocaleString("en-NG")
      : "—";

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading admin-heading-action">
          <div>
            <h1>Categories</h1>
            <p>
              Organize marketplace products into clear
              shopping categories.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={addCategory}
            disabled={saving || loading}
          >
            <Plus size={17} />
            {saving ? "Adding..." : "Add Category"}
          </button>
        </div>

        <div className="admin-mini-stats">
          <MiniStat
            icon={Tags}
            title="Categories"
            value={
              loading
                ? "—"
                : formatNumber(categories.length)
            }
          />

          <MiniStat
            icon={Package}
            title="Total Marketplace Products"
            value={formatNumber(totalProducts)}
            type="blue"
          />

          <MiniStat
            icon={Tags}
            title="Active Categories"
            value={
              loading
                ? "—"
                : formatNumber(activeCategories)
            }
            type="orange"
          />
        </div>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="admin-icon-button"
              title="Refresh categories"
              aria-label="Refresh categories"
              onClick={loadCategories}
              disabled={loading}
            >
              <RefreshCw size={17} />
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="login-error"
              style={{ margin: "15px" }}
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              style={{
                color: "#16803c",
                margin: "15px",
              }}
            >
              {success}
            </p>
          )}

          {loading ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
              }}
            >
              Loading categories...
            </div>
          ) : (
            <>
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
                    {filteredCategories.map(
                      (category) => {
                        const categoryId =
                          category.id || category._id;

                        const isActive =
                          category.isActive !== false;

                        return (
                          <tr key={categoryId}>
                            <td>
                              <div className="admin-user-cell">
                                <div className="admin-category-avatar">
                                  <Tags size={18} />
                                </div>

                                <strong>
                                  {category.name}
                                </strong>
                              </div>
                            </td>

                            <td>
                              {typeof category.productCount ===
                              "number"
                                ? category.productCount
                                : "—"}
                            </td>

                            <td>
                              <span
                                className={`admin-status ${
                                  isActive
                                    ? "active"
                                    : "inactive"
                                }`}
                              >
                                {isActive
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>

                            <td>
                              <span
                                style={{
                                  fontSize: "12px",
                                  opacity: 0.65,
                                }}
                              >
                                No actions available
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {filteredCategories.length === 0 && (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                  }}
                >
                  <Tags
                    size={32}
                    style={{ opacity: 0.5 }}
                  />

                  <h3>No categories found</h3>

                  <p>
                    {searchTerm
                      ? "Try another search term."
                      : "Create your first category using the Add Category button."}
                  </p>
                </div>
              )}
            </>
          )}
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

export default AdminCategories;
