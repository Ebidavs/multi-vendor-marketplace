import { useState } from "react";
import {
  ArrowLeft,
  UploadCloud,
  Image,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import "./vendor.css";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    sku: "",
    status: "active",
  });

  const [imageName, setImageName] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImageName(file.name);
    }
  };

  const removeImage = () => {
    setImageName("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Product data:", formData);

    alert("Product form submitted successfully!");
  };

  return (
    <DashboardLayout role="vendor">
      <section className="add-product-page">

        <div className="add-product-header">
          <div className="add-product-heading">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/vendor/products")}
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1>Add New Product</h1>
              <p>
                Add a new product to your marketplace store.
              </p>
            </div>
          </div>
        </div>

        <form
          className="add-product-form"
          onSubmit={handleSubmit}
        >
          <div className="product-form-main">

            <section className="product-form-card">
              <div className="form-card-heading">
                <h2>Product Information</h2>
                <p>
                  Enter the basic information about your product.
                </p>
              </div>

              <div className="form-card-content">

                <div className="form-group">
                  <label htmlFor="name">
                    Product Name
                    <span>*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Wireless Headphones"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">
                    Category
                    <span>*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select a category
                    </option>
                    <option value="electronics">
                      Electronics
                    </option>
                    <option value="fashion">
                      Fashion
                    </option>
                    <option value="home">
                      Home & Living
                    </option>
                    <option value="beauty">
                      Beauty
                    </option>
                    <option value="sports">
                      Sports
                    </option>
                    <option value="food">
                      Food & Groceries
                    </option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">
                    Product Description
                    <span>*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    placeholder="Describe your product, its features and important details..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>

                  <small>
                    Give customers enough information to
                    understand the product.
                  </small>
                </div>

              </div>
            </section>

            <section className="product-form-card">
              <div className="form-card-heading">
                <h2>Pricing & Inventory</h2>
                <p>
                  Set the product price and available stock.
                </p>
              </div>

              <div className="form-card-content form-two-columns">

                <div className="form-group">
                  <label htmlFor="price">
                    Price (₦)
                    <span>*</span>
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">
                    Stock Quantity
                    <span>*</span>
                  </label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sku">
                    SKU
                  </label>

                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    placeholder="e.g. MKT-WH-001"
                    value={formData.sku}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">
                    Product Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="draft">
                      Draft
                    </option>
                  </select>
                </div>

              </div>
            </section>

          </div>

          <aside className="product-form-sidebar">

            <section className="product-form-card">
              <div className="form-card-heading">
                <h2>Product Image</h2>
                <p>
                  Upload a clear image of your product.
                </p>
              </div>

              <div className="form-card-content">

                {!imageName ? (
                  <label className="image-upload-area">
                    <UploadCloud size={35} />

                    <strong>
                      Upload product image
                    </strong>

                    <span>
                      PNG, JPG or JPEG
                    </span>

                    <span className="upload-button-text">
                      Choose Image
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                ) : (
                  <div className="selected-image">
                    <div className="selected-image-icon">
                      <Image size={28} />
                    </div>

                    <div>
                      <strong>{imageName}</strong>
                      <span>Image selected</span>
                    </div>

                    <button
                      type="button"
                      onClick={removeImage}
                    >
                      <X size={17} />
                    </button>
                  </div>
                )}

              </div>
            </section>

            <section className="product-form-card publish-card">
              <div className="form-card-heading">
                <h2>Publish Product</h2>
              </div>

              <div className="publish-content">
                <p>
                  Review your product information before
                  adding it to your store.
                </p>

                <button
                  type="submit"
                  className="publish-product-button"
                >
                  <Save size={18} />
                  Add Product
                </button>

                <button
                  type="button"
                  className="cancel-product-button"
                  onClick={() =>
                    navigate("/vendor/products")
                  }
                >
                  Cancel
                </button>
              </div>
            </section>

          </aside>
        </form>

      </section>
    </DashboardLayout>
  );
}

export default AddProduct;