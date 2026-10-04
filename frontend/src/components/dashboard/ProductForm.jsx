import { Save } from "lucide-react";
import ImageUploader from "./ImageUploader";

function ProductForm({
  formData,
  onChange,
  images,
  onImagesChange,
  onRemoveImage,
  onSubmit,
  categories = [],
  submitText = "Save Product",
  title = "Product Information",
  description = "Enter the information about your product.",
}) {
  return (
    <form className="add-product-form" onSubmit={onSubmit}>
      <div className="product-form-main">
        <section className="product-form-card">
          <div className="form-card-heading">
            <h2>{title}</h2>
            <p>{description}</p>
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
                onChange={onChange}
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
                onChange={onChange}
                required
              >
                <option value="">Select a category</option>

                {categories.map((category) => (
                  <option
                    key={category._id || category.id}
                    value={category._id || category.id}
                  >
                    {category.name}
                  </option>
                ))}
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
                onChange={onChange}
                required
              />

              <small>
                Give customers enough information to understand the
                product.
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
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                Stock Quantity
                <span>*</span>
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={formData.stock}
                onChange={onChange}
                required
              />
            </div>
          </div>
        </section>
      </div>

      <aside className="product-form-sidebar">
        <ImageUploader
          images={images}
          onImagesChange={onImagesChange}
          onRemoveImage={onRemoveImage}
        />

        <section className="product-form-card publish-card">
          <div className="form-card-heading">
            <h2>Publish Product</h2>
          </div>

          <div className="publish-content">
            <p>
              Review your product information before saving it to
              your store.
            </p>

            <button
              type="submit"
              className="publish-product-button"
            >
              <Save size={18} />
              {submitText}
            </button>
          </div>
        </section>
      </aside>
    </form>
  );
}

export default ProductForm;