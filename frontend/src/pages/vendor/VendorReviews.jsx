import { useState } from "react";
import { Star, MessageSquare, Users, TrendingUp, Search } from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./vendor.css";

function VendorReviews() {
  const [searchTerm, setSearchTerm] = useState("");

  const reviews = [
    {
      id: 1,
      customer: "Sarah Williams",
      product: "Smart Watch",
      rating: 5,
      comment:
        "Excellent product. The quality is really good and delivery was fast.",
      date: "Sep 29, 2026",
    },
    {
      id: 2,
      customer: "David Johnson",
      product: "Wireless Headphones",
      rating: 4,
      comment: "Very good sound quality. Packaging was also excellent.",
      date: "Sep 28, 2026",
    },
    {
      id: 3,
      customer: "Michael James",
      product: "Laptop Backpack",
      rating: 5,
      comment:
        "The bag is spacious and feels very durable. Highly recommended.",
      date: "Sep 27, 2026",
    },
    {
      id: 4,
      customer: "Grace Peter",
      product: "Bluetooth Speaker",
      rating: 3,
      comment: "The speaker is good, but delivery took longer than expected.",
      date: "Sep 26, 2026",
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const search = searchTerm.toLowerCase();

    return (
      review.customer.toLowerCase().includes(search) ||
      review.product.toLowerCase().includes(search) ||
      review.comment.toLowerCase().includes(search)
    );
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={15}
        className={index < rating ? "review-star filled" : "review-star"}
      />
    ));
  };

  return (
    <DashboardLayout role="vendor">
      <section className="vendor-reviews-page">
        <div className="dashboard-page-heading">
          <div>
            <h1>Reviews</h1>
            <p>See what customers are saying about your products and store.</p>
          </div>
        </div>

        <div className="review-stat-grid">
          <article className="review-stat-card">
            <div className="review-stat-icon">
              <Star size={22} />
            </div>

            <div>
              <span>Average Rating</span>
              <strong>4.8</strong>
              <small>Out of 5 stars</small>
            </div>
          </article>

          <article className="review-stat-card">
            <div className="review-stat-icon blue">
              <MessageSquare size={22} />
            </div>

            <div>
              <span>Total Reviews</span>
              <strong>184</strong>
              <small>Across all products</small>
            </div>
          </article>

          <article className="review-stat-card">
            <div className="review-stat-icon orange">
              <Users size={22} />
            </div>

            <div>
              <span>5 Star Reviews</span>
              <strong>142</strong>
              <small>77% of all reviews</small>
            </div>
          </article>

          <article className="review-stat-card">
            <div className="review-stat-icon purple">
              <TrendingUp size={22} />
            </div>

            <div>
              <span>Rating Growth</span>
              <strong>+8.2%</strong>
              <small>This month</small>
            </div>
          </article>
        </div>
        <section className="review-insights-grid">
          <div className="review-rating-overview">
            <div className="rating-score">
              <span>Customer Satisfaction</span>

              <strong>4.8</strong>

              <div className="rating-big-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={17} className="review-star filled" />
                ))}
              </div>

              <p>Based on 184 customer reviews</p>
            </div>
          </div>

          <div className="rating-breakdown">
            {[
              { star: 5, percent: 77 },
              { star: 4, percent: 15 },
              { star: 3, percent: 5 },
              { star: 2, percent: 2 },
              { star: 1, percent: 1 },
            ].map((item) => (
              <div className="rating-breakdown-row" key={item.star}>
                <span>{item.star} ★</span>

                <div className="rating-progress">
                  <div
                    style={{
                      width: `${item.percent}%`,
                    }}
                  ></div>
                </div>

                <strong>{item.percent}%</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel reviews-panel">
          <div className="reviews-panel-header">
            <div>
              <h2>Customer Reviews</h2>
              <p>Recent feedback from your customers</p>
            </div>

            <div className="review-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-avatar">
                  {review.customer
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="review-content">
                  <div className="review-top">
                    <div>
                      <strong>{review.customer}</strong>

                      <span>Reviewed {review.product}</span>
                    </div>

                    <span className="review-date">{review.date}</span>
                  </div>

                  <div className="review-stars">
                    {renderStars(review.rating)}

                    <span>{review.rating}.0</span>
                  </div>

                  <p>{review.comment}</p>
                </div>
              </article>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="empty-orders">
              <MessageSquare size={35} />
              <h3>No reviews found</h3>
              <p>No customer reviews match your search.</p>
            </div>
          )}
        </section>
      </section>
    </DashboardLayout>
  );
}

export default VendorReviews;
