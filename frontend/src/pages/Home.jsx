import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import shoppingImage from "../assets/web-shopping.svg";
import { useCategories } from "../hooks/useCategories";
import { getProducts } from "../services/api";
import { toProduct } from "../services/mappers";
import "./Home.css";

const FEATURED_QUERY = "?page=1&limit=6&sort=newest";


function Home({ onAddToCart }) {
  // Categories come from the backend so new admin-created
  // categories show up without frontend changes.
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    retry: retryCategories,
  } = useCategories();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [productsRetry, setProductsRetry] = useState(0);

  // Featured products come straight from the backend catalog.
  useEffect(() => {
    let isCurrent = true;

    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError("");

      try {
        const data = await getProducts(FEATURED_QUERY);

        if (!Array.isArray(data?.products)) {
          throw new Error(
            "The product service returned an invalid response."
          );
        }

        if (isCurrent) {
          setProducts(data.products.map(toProduct));
        }
      } catch (err) {
        if (isCurrent) {
          setProductsError(
            err.message || "Unable to load products."
          );
        }
      } finally {
        if (isCurrent) {
          setProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isCurrent = false;
    };
  }, [productsRetry]);

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="home-page">
      <main className="home-main">
        <section className="home-hero">
          <div className="hero-content">
            <span className="hero-label">Trusted marketplace</span>
            <h1>
              Discover amazing products from <span>top vendors</span>
            </h1>
            <p>
              Shop the best in electronics, fashion, beauty, home essentials, and more
              from trusted sellers in one seamless marketplace experience.
            </p>

            <div className="hero-buttons">
              <a href="#featured" className="primary-btn">
                Shop Now
              </a>
              <a href="#categories" className="secondary-btn">
                Browse Categories
              </a>
              <Link to="/vendor/register" className="secondary-btn vendor-btn">
                Become a Vendor
              </Link>
              <Link to="/admin/dashboard" className="secondary-btn vendor-btn">
                Admin Dashboard
              </Link>
            </div>

            <div className="hero-stats" aria-label="Marketplace statistics">
              <div>
                <strong>12k+</strong>
                <span>Products</span>
              </div>
              <div>
                <strong>1.8k+</strong>
                <span>Vendors</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Shopping illustration">
            <div className="floating-card card-top">
              <span>New</span>
              <strong>Spring Collection</strong>
            </div>
            <div className="floating-card card-bottom">
              <strong>4.9</strong>
              <span>Top rated</span>
            </div>
            <div className="visual-stack">
              <img src={shoppingImage} alt="Online shopping illustration" className="shopping-illustration" />
            </div>
          </div>
        </section>

        <section className="home-section" id="categories">
          <div className="section-heading">
            <span className="section-kicker">Browse Categories</span>
            <h2>Shop by category</h2>
          </div>

          {categoriesLoading ? (
            <p
              className="py-6 text-center text-sm text-gray-500"
              role="status"
            >
              Loading categories...
            </p>
          ) : categoriesError ? (
            <div className="py-6 text-center" role="alert">
              <p className="text-sm text-gray-600">
                {categoriesError}
              </p>
              <button
                type="button"
                onClick={retryCategories}
                className="mt-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Try again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No categories available yet.
            </p>
          ) : (
            <div className="category-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="category-card"
                >
                  <div className="category-icon" aria-hidden="true">
                    {category.icon || "🛍️"}
                  </div>
                  <h3>{category.name}</h3>
                  <p>
                    {category.description ||
                      (typeof category.productCount === "number"
                        ? `${category.productCount} products`
                        : "")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="featured-section" id="featured">
          <div className="section-heading featured-header">
            <div>
              <span className="section-kicker">Featured</span>
              <h2>Best sellers</h2>
            </div>
            <Link to="/products" className="section-link">
              View all
            </Link>
          </div>

          {productsLoading ? (
            <p
              className="py-8 text-center text-sm text-gray-500"
              role="status"
            >
              Loading products...
            </p>
          ) : productsError ? (
            <div className="py-8 text-center" role="alert">
              <p className="text-sm text-gray-600">
                {productsError}
              </p>
              <button
                type="button"
                onClick={() =>
                  setProductsRetry((retry) => retry + 1)
                }
                className="mt-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No products available yet. Check back soon!
            </p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="product-meta">
                    <span className="product-tag">
                      {product.category || "Marketplace"}
                    </span>
                    <h3>{product.title}</h3>
                    {product.rating ? (
                      <div
                        className="product-rating"
                        aria-label={`Rated ${product.rating} out of 5`}
                      >
                        <span>★★★★★</span>
                        <small>{product.rating}</small>
                      </div>
                    ) : null}
                    <div className="product-footer">
                      <strong>
                        ₦{(product.price || 0).toLocaleString()}
                      </strong>
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product)}
                      >
                        {product.inStock
                          ? "Add to cart"
                          : "Out of stock"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;