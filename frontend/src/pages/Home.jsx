import shoppingImage from "../assets/web-shopping.svg";
import heroImage from "../assets/hero.png"; 
import "./Home.css";


function Home() {
  const categories = [
    { icon: "💻", name: "Electronics", description: "Phones, laptops & gadgets" },
    { icon: "👗", name: "Fashion", description: "Clothing, shoes & accessories" },
    { icon: "🏠", name: "Home Living", description: "Furniture & home essentials" },
    { icon: "💄", name: "Beauty", description: "Makeup & self-care" },
    { icon: "🏃", name: "Sports", description: "Fitness gear & outdoor essentials" },
    { icon: "🛍️", name: "Deals", description: "Hot picks from trusted sellers" },
  ];

  const products = [
    {
      name: "Wireless Headphones",
      price: "N45,000",
      vendor: "SoundNest",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Smart Watch",
      price: "N60,000",
      vendor: "Urban Gear",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Ladies Handbag",
      price: "N32,000",
      vendor: "Veloura",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Premium Sneakers",
      price: "N28,000",
      vendor: "Stride Co.",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Perfume Set",
      price: "N25,000",
      vendor: "Bloom Atelier",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Kitchen Essentials",
      price: "N30,000",
      vendor: "HomeCraft",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    },
  ];

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

          <div className="category-grid">
            {categories.map((category) => (
              <article key={category.name} className="category-card">
                <div className="category-icon" aria-hidden="true">
                  {category.icon}
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="featured-section" id="featured">
          <div className="section-heading featured-header">
            <div>
              <span className="section-kicker">Featured</span>
              <h2>Best sellers</h2>
            </div>
            <a href="#" className="section-link">
              View all
            </a>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article key={product.name} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-meta">
                  <span className="product-tag">{product.vendor}</span>
                  <h3>{product.name}</h3>
                  <div className="product-rating" aria-label={`Rated ${product.rating} out of 5`}>
                    <span>★★★★★</span>
                    <small>{product.rating}</small>
                  </div>
                  <div className="product-footer">
                    <strong>{product.price}</strong>
                    <button type="button">Add to cart</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;