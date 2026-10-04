import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
  deleteProduct,
  getVendorProducts,
} from "../../services/api";

import "./vendor.css";

function VendorProducts() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setError("");

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {
          throw new Error(
            "Please log in as a vendor."
          );
        }

        const user =
          JSON.parse(storedUser);

        const vendorId =
          user._id || user.id;

        if (!vendorId) {
          throw new Error(
            "Vendor information could not be found."
          );
        }

        const response =
          await getVendorProducts(
            vendorId
          );

        setProducts(
          response.data?.products ||
            []
        );
      } catch (err) {
        console.error(
          "Load products error:",
          err
        );

        setError(
          err.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  const formatPrice = (price) => {
    return `₦${Number(
      price
    ).toLocaleString()}`;
  };

  const handleEditProduct = (
    productId
  ) => {
    navigate(
      `/vendor/products/${productId}/edit`
    );
  };

  const handleDeleteProduct = async (
    product
  ) => {
    const productId =
      product.id || product._id;

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);

      await deleteProduct(
        productId
      );

      setProducts(
        (previous) =>
          previous.filter(
            (item) =>
              (item.id ||
                item._id) !==
              productId
          )
      );

      alert(
        "Product deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete product error:",
        err
      );

      alert(
        err.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const inStockProducts =
    products.filter(
      (product) =>
        product.inStock
    ).length;

  const outOfStockProducts =
    products.filter(
      (product) =>
        !product.inStock
    ).length;

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-products-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Products</h1>

            <p>
              Manage the products
              available in your
              marketplace store.
            </p>
          </div>

          <button
            type="button"
            className="primary-dashboard-button"
            onClick={() =>
              navigate(
                "/vendor/products/new"
              )
            }
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        <div className="product-summary-grid">
          <div className="product-summary-card">
            <div className="summary-icon">
              <Package size={21} />
            </div>

            <div>
              <span>
                Total Products
              </span>

              <strong>
                {products.length}
              </strong>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="summary-icon">
              <Package size={21} />
            </div>

            <div>
              <span>
                In Stock
              </span>

              <strong>
                {inStockProducts}
              </strong>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="summary-icon warning-icon">
              <Package size={21} />
            </div>

            <div>
              <span>
                Available
              </span>

              <strong>
                {inStockProducts}
              </strong>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="summary-icon danger-icon">
              <Package size={21} />
            </div>

            <div>
              <span>
                Out of Stock
              </span>

              <strong>
                {outOfStockProducts}
              </strong>
            </div>
          </div>
        </div>

        <section className="dashboard-panel products-management-panel">
          <div className="products-toolbar">
            <div className="products-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />
            </div>

            <button
              type="button"
              className="filter-button"
            >
              <Filter size={17} />
              Filter
            </button>
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {loading ? (
            <div className="empty-products">
              <Package size={35} />

              <h3>
                Loading products...
              </h3>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>
                        Product
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Price
                      </th>

                      <th>
                        Stock
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map(
                      (product) => {
                        const productId =
                          product.id ||
                          product._id;

                        const status =
                          product.inStock
                            ? "Active"
                            : "Out of Stock";

                        return (
                          <tr
                            key={
                              productId
                            }
                          >
                            <td>
                              <div className="product-table-info">
                                <div className="product-image-placeholder">
                                  {product.image ? (
                                    <img
                                      src={
                                        product.image
                                      }
                                      alt={
                                        product.name
                                      }
                                    />
                                  ) : (
                                    <Package
                                      size={
                                        20
                                      }
                                    />
                                  )}
                                </div>

                                <div>
                                  <strong>
                                    {
                                      product.name
                                    }
                                  </strong>
                                </div>
                              </div>
                            </td>

                            <td>
                              {product.category ||
                                "—"}
                            </td>

                            <td className="product-price">
                              {formatPrice(
                                product.price
                              )}
                            </td>

                            <td>
                              <span
                                className={
                                  product.inStock
                                    ? ""
                                    : "stock-danger"
                                }
                              >
                                {product.inStock
                                  ? "In stock"
                                  : "Out of stock"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`product-status ${status
                                  .toLowerCase()
                                  .replaceAll(
                                    " ",
                                    "-"
                                  )}`}
                              >
                                {
                                  status
                                }
                              </span>
                            </td>

                            <td>
                              <div className="product-actions">
                                <button
                                  type="button"
                                  className="table-action-button"
                                  title="Edit product"
                                  onClick={() =>
                                    handleEditProduct(
                                      productId
                                    )
                                  }
                                >
                                  <Pencil
                                    size={
                                      16
                                    }
                                  />
                                </button>

                                <button
                                  type="button"
                                  className="table-action-button delete"
                                  title="Delete product"
                                  disabled={
                                    deletingId ===
                                    productId
                                  }
                                  onClick={() =>
                                    handleDeleteProduct(
                                      product
                                    )
                                  }
                                >
                                  <Trash2
                                    size={
                                      16
                                    }
                                  />
                                </button>

                                <button
                                  type="button"
                                  className="table-action-button"
                                  title="More options"
                                >
                                  <MoreVertical
                                    size={
                                      16
                                    }
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length ===
                0 && (
                <div className="empty-products">
                  <Package
                    size={35}
                  />

                  <h3>
                    No products found
                  </h3>

                  <p>
                    No products match
                    your current
                    search.
                  </p>
                </div>
              )}

              <div className="table-pagination">
                <span>
                  Showing{" "}
                  {
                    filteredProducts.length
                  }{" "}
                  of{" "}
                  {products.length}{" "}
                  products
                </span>

                <div>
                  <button disabled>
                    Previous
                  </button>

                  <button className="pagination-active">
                    1
                  </button>

                  <button disabled>
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </DashboardLayout>
  );
}

export default VendorProducts;