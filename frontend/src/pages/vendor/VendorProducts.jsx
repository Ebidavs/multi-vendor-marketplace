import { useState } from "react";
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
import "./vendor.css";

function VendorProducts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 45000,
      stock: 24,
      status: "Active",
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: 85000,
      stock: 12,
      status: "Active",
    },
    {
      id: 3,
      name: "Laptop Backpack",
      category: "Fashion",
      price: 28500,
      stock: 5,
      status: "Low Stock",
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      category: "Electronics",
      price: 32000,
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 5,
      name: "Running Sneakers",
      category: "Fashion",
      price: 58000,
      stock: 18,
      status: "Active",
    },
  ]);

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleEditProduct = (productId) => {
    navigate(`/vendor/products/${productId}/edit`);
  };

  const handleDeleteProduct = (productId) => {
    const productToDelete = products.find(
      (product) => product.id === productId
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete "${productToDelete?.name}"?`
    );

    if (!confirmed) {
      return;
    }

    // Temporary frontend deletion.
    // Later this will call DELETE /api/v1/products/:id.
    setProducts((previousProducts) =>
      previousProducts.filter(
        (product) => product.id !== productId
      )
    );
  };

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-products-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Products</h1>

            <p>
              Manage the products available in your marketplace
              store.
            </p>
          </div>

          <button
            className="primary-dashboard-button"
            onClick={() =>
              navigate("/vendor/products/new")
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
              <span>Total Products</span>
              <strong>{products.length}</strong>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="summary-icon">
              <Package size={21} />
            </div>

            <div>
              <span>Active Products</span>

              <strong>
                {
                  products.filter(
                    (product) =>
                      product.status === "Active"
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="summary-icon warning-icon">
              <Package size={21} />
            </div>

            <div>
              <span>Low Stock</span>

              <strong>
                {
                  products.filter(
                    (product) =>
                      product.stock > 0 &&
                      product.stock <= 5
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="summary-icon danger-icon">
              <Package size={21} />
            </div>

            <div>
              <span>Out of Stock</span>

              <strong>
                {
                  products.filter(
                    (product) => product.stock === 0
                  ).length
                }
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
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <button className="filter-button">
              <Filter size={17} />
              Filter
            </button>
          </div>

          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-table-info">
                        <div className="product-image-placeholder">
                          <Package size={20} />
                        </div>

                        <div>
                          <strong>
                            {product.name}
                          </strong>
                        </div>
                      </div>
                    </td>

                    <td>{product.category}</td>

                    <td className="product-price">
                      {formatPrice(product.price)}
                    </td>

                    <td>
                      <span
                        className={
                          product.stock === 0
                            ? "stock-danger"
                            : product.stock <= 5
                              ? "stock-warning"
                              : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`product-status ${
                          product.status
                            .toLowerCase()
                            .replaceAll(" ", "-")
                        }`}
                      >
                        {product.status}
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
                              product.id
                            )
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="table-action-button delete"
                          title="Delete product"
                          onClick={() =>
                            handleDeleteProduct(
                              product.id
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                        <button
                          type="button"
                          className="table-action-button"
                          title="More options"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-products">
              <Package size={35} />

              <h3>No products found</h3>

              <p>
                We couldn't find a product matching your
                search.
              </p>
            </div>
          )}

          <div className="table-pagination">
            <span>
              Showing {filteredProducts.length} of{" "}
              {products.length} products
            </span>

            <div>
              <button disabled>Previous</button>
              <button className="pagination-active">
                1
              </button>
              <button>Next</button>
            </div>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}

export default VendorProducts;