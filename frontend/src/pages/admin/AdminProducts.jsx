
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  getProducts,
  getCategories,
  getAdminAnalytics,
  getAdminVendors,
} from "../../services/api";

import "./admin.css";

const LOW_STOCK_THRESHOLD = 5;

async function fetchAllProducts() {
  const allProducts = [];
  let page = 1;

  while (true) {
    const response = await getProducts(
      `?page=${page}&limit=50`
    );

    const data = response?.data || response;
    const products = data?.products;

    if (!Array.isArray(products)) {
      throw new Error("Invalid products response.");
    }

    allProducts.push(...products);

    const totalPages = Number(
      data?.pagination?.pages
    );

    if (
      Number.isFinite(totalPages) &&
      totalPages >= 0
        ? page >= totalPages
        : products.length < 50
    ) {
      break;
    }

    page += 1;
  }

  return allProducts;
}

async function fetchAllVendors() {
  const allVendors = [];
  let page = 1;

  while (true) {
    const response = await getAdminVendors(
      page,
      50
    );

    const data = response?.data || {};
    const vendors = data.vendors;

    if (!Array.isArray(vendors)) {
      throw new Error("Invalid vendors response.");
    }

    allVendors.push(...vendors);

    const totalPages = Number(
      data?.pagination?.pages
    );

    if (
      Number.isFinite(totalPages) &&
      totalPages >= 0
        ? page >= totalPages
        : vendors.length < 50
    ) {
      break;
    }

    page += 1;
  }

  return allVendors;
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [totalProducts, setTotalProducts] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          productList,
          categoriesResponse,
          vendorList,
          analyticsResponse,
        ] = await Promise.all([
          fetchAllProducts(),
          getCategories(),
          fetchAllVendors(),
          getAdminAnalytics(),
        ]);

        if (cancelled) return;

        const categoryData =
          categoriesResponse?.data ||
          categoriesResponse;

        const analytics =
          analyticsResponse?.data || {};

        setProducts(productList);
        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : []
        );
        setVendors(vendorList);

        setTotalProducts(
          typeof analytics.totalProducts === "number"
            ? analytics.totalProducts
            : null
        );
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Admin products loading error:",
          err
        );

        setError(
          err.message ||
            "Failed to load products."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const vendorMap = useMemo(() => {
    const map = new Map();

    vendors.forEach((vendor) => {
      const id = vendor.id || vendor._id;

      if (id) {
        map.set(
          String(id),
          vendor.shop?.name ||
            vendor.name ||
            "Unknown Vendor"
        );
      }
    });

    return map;
  }, [vendors]);

  const categoryMap = useMemo(() => {
    const map = new Map();

    categories.forEach((category) => {
      const id = category.id || category._id;

      if (id) {
        map.set(String(id), category.name);
      }
    });

    return map;
  }, [categories]);

  const normalizedProducts = useMemo(
    () =>
      products.map((product) => {
        const vendorId =
          product.vendorId ||
          product.vendor?._id ||
          product.vendor?.id ||
          product.vendor;

        const categoryId =
          product.categoryId ||
          product.category?._id ||
          product.category?.id;

        const categoryName =
          typeof product.category === "string"
            ? product.category
            : product.category?.name ||
              categoryMap.get(String(categoryId)) ||
              "Uncategorized";

        const vendorName =
          product.vendorName ||
          product.vendor?.shop?.name ||
          product.vendor?.name ||
          vendorMap.get(String(vendorId)) ||
          "Unknown Vendor";

        const stock =
          typeof product.stockQuantity === "number"
            ? product.stockQuantity
            : typeof product.stock === "number"
              ? product.stock
              : null;

        let status = "Active";

        if (product.inStock === false || stock === 0) {
          status = "Out of Stock";
        } else if (
          stock !== null &&
          stock <= LOW_STOCK_THRESHOLD
        ) {
          status = "Low Stock";
        }

        return {
          id: product.id || product._id,
          name: product.name || "Unnamed Product",
          vendor: vendorName,
          category: categoryName,
          categoryId: categoryId
            ? String(categoryId)
            : "",
          price: Number(product.price) || 0,
          stock,
          status,
          image:
            product.image ||
            product.images?.[0] ||
            null,
        };
      }),
    [products, vendorMap, categoryMap]
  );

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return normalizedProducts.filter((product) => {
      const matchesSearch =
        `${product.name} ${product.vendor} ${product.category}`
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        categoryFilter === "all" ||
        product.categoryId === categoryFilter ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [
    normalizedProducts,
    searchTerm,
    categoryFilter,
  ]);

  const lowStockCount = normalizedProducts.filter(
    (product) => product.status === "Low Stock"
  ).length;

  const activeCount = normalizedProducts.length;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatNumber = (number) =>
    typeof number === "number"
      ? number.toLocaleString("en-NG")
      : "—";

  return (
    <DashboardLayout role="admin">
      <section className="admin-page">
        <div className="admin-page-heading">
          <div>
            <h1>Products</h1>
            <p>
              Monitor products listed by vendors
              across Xi Market.
            </p>
          </div>
        </div>

        <div className="admin-mini-stats">
          <MiniStat
            icon={Package}
            title="Total Visible Products"
            value={formatNumber(totalProducts)}
          />

          <MiniStat
            icon={CheckCircle2}
            title="Loaded Products"
            value={
              loading || error
                ? "—"
                : formatNumber(activeCount)
            }
            type="blue"
          />

          <MiniStat
            icon={AlertTriangle}
            title="Low Stock (Known)"
            value={
              loading || error
                ? "—"
                : formatNumber(lowStockCount)
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
            >
              <option value="all">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category.id || category._id}
                  value={
                    category.id || category._id
                  }
                >
                  {category.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="admin-icon-button"
              title="Refresh products"
              aria-label="Refresh products"
              disabled={loading}
              onClick={() =>
                setReloadKey((previous) => previous + 1)
              }
            >
              <RefreshCw size={17} />
            </button>
          </div>

          {error && (
            <p role="alert" className="login-error">
              {error}
            </p>
          )}

          {loading ? (
            <div
              style={{
                padding: "36px",
                textAlign: "center",
              }}
            >
              Loading products...
            </div>
          ) : error ? (
            <div
              style={{
                padding: "36px",
                textAlign: "center",
              }}
            >
              Unable to display products.
            </div>
          ) : (
            <>
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
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="admin-user-cell">
                            <div className="admin-product-avatar">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "inherit",
                                  }}
                                />
                              ) : (
                                <Package size={18} />
                              )}
                            </div>

                            <strong>
                              {product.name}
                            </strong>
                          </div>
                        </td>

                        <td>{product.vendor}</td>
                        <td>{product.category}</td>

                        <td>
                          <strong>
                            {formatCurrency(product.price)}
                          </strong>
                        </td>

                        <td>
                          {product.stock === null
                            ? "—"
                            : product.stock}
                        </td>

                        <td>
                          <span
                            className={`admin-status ${
                              product.status
                                .toLowerCase()
                                .replaceAll(" ", "-")
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div
                  style={{
                    padding: "36px",
                    textAlign: "center",
                  }}
                >
                  <Package size={30} />

                  <h3>No products found</h3>

                  <p>
                    Try another search or category.
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

export default AdminProducts;
